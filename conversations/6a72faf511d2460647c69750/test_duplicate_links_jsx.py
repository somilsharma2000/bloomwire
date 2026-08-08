import os, re
from collections import defaultdict

base_dir = "bloomwire"

href_map = defaultdict(list)

for root, dirs, files in os.walk(os.path.join(base_dir, "src")):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            rel = os.path.relpath(path, base_dir)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            lines = content.splitlines()
            for idx, line in enumerate(lines, 1):
                # Find all href=... or to=... including dynamic expressions or string literals
                matches = re.findall(r'(?:href|to)\s*=\s*(?:["\']([^"\']+)["\']|\{([^}]+)\})', line)
                for m in matches:
                    val = m[0] if m[0] else m[1]
                    href_map[rel].append((idx, val, line.strip()))

print("--- DETAILED HREF/TO DUP CHECK ---")
for file_path, items in href_map.items():
    urls = [it[1] for it in items]
    url_counts = defaultdict(int)
    for u in urls:
        url_counts[u] += 1
    
    duplicates = {u: count for u, count in url_counts.items() if count > 1}
    if duplicates:
        print(f"\nFile: {file_path}")
        for u, count in duplicates.items():
            print(f"  Target: `{u}` appears {count} times")
            for idx, url_val, line in items:
                if url_val == u:
                    print(f"    Line {idx}: {line[:100]}")

