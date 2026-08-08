import os, re

# Let's inspect all places where creators or referral codes are handled or defined
base_dir = "bloomwire"

files = [
    'src/pages/Creators.tsx',
    'src/data/business.ts',
    'src/pages/Rewards.tsx',
    'src/store/authStore.ts',
    'src/components/admin/CreatorsReferrals.tsx',
    'src/store/rewardsStore.ts',
    'src/components/admin/OffersRaffle.tsx'
]

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        print(f"=== {f} ===")
        with open(path) as fh:
            text = fh.read()
        # Find any referralCode or code definitions
        lines = text.splitlines()
        for i, l in enumerate(lines, 1):
            if any(k in l.lower() for k in ['referralcode', 'code', 'bloom-']):
                print(f"  Line {i}: {l.strip()[:100]}")
