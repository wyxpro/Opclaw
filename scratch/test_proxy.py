import requests

payload = {
    "model": "deepseek-v4-pro",
    "messages": [
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "stream": False
}

headers = {
    "Content-Type": "application/json",
    "X-Proxy-Key": "sk-02260d10c28c4bb4b65bace15ba5f754"
}

endpoints = [
    "https://eazo.ai/api/innoreation/v1/proxy",
    "https://eazo.ai/api/innoreation/v1/proxy/chat/completions",
    "https://codingplan.alayanew.com/api/innoreation/v1/proxy",
    "https://codingplan.alayanew.com/api/innoreation/v1/proxy/chat/completions",
]

for url in endpoints:
    print(f"Testing {url} ...")
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=10)
        print("Status Code:", r.status_code)
        print("Headers:", dict(r.headers))
        print("Body:", r.text[:500])
    except Exception as e:
        print("Error:", e)
    print("-" * 50)
