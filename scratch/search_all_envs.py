import os

root_dir = r"e:\Code\AI\Start\Web"
search_str = "DEEPSEEK"

for root, dirs, files in os.walk(root_dir):
    if "node_modules" in root or ".git" in root:
        continue
    for file in files:
        if file.startswith(".env"):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    for line in f:
                        if search_str in line:
                            print(f"{path}: {line.strip()}")
            except Exception as e:
                pass
