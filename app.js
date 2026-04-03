const ws = new WebSocket("wss://my-server-ja61.onrender.com");
const button = document.getElementById('button');
const input = document.getElementById("input");
const output = document.getElementById("output");
const localshower = document.getElementById("localcount");
let localcount = 0;
let informer = [441, 442, 443, 444, 445, 446, 447, 448, 449, 450];
button.disabled = true;
let info = '440,720' //初期値
let infolist = [];
const myid = prompt('Enter the "System Code" on the timetable paper.');

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
  infolist = info.split(',');
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
    if(localcount !== 0) {
    let sendmemom = [...infolist];
    sendmemom[myid] = String(Number(sendmemom[myid]) + 1);
    let tomatoma = sendmemom.join(',');
    ws.send(tomatoma);
    localcount++;
    } else {
        ws.send('440,720');
        localcount = 1;
        
    }
    localshower.textContent = localcount;
}
button.addEventListener('click', countup);