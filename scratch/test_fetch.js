const apiKey = "sk-02260d10c28c4bb4b65bace15ba5f754";
fetch("https://mangdream.com/api/innoreation/v1/proxy/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Proxy-Key": apiKey
  },
  body: JSON.stringify({
    model: "deepseek-v4-pro",
    messages: [{ role: "user", content: "Hello" }],
    stream: false,
    temperature: 0.7
  })
}).then(res => {
  console.log("Status:", res.status);
  return res.text();
}).then(text => {
  console.log("Body:", text);
}).catch(err => {
  console.error("Error:", err);
});
