import os

brain_dir = r"C:\Users\Administrator\.gemini\antigravity\brain"
keywords = ["eazo.ai", "innoreation", "codingplan"]

for root, dirs, files in os.walk(brain_dir):
    for file in files:
        if file == "overview.txt":
            path = os.path.join(root, file)
            try:
                content = open(path, errors="ignore").read()
                found = [kw for kw in keywords if kw in content]
                if found:
                    print(f"Found {found} in {path}")
                    # Print lines containing the keywords
                    lines = content.splitlines()
                    for idx, line in enumerate(lines):
                        if any(kw in line for kw in keywords):
                            print(f"  Line {idx+1}: {line[:200]}")
            except Exception as e:
                pass
