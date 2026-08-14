import csv
import os
import re

def normalize(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())

def main():
    cleaned_csv = "docs/IF23A_cleaned.csv"
    dest_dir = "jawaban_mahasiswa"

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

    # Read files in folder
    files = [f for f in os.listdir(dest_dir) if os.path.isfile(os.path.join(dest_dir, f))]

    student_to_files = {s["nim"]: [] for s in students}
    unmatched_files = []

    for file in files:
        norm_file = normalize(file)
        matched_student = None

        # 1. Match by NIM
        for s in students:
            if s["nim"] in file:
                matched_student = s
                break

        # 2. Match by Name
        if not matched_student:
            for s in students:
                if s["norm_name"] in norm_file or norm_file.startswith(s["norm_name"]) or s["norm_name"].startswith(norm_file):
                    matched_student = s
                    break
                
                parts = [p for p in s["name"].lower().split() if len(p) > 3]
                if parts and all(p in norm_file for p in parts[:2]):
                    matched_student = s
                    break

        # 3. Special matching
        if not matched_student:
            if "daffa" in norm_file and "230" in norm_file:
                matched_student = next((s for s in students if s["nim"] == "230102031"), None)
            elif "decky" in norm_file:
                matched_student = next((s for s in students if s["nim"] == "230102034"), None)

        if matched_student:
            student_to_files[matched_student["nim"]].append(file)
        else:
            unmatched_files.append(file)

    print(f"Total files in folder: {len(files)}")
    print(f"Total unmatched files: {len(unmatched_files)}")
    if unmatched_files:
        print("\n--- UNMATCHED FILES IN FOLDER ---")
        for uf in unmatched_files:
            print(uf)

    print("\n--- FILE COUNT PER STUDENT ---")
    no_file_students = []
    for s in students:
        f_list = student_to_files[s["nim"]]
        print(f"{s['nim']} - {s['name']}: {len(f_list)} files {f_list if f_list else ''}")
        if len(f_list) == 0:
            no_file_students.append(s)

    print(f"\nTotal students with 0 files: {len(no_file_students)}")
    for nfs in no_file_students:
        print(f"No file for: {nfs['name']} ({nfs['nim']})")

if __name__ == "__main__":
    main()
