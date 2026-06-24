import requests

subdomains = [
    "cuiyu.eazo.ai",
    "wyxpro.eazo.ai",
    "superui.eazo.ai",
    "opclaw.eazo.ai",
]

apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754"
payload = {
    "model": "deepseek-v4-pro",
    "messages": [
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7,
    "stream": False
}

for sub in subdomains:
    # 1. Test DNS via Tencent
    dns_url = f"http://119.29.29.29/d?dn={sub}"
    try:
        r = requests.get(dns_url, timeout=3)
        dns_res = r.text.strip()
    except Exception as e:
        dns_res = f"DNS Error: {e}"
        
    print(f"Subdomain: {sub} -> DNS: {dns_res}")
    
    # 2. Test HTTP proxy completions
    url = f"https://{sub}/api/innoreation/v1/proxy/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "X-Proxy-Key": apiKey
    }
    try:
        r = requests.post(url, headers=headers, json=payload, timeout=5)
        print(f"  POST {url} -> Status: {r.status_code}")
        print(f"  Body: {r.text[:200]}")
    except Exception as e:
        print(f"  HTTP Error: {e}")
    print("-" * 60)
