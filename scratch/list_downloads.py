import csv
import os
import re

def normalize(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())

def main():
    cleaned_csv = "docs/IF23A_cleaned.csv"
    downloads_dir = os.path.expanduser("~/Downloads")
    
    if not os.path.exists(cleaned_csv):
        print("Cleaned CSV not found!")
        return

    # Read students
    students = []
    with open(cleaned_csv, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            students.append({
                "nim": row["nim"].strip(),
                "name": row["nama_mahasiswa"].strip(),
                "norm_name": normalize(row["nama_mahasiswa"])
            })

    print(f"Total students in cleaned list: {len(students)}")

    # Scan Downloads
    files = os.listdir(downloads_dir)
    print(f"Total files in downloads: {len(files)}")

    matched_files = []
    unmatched_files = []
    unnamed_docs = []

    # Patterns for student documents
    doc_extensions = (".pdf", ".docx", ".doc", ".txt", ".xlsx", ".csv")

    for file in files:
        if not file.lower().endswith(doc_extensions):
            continue
            
        file_path = os.path.join(downloads_dir, file)
        if os.path.isdir(file_path):
            continue

        norm_file = normalize(file)
        
        # Check NIM first
        matched_student = None
        for s in students:
            if s["nim"] in file:
                matched_student = s
                break
                
        # Check Name
        if not matched_student:
            for s in students:
                # if normalized name is in normalized file name
                if s["norm_name"] in norm_file or norm_file.startswith(s["norm_name"]) or s["norm_name"].startswith(norm_file):
                    matched_student = s
                    break
                # Try parts of name
                name_parts = [p for p in s["norm_name"] if len(p) > 3]
                if name_parts and all(part in norm_file for part in name_parts[:2]):
                    matched_student = s
                    break

        if matched_student:
            matched_files.append((file, matched_student))
        else:
            # Check if it looks like a student submission but has no name
            # e.g., files containing "Praktikum", "Tugas", "Modul", "DBMS", "SQL", "Basis Data"
            keywords = ["praktikum", "tugas", "modul", "dbms", "sql", "basis data", "basis_data", "prak"]
            if any(kw in file.lower() for kw in keywords):
                unnamed_docs.append(file)
            else:
                unmatched_files.append(file)

    print("\n--- MATCHED FILES FOR CLEANED STUDENTS ---")
    for f, s in matched_files:
        print(f"File: {f} -> Student: {s['name']} ({s['nim']})")

    print("\n--- UNNAMED STUDENT DOCUMENTS ---")
    for f in unnamed_docs:
        print(f"File: {f}")

    print("\n--- OTHER FILES ---")
    print(f"Total other unmatched files: {len(unmatched_files)}")

if __name__ == "__main__":
    main()
