import requests
import sys

payload = {
    "model": "deepseek-v4-pro",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "stream": False
}

apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754"
url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"

headers = {
    "Content-Type": "application/json",
    "X-Proxy-Key": apiKey
}

try:
    r = requests.post(url, headers=headers, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    # Write to a file with utf-8 encoding to avoid Windows console encoding issues
    with open("scratch/response.txt", "w", encoding="utf-8") as f:
        f.write(r.text)
    print("Successfully wrote response to scratch/response.txt")
except Exception as e:
    print("Error:", e)
