import csv
import os
import shutil
import re

def normalize(text):
    return re.sub(r'[^a-z0-9]', '', text.lower())

def main():
    cleaned_csv = "docs/IF23A_cleaned.csv"
    downloads_dir = os.path.expanduser("~/Downloads")
    dest_dir = "jawaban_mahasiswa"

    if not os.path.exists(cleaned_csv):
        print("Cleaned CSV not found!")
        return

    # Create destination directory if not exists
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)
        print(f"Created directory: {dest_dir}")
    else:
        print(f"Directory {dest_dir} already exists.")

    # Read the 33 cleaned students
    students = []
    with open(cleaned_csv, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            students.append({
                "nim": row["nim"].strip(),
                "name": row["nama_mahasiswa"].strip(),
                "norm_name": normalize(row["nama_mahasiswa"])
            })

    print(f"Loaded {len(students)} students from cleaned CSV.")

    # Exact outliers to ignore (NIMs and normalized full names)
    outlier_nims = ["230102073", "230102125", "230102068", "230102063"]
    outlier_names = ["melanianggraena", "tiapebriyanti", "muhammadlutfiarisaputra", "jeisyamelikelarsy"]

    # Scan Downloads
    files = os.listdir(downloads_dir)
    doc_extensions = (".pdf", ".docx", ".doc", ".txt")

    copied_count = 0
    ignored_count = 0

    for file in files:
        # Only check document files
        if not file.lower().endswith(doc_extensions):
            continue
            
        file_path = os.path.join(downloads_dir, file)
        if os.path.isdir(file_path):
            continue

        norm_file = normalize(file)

        # Check if it belongs to one of the outliers or excluded students
        is_outlier = False
        for nim in outlier_nims:
            if nim in file:
                is_outlier = True
                break
        
        if not is_outlier:
            for name in outlier_names:
                if name in norm_file:
                    is_outlier = True
                    break
        
        if is_outlier:
            print(f"Ignoring outlier/excluded file: {file}")
            ignored_count += 1
            continue

        # Check match with our 33 students
        matched_student = None
        
        # 1. Match by NIM
        for s in students:
            if s["nim"] in file:
                matched_student = s
                break

        # 2. Match by full name or parts of the name
        if not matched_student:
            for s in students:
                # Direct check
                if s["norm_name"] in norm_file or norm_file.startswith(s["norm_name"]) or s["norm_name"].startswith(norm_file):
                    matched_student = s
                    break
                
                # Check for first and second name parts
                parts = [p for p in s["name"].lower().split() if len(p) > 3]
                if parts and all(p in norm_file for p in parts[:2]):
                    matched_student = s
                    break

        # 3. Special Manual matching adjustments for typos/variations
        if not matched_student:
            if "daffa" in norm_file and "230" in norm_file:
                # Dafffa Aqyla Riyadi (230102031) - typo in filename NIM '2300102031' or name 'Daffa'
                matched_student = next((s for s in students if s["nim"] == "230102031"), None)
            elif "decky" in norm_file:
                # Decky Registian Lesmana (230102034)
                matched_student = next((s for s in students if s["nim"] == "230102034"), None)

        if matched_student:
            # Copy to destination
            dest_path = os.path.join(dest_dir, file)
            shutil.copy2(file_path, dest_path)
            print(f"Copied: {file} -> [Student: {matched_student['name']}]")
            copied_count += 1
        else:
            # Check if it is an unnamed student doc (generic file name)
            keywords = ["praktikum", "tugas", "modul", "dbms", "sql", "basis data", "basis_data", "prak"]
            if any(kw in file.lower() for kw in keywords):
                # Copy as unnamed
                dest_path = os.path.join(dest_dir, file)
                shutil.copy2(file_path, dest_path)
                print(f"Copied unnamed/generic doc: {file}")
                copied_count += 1
            else:
                # Completely unrelated file
                pass

    print(f"\nFinished copying files.")
    print(f"Total files copied to '{dest_dir}': {copied_count}")
    print(f"Total outlier files ignored: {ignored_count}")

if __name__ == "__main__":
    main()
