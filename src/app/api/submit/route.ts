import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { parseDocument } from "@/utils/file-parser";
import { composeGradingPrompt } from "@/lib/grading/prompt-composer";
import { getLLMProvider } from "@/lib/grading/providers";
import { parseLLMResponse } from "@/lib/grading/response-parser";
import { normalizeModel, normalizeProvider } from "@/lib/grading/model-policy";
import { computeWeightedTotal, reconcileRubricScores } from "@/lib/grading/policy";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const nim = formData.get("nim")?.toString().trim();
    const name = formData.get("name")?.toString().trim();
    const textAnswer = formData.get("answer")?.toString().trim() || "";
    const file = formData.get("file") as File | null;

    if (!nim || !name) {
      return NextResponse.json(
        { error: "Parameter NIM dan Nama harus disertakan." },
        { status: 400 }
      );
    }

    let filePath: string | null = null;
    let extractedText = "";

    const supabase = createAdminClient();

    // 1. Process File Upload & Extraction if present
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Upload to Supabase Storage Bucket 'student-submissions'
      const storagePath = `${nim}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("student-submissions")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: true
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return NextResponse.json(
          { error: `Gagal mengunggah berkas ke storage: ${uploadError.message}` },
          { status: 500 }
        );
      }

      filePath = uploadData.path;

      // Extract text content using document parser
      try {
        extractedText = await parseDocument(buffer, file.name);
      } catch (err: any) {
        console.error("Text extraction error:", err);
        return NextResponse.json(
          { error: `Gagal mengekstrak teks dari dokumen: ${err.message}` },
          { status: 400 }
        );
      }
    }

    // Combine manual text input + extracted text from document
    const finalAnswerText = [textAnswer, extractedText].filter(Boolean).join("\n\n").trim();
    if (!finalAnswerText) {
      return NextResponse.json(
        { error: "Tidak ada jawaban teks maupun dokumen valid yang dikirimkan." },
        { status: 400 }
      );
    }

    // 2. Fetch or Auto-Initialize Demo Assignment & Rubrics
    let { data: assignment, error: assignmentError } = await supabase
      .from("assignments")
      .select("id, title, question, reference_context, model")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (assignmentError) {
      console.error("Database query error:", assignmentError);
    }

    // Failsafe initialization for Thesis Demo
    if (!assignment) {
      const { data: newAssignment, error: insertError } = await supabase
        .from("assignments")
        .insert({
          course_code: "IF204",
          title: "Praktikum 2: Inner Join & Subquery",
          model: "openai/gpt-oss-120b",
          question: "Tuliskan sintaks query SQL untuk menampilkan nama mahasiswa (student_name), nama mata kuliah (course_name), dan nilai akhir (grade) yang diambil dari tabel mahasiswa, matakuliah, dan KRS. Kuncinya adalah hanya menampilkan data mahasiswa yang memiliki nilai di atas 80 dan menggunakan klausa JOIN secara benar. Jelaskan alur eksekusi query tersebut.",
          reference_context: `SKEMA TABEL DATABASE REFERENSI:\n1. mahasiswa (id INT PRIMARY KEY, student_name VARCHAR(100))\n2. matakuliah (id INT PRIMARY KEY, course_name VARCHAR(100))\n3. krs (id INT PRIMARY KEY, mahasiswa_id INT, matakuliah_id INT, grade INT, FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id), FOREIGN KEY (matakuliah_id) REFERENCES matakuliah(id))\n\nSINTAKS QUERY YANG BENAR (GROUND TRUTH):\nSELECT m.student_name, mk.course_name, k.grade\nFROM mahasiswa m\nINNER JOIN krs k ON m.id = k.mahasiswa_id\nINNER JOIN matakuliah mk ON k.matakuliah_id = mk.id\nWHERE k.grade > 80;\n\nPENJELASAN LOGIS WAJIB:\n- FROM klausa dijalankan awal.\n- INNER JOIN m ke k ke mk dilakukan melalui key relasi mahasiswa_id dan matakuliah_id.\n- WHERE k.grade > 80 untuk menyaring data nilai di atas 80.\n- SELECT memproyeksikan nama mahasiswa, nama mk, dan grade.`
        })
        .select()
        .single();

      if (insertError || !newAssignment) {
        return NextResponse.json(
          { error: `Gagal melakukan inisialisasi tugas otomatis: ${insertError?.message}` },
          { status: 500 }
        );
      }

      assignment = newAssignment;

      // Add corresponding rubrics
      const defaultRubrics = [
        { assignment_id: newAssignment.id, aspect_name: "Kebenaran Sintaks SQL", weight: 40, description: "Sintaks SELECT, FROM, JOIN, dan WHERE harus ditulis dengan benar tanpa syntax error." },
        { assignment_id: newAssignment.id, aspect_name: "Logika Join & Relasi Tabel", weight: 30, description: "Kebenaran penghubung antar-tabel mahasiswa ke krs dan krs ke matakuliah." },
        { assignment_id: newAssignment.id, aspect_name: "Akurasi Penjelasan Alur", weight: 30, description: "Ketepatan penjelasan urutan logika pemrosesan query (logical processing order)." }
      ];

      await supabase.from("rubrics").insert(defaultRubrics);
    }

    if (!assignment) {
      return NextResponse.json(
        { error: "Tugas praktikum tidak ditemukan." },
        { status: 500 }
      );
    }

    // 3. Save Initial Submission to Supabase Database (Grade is null initially)
    const { data: submission, error: submissionInsertError } = await supabase
      .from("submissions")
      .insert({
        assignment_id: assignment.id,
        nim,
        student_name: name,
        file_path: filePath,
        raw_answer_text: finalAnswerText,
        ai_score: null,
        final_score: null,
        status: "Graded",
        cot_log: null
      })
      .select("id")
      .single();

    if (submissionInsertError || !submission) {
      console.error("Database insert error:", submissionInsertError);
      return NextResponse.json(
        { error: `Gagal menyimpan jawaban mahasiswa: ${submissionInsertError?.message}` },
        { status: 500 }
      );
    }

    // 4. Return Success Data with submissionId
    return NextResponse.json({
      success: true,
      submissionId: submission.id
    });

  } catch (error: any) {
    console.error("Internal API error:", error);
    return NextResponse.json(
      { error: `Terjadi kegagalan server internal: ${error.message}` },
      { status: 500 }
    );
  }
}
