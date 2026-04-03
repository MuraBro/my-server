const ws = new WebSocket("wss://my-server-ja61.onrender.com");

const input = document.getElementById("input");
const output = document.getElementById("output");
let info = [441, 442];

// 接続確認
ws.onopen = () => {
  console.log("接続成功");
};

// 受信
ws.onmessage = (event) => {
  console.log("受信:", event.data);
  
  info = event.data
  output.textContent = info;
};

// 送信
/*input.addEventListener("input", () => {
  console.log("送信:", input.value);
  ws.send(input.value);
});*/

//初回
ws.send(info);
// エラー確認
ws.onerror = (e) => {
  console.log("エラー", e);
};





//ここからコード
const button = document.getElementById('button');
let trainnum = '442,443';
const countup = () => {
    ws.send(trainnum);
}