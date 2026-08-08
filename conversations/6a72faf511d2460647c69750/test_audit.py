import os, re

base_dir = "bloomwire"

def read_file(rel_path):
    path = os.path.join(base_dir, rel_path)
    if not os.path.exists(path):
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

print("--- 1. src/pages/Creators.tsx ---")
creators_content = read_file("src/pages/Creators.tsx")
lines = creators_content.splitlines()
for i, line in enumerate(lines, 1):
    if any(k in line.lower() for k in ['code', 'referral', 'creator', 'instagram', 'href', 'http', 'social']):
        print(f"Line {i}: {line.strip()[:120]}")

