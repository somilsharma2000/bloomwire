import os, re
from collections import defaultdict

base_dir = "bloomwire"

for root, dirs, files in os.walk(os.path.join(base_dir, "src")):
    for file in sorted(files):
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            rel = os.path.relpath(path, base_dir)
            with open(path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Map url -> list of (line_num, line_str, tag_type)
            url_map = defaultdict(list)
            
            for idx, line in enumerate(lines, 1):
                # Search for href="...", href='...', to="...", to='...'
                # Also <a href=...> or <Link to=...>
                matches = re.findall(r'(?:href|to)=["\']([^"\']+)["\']', line)
                for m in matches:
                    url_map[m].append((idx, line.strip()))
            
            dups = {u: lst for u, lst in url_map.items() if len(lst) > 1}
            if dups:
                print(f"=== {rel} ===")
                for u, lst in dups.items():
                    print(f"  URL: '{u}' ({len(lst)} occurrences):")
                    for line_num, ltxt in lst:
                        print(f"    Line {line_num}: {ltxt[:110]}")
                print()

