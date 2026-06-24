import requests

domains = [
    "innoreation.com",
    "api.innoreation.com",
    "innoreation.net",
    "api.innoreation.net",
    "innoreation.cn",
    "api.innoreation.cn",
]

for d in domains:
    url = f"http://119.29.29.29/d?dn={d}"
    try:
        r = requests.get(url, timeout=5)
        print(f"{d} -> {r.text}")
    except Exception as e:
        print(f"Error querying {d}: {e}")
