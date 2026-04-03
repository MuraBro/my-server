const ws = new WebSocket("wss://my-server-ja61.onrender.com");
const button = document.getElementById('button');
const input = document.getElementById("input");
const output = document.getElementById("output");
let countupper = 0;
let informer = [441, 442, 443, 444, 445, 446, 447, 448, 449, 450];
button.disabled = true;
let info = 440

// 接続確認
ws.onopen = () => {
  console.log("接続成功");
  button.disabled = false;
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

const countup = () => {
    ws.send(informer[countupper]);
    countupper++;
}
button.addEventListener('click', countup);