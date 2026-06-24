import urllib.request
import json

domains = [
    "innoreation.com",
    "api.innoreation.com",
    "innoreation.net",
    "api.innoreation.net",
    "innoreation.cn",
    "api.innoreation.cn",
]

for d in domains:
    url = f"https://dns.alicdn.com/resolve?name={d}&type=A"
    try:
        req = urllib.request.Request(url, headers={'Accept': 'application/json'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            status = data.get('Status')
            answers = data.get('Answer', [])
            if status == 0 and answers:
                ips = [a.get('data') for a in answers]
                print(f"{d} resolves to {ips} via AliDNS DoH")
            else:
                print(f"{d} does not exist (Status {status})")
    except Exception as e:
        print(f"Error querying {d}: {e}")
