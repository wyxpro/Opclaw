import urllib.request
import json

urls = [
    "https://dns.alicdn.com/resolve?name=mangdream.com&type=A",
    "https://cloudflare-dns.com/dns-query?name=mangdream.com&type=A",
    "https://dns.google/resolve?name=mangdream.com&type=A"
]

for url in urls:
    print(f"Querying {url} ...")
    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            print("Response:", json.dumps(data, indent=2))
    except Exception as e:
        print("Error:", e)
