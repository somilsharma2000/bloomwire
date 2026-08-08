import os, re

base_dir = "bloomwire"

# Check all files for creator instagram links or social links
for root, dirs, files in os.walk(os.path.join(base_dir, "src")):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            path = os.path.join(root, file)
            rel = os.path.relpath(path, base_dir)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            for idx, line in enumerate(lines, 1):
                if any(k in line.lower() for k in ['instagram', 'social', 'creator']):
                    if any(link in line for link in ['http', 'instagram.com', 'wa.me', 'threads.com', 'facebook.com']):
                        print(f"{rel}:{idx} -> {line.strip()}")

