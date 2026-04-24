













//へい！今日も開発お疲れ様！！！グローばりゅ変数はws.sendされたものだよ～











//ネットワーク設定
let ws;
function connect() {
    ws = new WebSocket("wss://my-server-ja61.onrender.com");
}
connect();
































//定義領域
const button = document.getElementById('button');
const input = document.getElementById("input");
const output = document.getElementById("output");
const localshower = document.getElementById("localcount");
const systemlotno = document.getElementById("systemlot");
const stashower = document.getElementById('staname');
const boundshower = document.getElementById('boundfor');
const nexttrainshower = document.getElementById('nexttrain');
const stopb = document.getElementById('stopbut');
const depab = document.getElementById('departbut');
let localcount = 0;
let stationnum = 0;
let boundfor = 0;
let mode = 0;
button.disabled = true;
let infolist = [];
const stationlist = {
    station:['Fushimi', 'Osu-Kannon', 'Kamimaezu', 'Tsurumai', 'Arahata', 'Gokiso', 'Kawana', 'Irinaka', 'Yagoto', 'Shiogama-Guchi', 'Ueda', 'Hara', 'Hirabari', 'Akaike', 'Nisshin', 'Komenoki', 'Kurosasa', 'Miyoshigaoka', 'Josui', 'Kamitoyota', 'Umeytsubo', 'Toyotashi'],
}
let deforuto = '201A;2;Loc;Fushimi;Akaike;9;10;1,202E;2;Exp;Fushimi;Toyotashi;3;3;0,203;2;Loc;Tsurumai;Hara;0;0;7,118A;1;Loc;Ueda;Irinaka;11;10;1,205;2;Loc;Tsurumai;Hara;11;12;1';
let info = deforuto; //初期値
let arrivaltime, arrivialexlc, arrivaldest, arrivalnum;

let diagram = ' 201A;2;Loc;伏見発;赤池き;9;10;1;9999999997777766666666 ;2030/2032/2034/2036/2038/2040/2042/2044/2046/2123/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113,202E;2;Exp;Fushimi;Toyotashi;3;3;0;9987777777777777777777;2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119,203;2;Loc;Tsurumai;Hara;0;0;7;6667777777776666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,118A;1;Loc;Ueda;Irinaka;11;10;1;6666666777996666666666   ;2144/2046/2048/2050/2052/2054/2056/2058/2101/2051/2153/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,205;2;Loc;Tsurumai;Hara;11;12;1;6666666777796666666666  ;2000/2002/2004/2006/2008/2010/2012/2014/2016/2018/2020/2022/2024/2026/2028/2030/2032/2034/2036/2038/2040/2042';

/*
  デモダイヤ
  201A;2;普通;伏見発;赤池ゆき;9;10;1;9999999997777766666666 ;2030/2032/2034/2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113,
  202E;2;Exp;Fushimi;Toyotashi;3;3;0;9987777777777777777777;2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119,
  203;2;Loc;Tsurumai;Hara;0;0;7;6667777777776666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,
  118A;2;Loc;Ueda;Irinaka;11;10;1;6666666777996666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127
                                  通過コードの向きは-->で固定。（駅番号を特定しやすい）
  ステータス：０停車　１移動中　３：回送　７：出庫前／　８：通過　９：入庫後／通過後 6：使用しない　２：緊急停止
  履歴コード：9通過済み　8現在地  7まだ　6使用しない
  方向コード：０回送　１上小田井　２豊田市
  始発・終着したら方向コードも変更してね
*/


































//ChatGPT
function removeElement(arr, value) {
  return arr.filter(item => item !== value);
}

function sortWithPair(A, B) {
  const indices = A.map((_, i) => i)
                   .sort((i, j) => A[i] - A[j]);

  return {
    A: indices.map(i => A[i]),
    B: indices.map(i => B[i])
  };
}





























//時刻表をつくる
const buildtimetablers = (list, num, direct) => {
  console.log('時刻表製作　開始！');
  //列車ごとにわけたよ
  let bytrain = list.split(',');
  
  let onlytime = [];
  let onlytrainnum = [];
  let onlytraindirect = [];
  let onlytrainstops = [];
  let bytime = [];
  let aswellbytime = [];
  
  //列車ごとに作業するよ
  for(let chiko in bytrain) {

    //列車の項目を分けます
    let bykoumoku = bytrain[chiko].split(';');
    //ある列車の時刻だけ抽出（文字列）
    onlytime.push(bykoumoku[9].split('/'));
    //ある列車の列車番号
    onlytrainnum.push(bykoumoku[0]);
    onlytraindirect.push(bykoumoku[1]);
    onlytrainstops.push(bykoumoku[8].split(''));
    //その駅の時刻だけ抽出（通過・停車・逆方向含む）
    bytime.push(Number(onlytime[chiko][Number(num) - 1]));
    //列番だけ抽出
    aswellbytime.push(bykoumoku[0]);
  }
  //
  console.log(onlytrainnum);
  let result = sortWithPair(bytime, aswellbytime);

    // 結果を取り出す
    let timetabletime = result.A;
    let timetabletrainnum = result.B;

    console.log('　　時刻表：通過時刻通りに並び替え' + timetabletime + timetabletrainnum);

    
    for (let sc in timetabletrainnum) {
      //bytrainでの番目を知りたい onlytrainnum.indexOf(timetabletrainnum[sc])
      if(onlytraindirect[onlytrainnum.indexOf(timetabletrainnum[sc])] !== String(direct)) {
        
        timetabletrainnum[sc] = 'fuck';
        timetabletime[sc] = 'fuck'; //方向違い削除
      }
      
      if(onlytrainstops[onlytrainnum.indexOf(timetabletrainnum[sc])] === '6') {
        timetabletrainnum[sc] = 'fuck';
        timetabletime[sc] = 'fuck';//非営業削除
      }
    }
    
    console.log('　　時刻表：fuckに置き換え完了' + timetabletime + timetabletrainnum);

    
    timetabletime = removeElement(timetabletime, 'fuck');
    timetabletrainnum = removeElement(timetabletrainnum, 'fuck');
  
    console.log('時刻表完了' + timetabletime + timetabletrainnum);
    return[timetabletime, timetabletrainnum];
    //timetabletimeが時刻！timetabletrainnumが列車番号！
}



































//状況調査
const investigatesituation = (mode) => {
  console.log('状況測定　開始！');
    let sendmemom = [...infolist]; //列車ごとリスと
    let lastpapu = [];
    for(let i in sendmemom) {
      let lastpapurika = sendmemom[i].split(';'); //ラストパプリカは列車のそれぞれの要素を抜き出したよ。
      //うちらに関係のない車両を取り除く作業
      if(lastpapurika[1] === '2' && Number(lastpapurika[6]) > choker) {
        sendmemom[i] = '';
      }
      if(lastpapurika[1] === '1' && Number(lastpapurika[6]) < choker) {
        sendmemom[i] = '';
      }
      if(lastpapurika[1] !== String(boundfor)) {
        
        sendmemom[i] = '';
      }
      lastpapu.push(lastpapurika[0]);
    }
    //遺産：sendmemom[choker] = String(Number(sendmemom[choker]) + 1);
    console.log('　　状況測定：通過済み・回送列車の削除完了' + sendmemom + '  /  ' + lastpapu);

    for (let x in departurenum) {
        arrivalnum = NaN;
        if(lastpapu.indexOf(departurenum[x]) !== -1) {


            let bytrain = diagram.split(',');
    
            let onlytime = [];
            let onlytrainnum = [];
            let onlytraindirect = [];
            let onlytraindistination = [];
            let onlytrainexlc = [];
            let bytime = [];
            
            //列車ごとに作業するよ
            for(let chiko in bytrain) {
          
              //列車の項目を分けます
              let bykoumoku = bytrain[chiko].split(';');
              //ある列車の時刻だけ抽出（文字列）
              onlytime.push(bykoumoku[9].split('/'));
              //ある列車の列車番号
              onlytrainnum.push(bykoumoku[0]);
              onlytraindirect.push(bykoumoku[1]);
              onlytraindistination.push(bykoumoku[4]);
              onlytrainexlc.push(bykoumoku[2]);
              //その駅の時刻だけ抽出（通過・停車・逆方向含む）
              bytime.push(Number(onlytime[chiko][Number(choker) - 1]));//ーーーーーーーーーーーーーーーーーーほんとよくない
            }


            arrivalnum = departurenum[x];
            arrivaltime = departuretime[x];
            arrivaldest = onlytraindistination[onlytrainnum.indexOf(departurenum[x])];
            arrivialexlc = onlytrainexlc[onlytrainnum.indexOf(departurenum[x])];
            break;
        }
        if(arrivalnum === NaN) {
            arrivalnum = '該当なし';
        }


        if(mode === 'stop') {

        }
    }

    tomatoma = sendmemom.join(','); //
    localcount++;
    console.log('状況測定　終了');
}






































/////////////////////////////////////////////////////
const myid = prompt('Enter the "System Code" on the timetable paper.');
systemlotno.textContent = "systemcode is" + myid;

//役職・駅を表示
if(Number(myid) < 300 && myid !== '70') {
    mode = 1;
    stationnum = Number(myid[0] + myid[1]);
    choker = stationnum;
    boundfor = myid[2];
} else if(myid === '70') {
    mode = 3;
    stationnum = 70;
    boundfor = '0'
}else if(Number(myid) < 960 && Number(myid) > 700) {
    mode = 2;
    stationnum = Number(myid[0] + myid[1]) - 70;
    choker = stationnum;
    boundfor = myid[2];
}
stashower.textContent = stationlist.station[stationnum - 1];
boundshower.textContent = 'Your Station' + choker;










































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




// 受信  eventに受信された文字列が入るよ
ws.onmessage = (event) => {
  console.log("Received:", event.data);
  
  info = event.data
  output.textContent = info;
  infolist = info.split(','); //列車ごとにわけて
};






// エラー確認
ws.onerror = (e) => {
  console.log("Error", e);
};








//データ送信

let [departuretime, departurenum] = buildtimetablers(diagram, choker, boundfor);
const countup = () => {
    if(localcount !== 0) {
      investigatesituation();
        if (ws.readyState === WebSocket.OPEN) {
            //ws.send();
          } else {
            alert("Connection Stopped");
          }
      localcount++;
    } else {
        ws.send(deforuto);
        localcount = 1;
        
    }
    console.log('Next Train: ', arrivaltime, arrivalnum, arrivialexlc, arrivaldest);
    nexttrainshower.textContent = 'Next Train: ' + arrivaltime, arrivalnum, arrivialexlc, arrivaldest;
}

ws.send(deforuto);
localcount = 1;


setInterval(() => {
  investigatesituation();
  console.log('Next Train: ', arrivaltime, arrivalnum, arrivialexlc, arrivaldest);
  nexttrainshower.textContent = 'Next Train: ' + arrivaltime, arrivalnum, arrivialexlc, arrivaldest;
}, 500);





stopb.addEventListener('click', () => {
  investigatesituation('stop'); //止めたいときに発動。
})











button.addEventListener('click', countup);