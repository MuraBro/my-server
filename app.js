const ws = new WebSocket("wss://my-server-ja61.onrender.com");

const input = document.getElementById("input");
const output = document.getElementById("output");
let countupper = 0;
let informer = [441, 442, 443, 444, 445, 446, 447, 448, 449, 450];
input.disabled = true;

// 接続確認
ws.onopen = () => {
  console.log("接続成功");
  input.disabled = true;
    alert('Setup Complete!');
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



// エラー確認
ws.onerror = (e) => {
  console.log("エラー", e);
};





//ここからコード
const button = document.getElementById('button');
const countup = () => {
    ws.send(informer[countupper]);
    countupper++;
}