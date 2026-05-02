import os
import json

base_path = r'public\vibe_images\person'
result = {}

for folder in ['boy', 'girl']:
    path = os.path.join(base_path, folder)
    if os.path.exists(path):
        result[folder] = os.listdir(path)

with open(r'scratch\avatars.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=4)
