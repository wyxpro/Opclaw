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

endpoints = [
    ("api.eazo.ai", "/api/innoreation/v1/proxy/chat/completions"),
    ("api.eazo.ai", "/api/innoreation/v1/proxy"),
    ("api.eazo.ai", "/v1/chat/completions"),
]

for host, path in endpoints:
    url = f"https://{host}{path}"
    for h_type in ["X-Proxy-Key", "Authorization"]:
        headers = {"Content-Type": "application/json"}
        if h_type == "X-Proxy-Key":
            headers["X-Proxy-Key"] = apiKey
        else:
            headers["Authorization"] = f"Bearer {apiKey}"
            
        print(f"Testing {url} with {h_type} ...")
        try:
            r = requests.post(url, headers=headers, json=payload, timeout=5)
            print("  Status Code:", r.status_code)
            print("  Body:", r.text[:300])
        except Exception as e:
            print("  Error:", e)
        print("-" * 50)
