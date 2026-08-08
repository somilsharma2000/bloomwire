import os, re

base_dir = "bloomwire"

for root, dirs, files in os.walk(os.path.join(base_dir, "src")):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            lines = content.splitlines()
            for idx, line in enumerate(lines, 1):
                # Search for any string literals containing code/coupon/referral
                for match in re.finditer(r"['\"]([^'\"]*)['\"]", line):
                    val = match.group(1)
                    if any(term in val.lower() for term in ['referral', 'coupon', 'promo', 'discount']) and len(val) < 50:
                        rel = os.path.relpath(path, base_dir)
                        # Filter out common UI labels unless relevant
                        print(f"{rel}:{idx} -> {val}")

