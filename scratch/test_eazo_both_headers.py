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

headers = {
    "Content-Type": "application/json",
    "X-Proxy-Key": apiKey,
    "Authorization": f"Bearer {apiKey}"
}

url = "https://eazo.ai/api/innoreation/v1/proxy"
print(f"Testing POST {url} with BOTH headers...")
try:
    r = requests.post(url, headers=headers, json=payload, timeout=5)
    print("Status Code:", r.status_code)
    print("Body:", r.text[:300])
except Exception as e:
    print("Error:", e)
