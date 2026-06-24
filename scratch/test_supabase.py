import requests

url = "https://fihfkyblyppyfhpjbaet.supabase.co/rest/v1/user_profiles"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaGZreWJseXBweWZocGpiYWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODY1NTgsImV4cCI6MjA5MDM2MjU1OH0.h7c_sRJvIr5tCXd6b8kipe3vPjbTXeVVc8m14cElqRY"

headers = {
    "apikey": anon_key,
    "Authorization": f"Bearer {anon_key}"
}

print("Testing user_profiles...")
try:
    r = requests.get(url, headers=headers, timeout=5)
    print("Status Code:", r.status_code)
    print("Headers:", dict(r.headers))
    print("Body:", r.text[:500])
except Exception as e:
    print("Error:", e)

print("-" * 50)
print("Testing root/spec...")
try:
    # Get swagger spec to list tables
    r = requests.get("https://fihfkyblyppyfhpjbaet.supabase.co/rest/v1/", headers=headers, timeout=5)
    print("Status Code:", r.status_code)
    if r.status_code == 200:
        spec = r.json()
        print("Available tables/definitions:")
        print(list(spec.get("definitions", {}).keys()))
    else:
        print("Body:", r.text[:300])
except Exception as e:
    print("Error:", e)
