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
url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"

# Test 1: Standard request (no custom origin)
print("Testing standard request...")
try:
    r = requests.post(url, headers={"X-Proxy-Key": apiKey, "Content-Type": "application/json"}, json=payload)
    print("  Status:", r.status_code)
    print("  CORS Headers:")
    for k, v in r.headers.items():
        if "access-control" in k.lower():
            print(f"    {k}: {v}")
except Exception as e:
    print("  Error:", e)

# Test 2: Request with custom Origin header (simulating browser from vercel)
print("\nTesting with custom Origin header...")
try:
    r = requests.post(
        url, 
        headers={
            "X-Proxy-Key": apiKey, 
            "Content-Type": "application/json",
            "Origin": "https://test-app.vercel.app",
            "Referer": "https://test-app.vercel.app/"
        }, 
        json=payload
    )
    print("  Status:", r.status_code)
    print("  Body:", r.text[:200])
    print("  CORS Headers:")
    for k, v in r.headers.items():
        if "access-control" in k.lower():
            print(f"    {k}: {v}")
except Exception as e:
    print("  Error:", e)
