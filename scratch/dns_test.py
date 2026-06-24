import socket

domains = [
    "innoreation.com",
    "api.innoreation.com",
    "innoreation.net",
    "api.innoreation.net",
    "innoreation.org",
    "api.innoreation.org",
    "innoreation.cn",
    "api.innoreation.cn",
]

for d in domains:
    try:
        ip = socket.gethostbyname(d)
        print(f"{d} resolved to {ip}")
    except Exception as e:
        print(f"Failed to resolve {d}: {e}")
