import os

root_dir = r"e:\Code\AI\Start\Web"
search_str = "iD3DfwgriXjTxeE6"

for root, dirs, files in os.walk(root_dir):
    # Skip node_modules and .git
    if "node_modules" in root or ".git" in root:
        continue
    for file in files:
        path = os.path.join(root, file)
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
                if search_str in content:
                    print(f"Found in {path}")
        except Exception as e:
            pass
