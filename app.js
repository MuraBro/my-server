













//へい！今日も開発お疲れ様！！！グローばりゅ変数はクラウドで共有さえて、












let ws;
function connect() {
    ws = new WebSocket("wss://my-server-ja61.onrender.com");
}
connect();
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
let deforuto = '201A;2;Loc;Fushimi;Akaike;9;10;1,202E;2;Exp;Fushimi;Toyotashi;3;3;0,203;2;Loc;Tsurumai;Hara;0;0;7,';
let info = deforuto; //初期値
/*
  デモダイヤ
  201A;2;普通;伏見発;赤池ゆき;9;10;1;9999999997777766666666,
  202E;2;Exp;Fushimi;Toyotashi;3;3;0;9987777777777777777777,
  203;2;Loc;Tsurumai;Hara;0;0;7;6667777777776666666666,
                                  通過コードの向きは-->で固定。（駅番号を特定しやすい）
  ステータス：０停車　１移動中　７：出庫前／　８：通過　９：入庫後／通過後 6：使用しない　２：緊急停止
*/
let infolist = [];

//定義領域
const stationlist = {
    station:['Fushimi', 'Osu-Kannon', 'Kamimaezu', 'Tsurumai', 'Arahata', 'Gokiso', 'Kawana', 'Irinaka', 'Yagoto', 'Shiogama-Guchi', 'Ueda', 'Hara', 'Hirabari', 'Akaike', 'Nisshin', 'Komenoki', 'Kurosasa', 'Miyoshigaoka', 'Josui', 'Kamitoyota', 'Umeytsubo', 'Toyotashi'],
}
const timetable = {
     num:[  441,  442,  443,  444],
    time:[  732,  737,  745,  802],
    exlc:[    0,    0,    1,    0],//急行停車で１？
    dest:[   14,   22,   22,   13],
    dept:[    1,    1,    1,    1],
    stat:[00000,00000,00000,00000]
}


const expstop = [1, 4, 14, 22];

const myid = prompt('Enter the "System Code" on the timetable paper.');
const choker = prompt('Enter the "Chocker Code" on the timetable paper.');
systemlotno.textContent = "systemcode is" + myid;
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
boundshower.textContent = choker;

// 接続確認
ws.onopen = () => {
  console.log("Activated Completely");
  button.disabled = false;
    alert('Setup Complete!');
};

//自動再接続
ws.onclose = () => {
    console.log("Reactivating Now...");
    setTimeout(connect, 1000); // 1秒後再接続
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
      let sendmemom = [...infolist]; //sendmemomはリストを仔ぴったやつだよ
      let myoroginalsalmon; //自分の駅に
      sendmemom[choker] = String(Number(sendmemom[choker]) + 1);
      let tomatoma = sendmemom.join(',');
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(tomatoma);
          } else {
            alert("Connection Stopped");
          }
      
      localcount++;
    } else {
        ws.send(deforuto);
        localcount = 1;
    }
    localshower.textContent = localcount;
}
button.addEventListener('click', countup);