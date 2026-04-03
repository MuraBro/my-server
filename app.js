const ws = new WebSocket("wss://my-server-ja61.onrender.com");
const button = document.getElementById('button');
const input = document.getElementById("input");
const output = document.getElementById("output");
const localshower = document.getElementById("localcount");
const systemlotno = document.getElementById("systemlot");
const stashower = document.getElementById('staname');
const boundshower = document.getElementById('boundfor');
let localcount = 0;
let stationnum = 0;
let boundfor = 0;
let mode = 0;
button.disabled = true;
let info = '440,720' //初期値
let infolist = [];

//定義領域
const stationlist = {
    station:['Fushimi', 'Osu-Kannon', 'Kamimaezu', 'Tsurumai', 'Arahata', 'Gokiso', 'Kawana', 'Irinaka', 'Yagoto', 'Shiogama-Guchi', 'Ueda', 'Hara', 'Hirabari', 'Akaike', 'Nisshin', 'Komenoki', 'Kurosasa', 'Miyoshigaoka', 'Josui', 'Kamitoyota', 'Umeytsubo', 'Toyotashi'],
}
const timetable = {
     num:[  441,  442,  443,  444],
    time:[  732,  737,  745,  802],
    exlc:[    0,    0,    1,    0],
    dest:[   14,   22,   22,   13],
    dept:[    1,    1,    1,    1],
    stat:[00000,00000,00000,00000]
}


const expstop = [1, 4, 14, 22];

const myid = prompt('Enter the "System Code" on the timetable paper.');
const choker = prompt('Enter the "Chocker Code" on the timetable paper.');
systemlotno.textContent = myid;
if(Number(myid) < 300 && myid !== '70') {
    mode = 1;
    stationnum = Number(myid[0] + myid[1]);
    boundfor = myid[2];
} else if(myid === '70') {
    mode = 3;
    stationnum = 70;
}else if(Number(myid) < 960 && Number(myid) > 700) {
    mode = 2;
    stationnum = Number(myid[0] + myid[1]) - 70;
    boundfor = myid[2];
}
stashower.textContent = stationlist.station[stationnum - 1];
boundshower.textContent = boundfor;

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



// エラー確認
ws.onerror = (e) => {
  console.log("エラー", e);
};








//データ送信

const countup = () => {
    if(localcount !== 0) {
    let sendmemom = [...infolist];
    sendmemom[choker] = String(Number(sendmemom[choker]) + 1);
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