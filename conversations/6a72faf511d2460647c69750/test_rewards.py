import re

with open('bloomwire/src/pages/Rewards.tsx', 'r') as f:
    text = f.read()

for i, line in enumerate(text.splitlines(), 1):
    if any(k in line for k in ['referral', 'referralCode', 'generate', 'code', 'BW-']):
        print(f"Line {i}: {line[:120]}")
