//変数定義
const num = document.getElementById('num');
const nameshower = document.getElementById('stationname');
const modeshower = document.getElementById('mode');
const expshower = document.getElementById('whetherexp');
const boundshower = document.getElementById('bound');
const traincode = document.getElementById('traincode');
const button = document.getElementById('button');
let systemcode = 9999;
let mode = 9999; //駅１　車庫２　総合指令３
let stationnum = 9999;
let boundfor = 9999; //方向　１伏見２豊田市
let stationname = 'きさらぎ駅';
let whetherexp = 9999; //1停車　０通過
let trainnum = 9999;
let traindest = 9999;
let traintime = 9999;
let trainexlc = 9999;
let traindept = 9999;
let sendingpot = 0;
const stationlist = {
    station:['伏見', '大須観音', '上前津', '鶴舞', '荒畑', '御器所', '川名', 'いりなか', '八事', '塩釜口', '植田', '原', '平針', '赤池', '日進', '米野木', '黒笹', '三好ヶ丘', '浄水', '上豊田', '梅坪', '豊田市'],
}
const timetable = {
     num:[441,  442,  443,  444],
    time:[732, 737, 745, 802],
    exlc:[0    ,0    ,1    ,0],
    dest:[14,   22,   22,   13],
    dept:[1,    1,    1,    1],
}


const expstop = [1, 4, 14, 22];

//送信回路
const ws = new WebSocket("wss://my-server-ja61.onrender.com");

//const input = document.getElementById("input");
const output = document.getElementById("output");

ws.onmessage = (event) => {
  output.textContent = event.data;
  trainnum = event.data;
  //input.value = event.data;
};

/*input.addEventListener("input", () => {
  ws.send(input.value);
});*/

//プログラム
const translatewhetherrxp = (ay) => {
    if(ay === 0) return '急行は 通過 します';
    if(ay === 1) return '急行は 停車 します';
}

const translatemodenum = (ay) => {
    if(ay === 1) return '駅';
    if(ay === 2) return '車両留置';
    if(ay === 3) return '総合指令';
}
const translateboundfor = (ay) => {
    if(ay === '1') return '伏見方面';
    if(ay === '2') return '豊田市方面';
}
const startsetup = () => {
    systemcode = prompt('時刻表に記載されている機器管理番号を入力してください');
    if(Number(systemcode) !== 70 && Number(systemcode) < 300) {
        mode = 1
        stationnum = systemcode[0] + systemcode[1];
        stationname = stationlist.station[stationnum - 1];
        boundfor = systemcode[2];
        if(expstop.indexOf(Number(stationnum)) === -1) {
            whetherexp = 0;
        } else {
            whetherexp = 1;
        }
    } else if(Number(systemcode) > 700 && Number(systemcode) < 960) { //96に意味はない
        mode = 2
        stationnum = systemcode[0] + systemcode[1];
        stationnum = Number(stationnum) -70;
        stationnum = String(stationnum);
        stationname = stationlist.station[stationnum - 1];
        boundfor = systemcode[2];
    } else if(systemcode === '70') {
        mode = 37
        stationname = '総合指令';
    }

    nameshower.textContent = stationname;
    modeshower.textContent = translatemodenum(mode);
    expshower.textContent = translatewhetherrxp(whetherexp);
    boundshower.textContent = translateboundfor(boundfor);

    console.log(stationnum + stationname + systemcode + mode);
}
const translateexlc = (ay) => {
    if(ay === 0) return '普通';
    if(ay === 1) return '急行';
}
const distinguishstoppass = (traincodea) => {
    if(timetable.exlc[timetable.num.indexOf(traincodea)] === 0 || (timetable.exlc[timetable.num.indexOf(traincodea)] === 1 && whetherexp === 1)) {
        return '【停車】';
    } else {
        return '【--通過--】'
    }
}
const reloadnexttrain = () => {
    traincode.textContent = distinguishstoppass(trainnum) + '列番' + trainnum + ' 発車時刻' + timetable.time[timetable.num.indexOf(trainnum)] + ' ' + translateexlc(timetable.exlc[timetable.num.indexOf(trainnum)])+ ' ' + stationlist.station[timetable.dest[timetable.num.indexOf(trainnum)] - 1] + 'ゆき';
}
button.addEventListener('click', () => {
    trainnum++;
})

trainnum = 441;
setInterval(() => {
    reloadnexttrain();
    ws.send(trainnum);
}, 100);