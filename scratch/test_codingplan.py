import requests

payload = {
    "model": "deepseek-v4-pro",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "stream": False
}

apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754"

combinations = [
    # (domain, path, headers)
    ("codingplan.alayanew.com", "/v1/chat/completions", {"Authorization": f"Bearer {apiKey}"}),
    ("codingplan.alayanew.com", "/v1/chat/completions", {"X-Proxy-Key": apiKey}),
    ("codingplan.alayanew.com", "/chat/completions", {"Authorization": f"Bearer {apiKey}"}),
    ("codingplan.alayanew.com", "/chat/completions", {"X-Proxy-Key": apiKey}),
    ("codingplan.alayanew.com", "/api/innoreation/v1/proxy/chat/completions", {"Authorization": f"Bearer {apiKey}"}),
    ("codingplan.alayanew.com", "/api/innoreation/v1/proxy/chat/completions", {"X-Proxy-Key": apiKey}),
    ("codingplan.alayanew.com", "/api/innoreation/v1/proxy", {"Authorization": f"Bearer {apiKey}"}),
    ("codingplan.alayanew.com", "/api/innoreation/v1/proxy", {"X-Proxy-Key": apiKey}),
]

for domain, path, h in combinations:
    url = f"https://{domain}{path}"
    headers = {"Content-Type": "application/json"}
    headers.update(h)
    print(f"Testing {url} with headers {list(h.keys())} ...")
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=5)
        print("  Status Code:", r.status_code)
        print("  Body:", r.text[:300])
    except Exception as e:
        print("  Error:", e)
    print("-" * 50)
