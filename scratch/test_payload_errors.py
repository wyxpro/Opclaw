import requests

url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"
headers = {
    "Content-Type": "application/json",
    "X-Proxy-Key": "sk-02260d10c28c4bb4b65bace15ba5f754"
}

# Test 1: messages is None/missing
payload = {
    "model": "deepseek-v4-pro",
    "temperature": 0.7,
    "stream": False
}
print("--- Test 1: Missing Messages ---")
try:
    r = requests.post(url, headers=headers, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)

# Test 2: empty messages list
payload2 = {
    "model": "deepseek-v4-pro",
    "messages": [],
    "temperature": 0.7,
    "stream": False
}
print("\n--- Test 2: Empty Messages List ---")
try:
    r = requests.post(url, headers=headers, json=payload2, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)
