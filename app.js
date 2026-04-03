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
let stationname = 'Kisaragi sta';
let whetherexp = 9999; //1停車　０通過
let trainnum = 9999;
let traindest = 9999;
let traintime = 9999;
let trainexlc = 9999;
let traindept = 9999;
let sendingpot = 0;
const stationlist = {
    station:['Fushimi', 'Osu-Kannon', 'Kamimaezu', 'Tsurumai', 'Arahata', 'Gokiso', 'Kawana', 'Irinaka', 'Yagoto', 'Shiogama-Guchi', 'Ueda', 'Hara', 'Hirabari', 'Akaike', 'Nisshin', 'Komenoki', 'KUrosasa', 'Miyoshigaoka', 'Josui', 'Kamitoyota', 'Umetsubo', 'Toyotashi'],
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
    if(ay === 0) return 'Stop: Local';
    if(ay === 1) return 'Stop: Exp & Local';
}

const translatemodenum = (ay) => {
    if(ay === 1) return 'Station';
    if(ay === 2) return 'Garage';
    if(ay === 3) return 'Instructions';
}
const translateboundfor = (ay) => {
    if(ay === '1') return 'For Fushimi';
    if(ay === '2') return 'For Toyotashi';
}
const startsetup = () => {
    systemcode = prompt('Machine Code');
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
        stationname = 'Instructions';
    }

    nameshower.textContent = stationname;
    modeshower.textContent = translatemodenum(mode);
    expshower.textContent = translatewhetherrxp(whetherexp);
    boundshower.textContent = translateboundfor(boundfor);

    console.log(stationnum + stationname + systemcode + mode);
}
const translateexlc = (ay) => {
    if(ay === 0) return 'Local';
    if(ay === 1) return 'Exp';
}
const distinguishstoppass = (traincodea) => {
    if(timetable.exlc[timetable.num.indexOf(traincodea)] === 0 || (timetable.exlc[timetable.num.indexOf(traincodea)] === 1 && whetherexp === 1)) {
        return '【Stop】';
    } else {
        return '【--Pass--】'
    }
}
const reloadnexttrain = () => {
    traincode.textContent = distinguishstoppass(trainnum) + 'No.' + trainnum + ' Departures at' + timetable.time[timetable.num.indexOf(trainnum)] + ' ' + translateexlc(timetable.exlc[timetable.num.indexOf(trainnum)])+ ' Bound for' + stationlist.station[timetable.dest[timetable.num.indexOf(trainnum)] - 1] + '';
}
button.addEventListener('click', () => {
    trainnum++;
})

trainnum = 441;
setInterval(() => {
    reloadnexttrain();
    ws.send(trainnum);
}, 100);