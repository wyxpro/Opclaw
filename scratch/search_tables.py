import os

tables = [
    "user_profiles", "friend_links", "danmaku_messages", "digital_cards",
    "learning_articles", "learning_resumes", "learning_ai_chats",
    "love_couple_info", "love_timeline", "love_wishes", "love_blessings",
    "life_travel_locations", "life_moments", "life_entertainment",
    "work_bookmarks", "work_media_contents", "work_media_posts",
    "work_ecommerce", "ai_sessions", "ai_voice_clones", "ai_avatar_clones",
    "ai_shares"
]

src_dir = r"e:\Code\AI\Start\Web\Opclaw\src"

found_tables = {}
for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".ts", ".tsx", ".js", ".jsx")):
            path = os.path.join(root, file)
            try:
                content = open(path, "r", encoding="utf-8", errors="ignore").read()
                for t in tables:
                    if f"'{t}'" in content or f'"{t}"' in content or f"`{t}`" in content:
                        found_tables.setdefault(t, []).append(os.path.relpath(path, src_dir))
            except Exception as e:
                pass

for t, paths in found_tables.items():
    print(f"Table '{t}' is used in:")
    for p in paths:
        print(f"  - {p}")
