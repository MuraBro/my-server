const ws = new WebSocket("wss://my-server-ja61.onrender.com");

const input = document.getElementById("input");
const output = document.getElementById("output");

// 接続確認
ws.onopen = () => {
  console.log("接続成功");
};

// 受信
ws.onmessage = (event) => {
  console.log("受信:", event.data);
  output.textContent = event.data;
};

// 送信
input.addEventListener("input", () => {
  console.log("送信:", input.value);
  ws.send(input.value);
});

// エラー確認
ws.onerror = (e) => {
  console.log("エラー", e);
};