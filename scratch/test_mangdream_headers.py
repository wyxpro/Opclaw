import requests

url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"
apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754"
payload = {
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "stream": False
}

headers_base = {
    "Content-Type": "application/json",
    "X-Proxy-Key": apiKey
}

# Test cases with different request headers
cases = [
    ("No extra headers", {}),
    ("Vercel User-Agent", {"User-Agent": "Mozilla/5.0 (compatible; Vercel Edge Function)"}),
    ("Cloudflare/Vercel headers", {
        "User-Agent": "Vercel Edge",
        "X-Forwarded-For": "203.0.113.195",
        "X-Vercel-Id": "hkg1::s9j2s-16299102-abcd"
      }),
]

for name, extra_h in cases:
    h = headers_base.copy()
    h.update(extra_h)
    print(f"--- Testing {name} ---")
    try:
        r = requests.post(url, headers=h, json=payload, timeout=10)
        print("Status Code:", r.status_code)
        print("Response:", r.text[:300])
    except Exception as e:
        print("Error:", e)
    print("-" * 50)
