import os, re

base_dir = "bloomwire"

files_to_check = []
for root, dirs, files in os.walk(os.path.join(base_dir, "src")):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            files_to_check.append(os.path.join(root, file))

code_keywords = ['referral', 'coupon', 'code', 'discount', 'creator', 'promo', 'voucher']

findings = []

for filepath in files_to_check:
    rel_path = os.path.relpath(filepath, base_dir)
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for idx, line in enumerate(lines, 1):
        # Look for hardcoded strings that match coupon/referral patterns or keywords
        # e.g., 'BLOOM', 'WELCOME', 'SAVE', 'DISCOUNT', 'REWARD-', etc.
        # or string literals assigned to code/referral fields
        matches = re.findall(r"['\"]([A-Z0-9_\-]{3,20})['\"]", line)
        for m in matches:
            if any(k in m for k in ['BLOOM', 'SAVE', 'WELCOME', 'CREATOR', 'REF', 'REWARD', 'OFF', 'FLAT', 'PETAL', 'SUPER', 'SUMMER', 'VIP', 'GIFT', 'DEAL', 'CODE']):
                findings.append((rel_path, idx, m, line.strip()))

print("Found hardcoded code-like string literals:")
for path, line_no, token, line_text in findings:
    print(f"{path}:{line_no} -> '{token}' | {line_text[:100]}")

