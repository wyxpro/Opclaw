import requests

url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"
# Using SiliconFlow API key as X-Proxy-Key
apiKey = "sk-pvwohrxnrbqyamwxabzjqsavprkherzqqwfkgpintrzoerxs"
payload = {
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "stream": False
}

headers = {
    "Content-Type": "application/json",
    "X-Proxy-Key": apiKey
}

try:
    r = requests.post(url, headers=headers, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)
