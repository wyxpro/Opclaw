import requests
import json

payload = {
    "model": "deepseek-v4-pro",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "stream": False
}

apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754"
appId = "iD3DfwgriXjTxeE6"
session = {"isMock": True, "userId": "mock-user-id", "email": "wyxcode@qq.com"}

combinations = [
    # 1. Just apiKey in X-Proxy-Key
    {"X-Proxy-Key": apiKey},
    # 2. X-Proxy-Key and X-Eazo-App-Id
    {"X-Proxy-Key": apiKey, "X-Eazo-App-Id": appId},
    # 3. X-Proxy-Key, X-Eazo-App-Id, and session
    {"X-Proxy-Key": apiKey, "X-Eazo-App-Id": appId, "x-eazo-session": json.dumps(session)},
    # 4. Bearer Authorization
    {"Authorization": f"Bearer {apiKey}"},
    # 5. Bearer Authorization and X-Eazo-App-Id
    {"Authorization": f"Bearer {apiKey}", "X-Eazo-App-Id": appId},
]

url = "https://eazo.ai/api/innoreation/v1/proxy/chat/completions"

for i, h in enumerate(combinations):
    headers = {"Content-Type": "application/json"}
    headers.update(h)
    print(f"Test case {i+1} headers: {list(h.keys())}")
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=5)
        print("  Status Code:", r.status_code)
        print("  Body:", r.text[:300])
    except Exception as e:
        print("  Error:", e)
    print("-" * 50)
