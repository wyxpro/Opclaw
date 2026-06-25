import requests

url = "https://mangdream.com/api/innoreation/v1/proxy/chat/completions"

# Test 1: Invalid API key
headers_invalid = {
    "Content-Type": "application/json",
    "X-Proxy-Key": "invalid_key"
}
payload = {
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "stream": False
}

print("--- Test 1: Invalid API Key ---")
try:
    r = requests.post(url, headers=headers_invalid, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)

# Test 2: Missing API key
headers_missing = {
    "Content-Type": "application/json"
}
print("\n--- Test 2: Missing API Key ---")
try:
    r = requests.post(url, headers=headers_missing, json=payload, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text)
except Exception as e:
    print("Error:", e)

# Test 3: Streaming with valid key
headers_valid = {
    "Content-Type": "application/json",
    "X-Proxy-Key": "sk-02260d10c28c4bb4b65bace15ba5f754"
}
payload_stream = {
    "model": "deepseek-v4-pro",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "stream": True
}
print("\n--- Test 3: Streaming with valid key ---")
try:
    r = requests.post(url, headers=headers_valid, json=payload_stream, timeout=10)
    print("Status Code:", r.status_code)
    print("Response:", r.text[:500])
except Exception as e:
    print("Error:", e)
