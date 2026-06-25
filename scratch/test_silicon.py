import requests

url = "https://api.siliconflow.cn/v1/chat/completions"
headers = {
    "Authorization": "Bearer sk-pvwohrxnrbqyamwxabzjqsavprkherzqqwfkgpintrzoerxs",
    "Content-Type": "application/json"
}
payload = {
    "model": "deepseek-ai/DeepSeek-V3",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": False
}

try:
    r = requests.post(url, headers=headers, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text[:500])
except Exception as e:
    print("Error:", e)
