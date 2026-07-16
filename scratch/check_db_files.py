import os
import re
import requests

def main():
    # Read .env file for credentials
    env_path = ".env"
    if not os.path.exists(env_path):
        print(".env not found!")
        return

    url = None
    key = None
    with open(env_path, "r") as f:
        for line in f:
            parts = line.strip().split("=")
            if len(parts) >= 2:
                k = parts[0].strip()
                v = "=".join(parts[1:]).strip().strip("'\"")
                if k == "NEXT_PUBLIC_SUPABASE_URL":
                    url = v
                elif k == "NEXT_PUBLIC_SUPABASE_ANON_KEY":
                    key = v

    if not url or not key:
        print("Supabase URL or Key not found in .env")
        return

    # Request submissions
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}"
    }
    # Fetch nim, student_name, file_path
    req_url = f"{url}/rest/v1/submissions?select=nim,student_name,file_path&order=nim"
    res = requests.get(req_url, headers=headers)
    if res.status_code != 200:
        print(f"Error fetching: {res.status_code} - {res.text}")
        return

    data = res.json()
    print(f"Fetched {len(data)} submissions from Supabase.")
    
    print("\n--- DB FILE PATHS ---")
    for sub in data:
        print(f"{sub['nim']} - {sub['student_name']}: {sub['file_path']}")

if __name__ == "__main__":
    main()
