













//へい！今日も開発お疲れ様！！！グローばru変数はws.sendされたものだよ～
//今日の仕事内容：
//１・terminates処理
//2・時刻管理（intervalから）











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
const submitter = document.getElementById('submitswitch');
const renew = document.getElementById('renew');

const stopb = document.getElementById('stopbut');
const depab = document.getElementById('departbut');
const autotimechecker = document.getElementById('autotime');
const shower = {
  depttimes:document.getElementById('depttime'),
  trainnums:document.getElementById('trainnum'),
  trainexlc:document.getElementById('exlc'),
  trainfrom:document.getElementById('from'),
  traindestination:document.getElementById('to'),
  traincurrency:document.getElementById('currentwhere'),
  trainapproach:document.getElementById('Approval'),
  nowtime:document.getElementById('currenttime'),
  nowsta:document.getElementById('currentsta'),
  mycode:document.getElementById('mycode'),
  myrole:document.getElementById('myrole'),

  foreki:document.getElementsByClassName('eki'),
  forshako:document.getElementsByClassName('shako'),
  fortwo:document.getElementsByClassName('two'),
}
let localcount = 0;
let stationnum = 0;
let boundfor = 0;
let mode = 0;
let currenttime;
let nexttrainstatus = 0; //0なにもない　１接近　２停車中　（３発車）
button.disabled = true;
let infolist = [];
const stationlist = {
    station:['伏見', '大須観音', '上前津', '鶴舞', '荒畑', '御器所', '川名', 'いりなか', '八事', '塩釜口', '植田', '原', '平針', '赤池', '日進', '米野木', '黒笹', '三好ヶ丘', '浄水', '上豊田', '梅坪', '豊田市'],
}
let deforuto = '201A;2;普通;伏見;赤池;9;10;1,202E;2;急行;伏見;豊田市;3;3;0,203;2;普通;鶴舞;原;0;0;7,118A;1;普通;植田;いりなか;11;10;1,205;2;普通;鶴舞;原;15;16;1';
let info = deforuto; //初期値
let arrivaltime, arrivialexlc, arrivaldest, arrivalnum;
let timegoesauto = 0;
let jikokubai = 0;
let timearray = [0, 0, 0];

let diagram = ' 201A;2;普通;伏見;赤池;9;10;1;9999999997777766666666 ;2030/2032/2034/2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113,202E;2;Exp;伏見;豊田市;3;3;0;9987777777777777777777;2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119,203;2;普通;鶴舞;原;0;0;7;6667777777776666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,118A;1;普通;植田;いりなか;11;10;1;6666666777996666666666   ;2144/2046/2048/2050/2052/2054/2056/2058/2101/2051/2153/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,205;2;普通;鶴舞;原;15;16;1;6666666777777796666666  ;2000/2002/2004/2006/2008/2010/2012/2014/2016/2018/2020/2022/2024/2026/2028/2030/2032/2034/2036/2038/2040/2042';

/*
  デモダイヤ
  201A;2;普通;伏見発;赤池ゆき;9;10;1;9999999997777766666666 ;2030/2032/2034/2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113,
  202E;2;Exp;伏見;豊田市;3;3;0;9987777777777777777777;2036/2038/2040/2042/2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119,
  203;2;Loc;鶴舞;原;0;0;7;6667777777776666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127,
  118A;2;Loc;植田;いりなか;11;10;1;6666666777996666666666     ;2044/2046/2048/2050/2052/2054/2056/2058/2101/2103/2105/2107/2109/2111/2113/2115/2117/2119/2121/2123/2125/2127
                                  通過コードの向きは-->で固定。（駅番号を特定しやすい）
  ステータス：０停車　１移動中　３：回送　７：出庫前／　８：通過　９：入庫後／通過後 6：使用しない　２：緊急停止
  履歴コード：9通過済み　8現在地  7まだ　6使用しない
  方向コード：０回送　１上小田井　２豊田市
  始発・終着したら方向コードも変更してね
*/

const exst = [1, 4, 14, 22];
































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
  let onlytrainfrom = [];
  let bytime = [];
  let aswellbytime = [];
  
  //列車ごとに作業するよ
  for(let chiko in bytrain) {

    //列車の項目を分けます
    let bykoumoku = bytrain[chiko].split(';');
    //ある列車の時刻だけ抽出（文字列）
    onlytime.push(bykoumoku[9].split('/'));
    //ある列車の列車番号
    onlytrainnum.push(bykoumoku[0].trim());
    onlytraindirect.push(bykoumoku[1]);
    onlytrainfrom.push(bykoumoku[3]);
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
      if(onlytraindirect[onlytrainnum.indexOf(timetabletrainnum[sc].trim())] !== String(direct)) {
        console.log('方向違い削除', timetabletrainnum[sc]);
        timetabletrainnum[sc] = 'fuck';
        timetabletime[sc] = 'fuck'; //方向違い削除
        
      }
      
      if(onlytrainstops[onlytrainnum.indexOf(timetabletrainnum[sc])] === '6') {
        console.log('非営業削除', timetabletrainnum[sc]);
        timetabletrainnum[sc] = 'fuck';
        timetabletime[sc] = 'fuck';//非営業削除
        
      }
      
      if(mode === 2 && onlytrainfrom[onlytrainnum.indexOf(timetabletrainnum[sc])] !== stationlist.station[stationnum - 1]) {
        console.log('発車しないっす', timetabletrainnum[sc]);
        console.log('モーでは', mode, '　この駅の駅名は', stationlist.station[stationnum - 1], '　列番', timetabletrainnum[sc] , '　列番の場所', onlytrainnum.indexOf(timetabletrainnum[sc]), ' 出身地は',  onlytrainfrom[onlytrainnum.indexOf(timetabletrainnum[sc])], ' つまり', mode === 2 && onlytrainfrom[onlytrainnum.indexOf(timetabletrainnum[sc])] !== stationlist.station[stationnum - 1]);
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
const investigatesituation = (modeanan) => {
  console.log('状況測定　開始！');
  //変数diagramの書き換え
  let bytrainofdiagram = diagram.split(',');
  let newbytrainofdiagram = [];
  if(info.trim() !== '') {
  for(let il in bytrainofdiagram) {
    let trainnum = bytrainofdiagram[il].split(';')[0];
    let trainbehindstation = bytrainofdiagram[il].split(';')[5];
    let trainbeyondstation = bytrainofdiagram[il].split(';')[6];
    let trainstatus = bytrainofdiagram[il].split(';')[7];
    let trainlogs = bytrainofdiagram[il].split(';')[8];

    console.log('ステータス変更開始します', il, '番目');
//    for(let ix in infolist[il].split(';')) {
      let sexananan = infolist[il].split(';')[0];
      console.log(il,'番目　ダイヤ上での次駅',  trainbeyondstation,'　送信データによる情報',  infolist[il].split(';')[6] /*これはネットからの情報 */,'時刻表とデータtrueなら不一致',  trainbeyondstation !== infolist[il].split(';')[6]);
      console.log(trainbeyondstation !== infolist[il].split(';')[6]);
      if(trainnum.trim() !== sexananan) {
        console.log('状況調査中にエラーが発生しました：送信されたデータがコードと会いません。');
        console.log(trainnum.trim() + '' +  trainnum + ' ' + sexananan + ' ' + (trainnum.trim()===sexananan));
        break;
        
        //列番があわない＝errorだ！！
      } else {
        if(trainbehindstation !== infolist[il].split(';')[5] || trainbeyondstation !== infolist[il].split(';')[6]|| trainstatus !== infolist[il].split(';')[7] ) {
          //ステータス変更！ここが大事。
          console.log('ステータス変更していくよ！');
          trainbehindstation = infolist[il].split(';')[5];
          trainbeyondstation = infolist[il].split(';')[6];
          trainstatus = infolist[il].split(';')[7];
          console.log(bytrainofdiagram[il].split(';')[8]);
          console.log(trainlogs);
          if(modeanan === 'terminate') {
            trainlogs = '9999999999999999999999';
          } else {
            for(let i in trainlogs.split('')) {
              if(trainlogs.split('')[i] === '7' && trainbeyondstation !== infolist[il].split(';')[6]) {
                /* 666777996 停車中 7-7-0
                   666777996 発車   6-7-1
                   66677996　到着   6-6-0 */
                trainlogs.split('')[i] = '9';
              }

            }
          }


        }
        newbytrainofdiagram.push(trainnum + ';' + infolist[il].split(';')[1]+ ';' + infolist[il].split(';')[2] + ';' + infolist[il].split(';')[3] + ';' + infolist[il].split(';')[4] + ';' + trainbehindstation + ';' + trainbeyondstation + ';' + trainstatus + ';' + trainlogs + ';' + bytrainofdiagram[il].split(';')[9]  );      
        console.log(trainnum + ';' + infolist[il].split(';')[1]+ ';' + infolist[il].split(';')[2] + ';' + infolist[il].split(';')[3] + ';' + infolist[il].split(';')[4] + trainbehindstation + ';' + trainbeyondstation + ';' + trainstatus + ';' + trainlogs + ';' + bytrainofdiagram[il].split(';')[9] );
      //}
    }
    //201A;2;Loc;伏見;赤池;9;10;1,
    //201A;2;普通;伏見発;赤池ゆき;9;10;1;9999999997777766666666 ;2030/2032/2034/2036/2038/2040/2042/2044
    console.log('ダイヤグラム書き換え完了');
  }
  diagram = newbytrainofdiagram.join(',');
  bytrainofdiagram = diagram.split(','); //分けなおし
} else {
  console.log('サーバーは空の情報を送信しました。');
}
  



//自分にいらない要素の削除
    let sendmemom = [...infolist]; //列車ごとリスと
    let lastpapu = [];
    if(mode === 1) {
      for(let i in sendmemom) {
        let lastpapurika = sendmemom[i].split(';'); //ラストパプリカは列車のそれぞれの要素を抜き出したよ。
        //うちらに関係のない車両を取り除く作業
        console.log(Number(lastpapurika[6]), choker,Number(lastpapurika[6]) > choker)
        if(lastpapurika[1] === '2' && Number(lastpapurika[6]) > choker) {
          sendmemom[i] = '';
          console.log('■豊田市方面を削除しました それは' + lastpapurika[0]);
          lastpapurika = '';
        }
        else if(lastpapurika[1] === '1' && Number(lastpapurika[6]) < choker) {
          sendmemom[i] = '';
          console.log('■伏見方面を削除しました それは' + lastpapurika[0]);
          lastpapurika = '';
        }
        else if(lastpapurika[1] !== String(boundfor)) {
          console.log('■方向違いを削除しました それは' + lastpapurika[0]);
          sendmemom[i] = '';
          lastpapurika = '';
        }


        //終点を迎える電車の処理を追加！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！


        lastpapu.push(lastpapurika[0]);
      }
    } else if(mode === 2) {
      for(let i in sendmemom) {
        let lastpapurika = sendmemom[i].split(';'); //ラストパプリカは列車のそれぞれの要素を抜き出したよ。
        //うちらに関係のない車両を取り除く作業
        console.log(Number(lastpapurika[6]), choker,Number(lastpapurika[6]) > choker)
        if(lastpapurika[3] !== stationlist.station[stationnum - 1]) {
          sendmemom[i] = '';
          console.log('■ここから出発しない電車を削除しました それは' + lastpapurika[0] + '　だって' + lastpapurika[3] + ' と　' + stationlist.station[stationnum - 1] + '　は　' + lastpapurika[3] !== stationlist.station[stationnum - 1]);
          lastpapurika = '';
        }
        else if(Number(lastpapurika[6]) > choker) {
          sendmemom[i] = '';
          console.log('■行すぎぃ！！！電車を削除しました それは' + lastpapurika[0]);
          lastpapurika = '';
        }
        else if(lastpapurika[1] !== String(boundfor)) {
          console.log('■方向違いを削除しました それは' + lastpapurika[0]);
          sendmemom[i] = '';
          lastpapurika = '';
        }


        //終点を迎える電車の処理を追加！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！


        lastpapu.push(lastpapurika[0]);
      }
    }
      
    //遺産：sendmemom[choker] = String(Number(sendmemom[choker]) + 1);
    console.log('　　状況測定：通過済み・回送列車の削除完了' + sendmemom + '  /  ' + lastpapu);

    


    //次に到着する予定の電車を検索・表示
    console.log('次の列車は何かな');
    console.log(departurenum);
    for (let x in departurenum) {
        arrivalnum = NaN;
        console.log(departurenum[x], lastpapu.indexOf(departurenum[x]))
        if(lastpapu.indexOf(departurenum[x].trim()) !== -1) {


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
              console.log(bykoumoku);
              onlytime.push(bykoumoku[9].split('/'));
              //ある列車の列車番号
              onlytrainnum.push(bykoumoku[0].trim());
              onlytraindirect.push(bykoumoku[1]);
              onlytraindistination.push(bykoumoku[4]);
              onlytrainexlc.push(bykoumoku[2]);
              //その駅の時刻だけ抽出（通過・停車・逆方向含む）
              bytime.push(Number(onlytime[chiko][Number(choker) - 1]));//ーーーーーーーーーーーーーーーーーーほんとよくない
            }


            arrivalnum = departurenum[x];
            arrivaltime = departuretime[x];
            console.log('発車時刻',departurenum, '　何番目？', x);
            arrivaldest = onlytraindistination[onlytrainnum.indexOf(departurenum[x].trim())];
            arrivialexlc = onlytrainexlc[onlytrainnum.indexOf(departurenum[x].trim())];
            break;
        } else {
          arrivalnum = '該当なし';
        }
        
    }

    tomatoma = sendmemom.join(','); //
    console.log('Next Train: ', arrivaltime, arrivalnum, arrivialexlc, arrivaldest);
    console.log('Next Train: ', arrivaltime, arrivalnum, arrivialexlc, arrivaldest);
    shower.depttimes.textContent =  arrivaltime;
    shower.trainnums.textContent = arrivalnum;
    shower.trainexlc.textContent =  arrivialexlc;
    shower.traindestination.textContent =  arrivaldest;

    shower.trainapproach.textContent = '接近状況　接近はありません';
    shower.trainapproach.style = 'color:white;'
    nexttrainstatus = 0;
    for(let il in bytrainofdiagram) {
      console.log('列車番号', bytrainofdiagram[il].split(';')[0], '前駅', bytrainofdiagram[il].split(';')[5], '次駅', bytrainofdiagram[il].split(';')[6], 'この駅',String(stationnum), '　接近？', bytrainofdiagram[il].split(';')[5] !== String(stationnum) && bytrainofdiagram[il].split(';')[6]/* ←trainbeyondstation*/ === String(stationnum));
        if(arrivalnum === bytrainofdiagram[il].split(';')[0] && bytrainofdiagram[il].split(';')[5] !== String(stationnum) && bytrainofdiagram[il].split(';')[6]/* ←trainbeyondstation*/ === String(stationnum)) {
          //↑の＆＆処理は無駄なので、いつか修正よろしく
          nexttrainstatus = 1; //接近
          shower.trainapproach.textContent = '電車が近づいています';
          shower.trainapproach.style = 'color:red;'
          break;
        }
        if(arrivalnum === bytrainofdiagram[il].split(';')[0] && bytrainofdiagram[il].split(';')[5] === String(stationnum) && bytrainofdiagram[il].split(';')[6]/* ←trainbeyondstation*/ === String(stationnum) && Number(arrivaltime + '00') > currenttime) {
          nexttrainstatus = 2; //停車中
          shower.trainapproach.textContent = '電車が到着しました';
          shower.trainapproach.style = 'color:green;'
          break;
        } else if(arrivalnum === bytrainofdiagram[il].split(';')[0] && bytrainofdiagram[il].split(';')[5] === String(stationnum) && bytrainofdiagram[il].split(';')[6]/* ←trainbeyondstation*/ === String(stationnum)) {
          nexttrainstatus = 3; //停車中
          shower.trainapproach.textContent = '電車を発車させてください';
          shower.trainapproach.style = 'color:blue;'
          break;
        } else {

        }

    }

    
      

    localcount++;
    console.log('状況測定　終了');
}











const conposelocationcode = (trainnum, modes, station) => {

}



















//vanvasの処理
const canvas = document.getElementById("canvas");

// ウィンドウ幅に合わせる
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100; // 必要なら高さも


//ライン引き
const ctx = canvas.getContext('2d');
function drawline (){
ctx.beginPath();
ctx.font = "bold 50px serif";
ctx.fillStyle = '#FFFFFF';
ctx.fillText('総合指令', 0, 50);

ctx.moveTo(30, 150);
ctx.lineTo(1100, 150);
ctx.moveTo(30, 190);
ctx.lineTo(1100, 190);
ctx.moveTo(30, 400);
ctx.lineTo(1100, 400);
ctx.moveTo(30, 440);
ctx.lineTo(1100, 440);
ctx.strokeStyle = '#00a0de';
ctx.lineWidth = 5;
ctx.stroke();
ctx.closePath();
};

function drawCutRect(ctx, cx, cy, width, height, dir, color, label) {
  const hw = width / 2;
  const hh = height / 2;

  const topLeft = [cx - hw, cy - hh];
  const topRight = [cx + hw, cy - hh];
  const bottomRight = [cx + hw, cy + hh];
  const bottomLeft = [cx - hw, cy + hh];

  const cut = Math.min(width, height) * 0.3;

  let points;

  if (dir === 1) {
    // 左上カット
    points = [
      [topLeft[0] + cut, topLeft[1]],
      topRight,
      bottomRight,
      bottomLeft,
      [topLeft[0], topLeft[1] + cut]
    ];
  } else if (dir === 2) {
    // 右上カット
    points = [
      topLeft,
      [topRight[0] - cut, topRight[1]],
      [topRight[0], topRight[1] + cut],
      bottomRight,
      bottomLeft
    ];
  } else {
    console.error("dirは1（左）か2（右）で指定してください");
    return;
  }

  // ===== 図形描画 =====
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // ===== テキスト描画 =====
  if (label) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 初期フォントサイズ（大きめ）
    let fontSize = height * 0.6;
    ctx.font = `bold ${fontSize}px sans-serif`;

    // 幅に収まるまで縮小
    while (ctx.measureText(label).width > width * 0.9) {
      fontSize -= 1;
      ctx.font = `bold ${fontSize}px sans-serif`;
      if (fontSize < 10) break;
    }

    let textY;
    if (dir === 1) {
      // 左カット → 下
      textY = cy + hh + fontSize * 0.9;
    } else {
      // 右カット → 上
      textY = cy - hh - fontSize * 0.9;
    }

    // 縁取り（視認性アップ）
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.strokeText(label, cx, textY);

    // 本体
    ctx.fillStyle = "white";
    ctx.fillText(label, cx, textY);
  }
}

function drawStations(ctx) {
  const left = 30;
  const right = 1100;
  const width = right - left;
  const count = 11;
  const step = width / count;

  // 駅名（上段：伏見→赤池）
  const topStations = [
    "伏見","大須観音","上前津","鶴舞","荒畑",
    "御器所","川名", "いりなか","八事","塩釜口","植田"
  ];

  // 駅名（下段：平針→豊田市）
  const bottomStations = [
    "平針", "平針","赤池","日進","米野木","黒笹",
    "三好ヶ丘","浄水","上豊田","梅坪","豊田市",
  ];

  // 文字設定
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "16px sans-serif";

  // ===== 上段 =====
  const topY = (150 + 190) / 2; // 線の間の中央

  for (let i = 0; i < count; i++) {
    const x = left + step * i + step / 2;
    ctx.fillText(topStations[i], x, topY);
  }

  // ===== 下段 =====
  const bottomY = (400 + 440) / 2;

  for (let i = 0; i < count; i++) {
    const x = left + step * i + step / 2;
    ctx.fillText(bottomStations[i], x, bottomY);
  }
}

drawStations(ctx);
  function getStationX(index) {
      const left = 30;
      const right = 1100;
      const count = 11;
    
      const width = right - left;
      const step = width / count;
      let indexer = index;
      if(indexer > 11) {
          indexer = indexer - 11;
      }
    
      // indexは1始まり（伏見=1）
      if (index < 1 || indexer > count) {
        console.error("駅番号は1〜22で指定してください");
        return null;
      }
    
      const i = indexer - 1; // 配列用に0始まりへ
      return left + step * i + step / 2;
    }

    const colorhandan = (statuser, exlc) => {
      if(Number(statuser) === 2) {
          return '#e44d93';
      } else if(exlc === '急行' || exlc === 'Exp') {
          return '#0079c2';
      } else if(exlc === '普通' || exlc === 'Loc'){
          return '#ffffff';
      } else {
          return '#b5b5ac';
      }
    }

    const drawinmap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawline();
      drawStations(ctx);
      for(let s in infolist) {
        if(infolist[s].split(';')[1] === '1') {
            //伏見方面
            if(Number(infolist[s].split(';')[5]) > 11) {
                //下段
                if(Number(infolist[s].split(';')[7]) === 1) {
                    //走行中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])) - 40, 470, 30, 20, 1, colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                } else if(Number(infolist[s].split(';')[7]) === 0) {
                    //停車中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])), 470, 30, 20, 1,colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                }
            } else if(Number(infolist[s].split(';')[5]) > 0) {
                //上段
                if(Number(infolist[s].split(';')[7]) === 1) {
                    //走行中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])) - 40, 220, 30, 20, 1, colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                } else if(Number(infolist[s].split(';')[7]) === 0) {
                    //停車中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])), 220, 30, 20, 1,colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                }
            }
        } else if(infolist[s].split(';')[1] === '2') {
            if(Number(infolist[s].split(';')[5]) > 11) {
                //下段
                if(Number(infolist[s].split(';')[7]) === 1) {
                    //走行中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])) + 40, 370, 30, 20, 2, colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                } else if(Number(infolist[s].split(';')[7]) === 0) {
                    //停車中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])), 370, 30, 20, 2,colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                }
            } else if(Number(infolist[s].split(';')[5]) > 0) {
                //上段
                if(Number(infolist[s].split(';')[7]) === 1) {
                    //走行中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])) + 40, 120, 30, 20, 2, colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                } else if(Number(infolist[s].split(';')[7]) === 0) {
                    //停車中
                    drawCutRect(ctx, getStationX(Number(infolist[s].split(';')[5])), 120, 30, 20, 2,colorhandan(infolist[s].split(';')[7], infolist[s].split(';')[2]), infolist[s].split(';')[0]);
                }
        }
    }
}
    }

  

























/////////////////////////////////////////////////////
const myid = prompt('Enter the "System Code" on the timetable paper.');
shower.mycode.textContent = myid;

//役職・駅を表示
if(Number(myid) < 300 && myid !== '70') {
    mode = 1;
    stationnum = Number(myid[0] + myid[1]);
    choker = stationnum;
    boundfor = myid[2];
    shower.myrole.textContent = '駅員';
} else if(myid === '70') {
    mode = 3;
    stationnum = 70;
    boundfor = '0'
    shower.myrole.textContent = '総合指令';
    choker = 0;
}else if(Number(myid) < 960 && Number(myid) > 700) {
    mode = 2;
    stationnum = Number(myid[0] + myid[1]) - 70;
    choker = stationnum;
    boundfor = myid[2];
    shower.myrole.textContent = '車両留置';
    depab.style = 'display:none;';
}
shower.nowsta.textContent = stationlist.station[stationnum - 1];
if(mode === 3) {
  document.getElementById('main').style.display = "none";
} else {
  document.getElementById('shirei').style.display = "none";
}





















const buildsendingmessageandsend = (trainnums, beforestation, afterstation, situation)  => {
  let ijiruinfolist = [...infolist];
  let wherechange = -1;
  for(let i in ijiruinfolist) {
    if(trainnums === ijiruinfolist[i].split(';')[0]) {
      wherechange = i;
      break;
    }
  }
  //変更位置特定完了
  console.log('変更位置は', wherechange, ' いじるは', ijiruinfolist);
let partsofinfolist = ijiruinfolist[wherechange].split(';');

  partsofinfolist.splice(5, 1, String(beforestation));
  partsofinfolist.splice(6, 1, String(afterstation));
  partsofinfolist.splice(7, 1, String(situation));
  ijiruinfolist[wherechange] = partsofinfolist.join(';');
  return ijiruinfolist.join(',');
}






















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
  let headerinvestigater = info.split('@');
  if(headerinvestigater[0] === 'train') {
    output.textContent = info;
  }
  console.log(headerinvestigater, headerinvestigater[0]);
  if(headerinvestigater[0] === 'train') {
    infolist = headerinvestigater[1].split(','); //列車ごとにわけて
  } else if(headerinvestigater[0] === 'now') {
    currenttime = headerinvestigater[1];
    shower.nowtime.textContent = '只今の時刻' + currenttime;
    document.getElementById('timesetform').value = headerinvestigater[1];
  }
  
  if(mode !== 3) {
    console.log(mode !== 3);
    investigatesituation();
  } else {
    drawinmap();
  }
  
};






// エラー確認
ws.onerror = (e) => {
  console.log("Error", e);
};








//データ送信

let [departuretime, departurenum] = buildtimetablers(diagram, choker, boundfor);
const countup = () => {
    if(localcount !== 0) {
      if(mode !== 3) {
        investigatesituation();
      } 
      
        if (ws.readyState === WebSocket.OPEN) {
            //ws.send();
          } else {
            alert("Connection Stopped");
          }
      localcount++;
    } else {
        ws.send('train@' + deforuto);
        localcount = 1;
        
    }
    
}




/*setInterval(() => {
  investigatesituation();
  console.log('Next Train: ', arrivaltime, arrivalnum, arrivialexlc, arrivaldest);
  nexttrainshower.textContent = 'Next Train: ' + arrivaltime, arrivalnum, arrivialexlc, arrivaldest;
}, 500);*/

//接続完了まで待ちたい



const maketraingo = () => {
  if (ws.readyState === WebSocket.OPEN) {
    if(arrivaldest === stationlist.station[stationnum - 1]) {
      ws.send('train@' + buildsendingmessageandsend(arrivalnum.trim(), 9999, 9999, 9));
      console.log('終点処りしまsu');
      investigatesituation('terminate');
    } else {
      if(boundfor === '2') {
        ws.send('train@' + buildsendingmessageandsend(arrivalnum.trim(), stationnum, stationnum + 1, 1));
      } else if(boundfor === 1) {
        ws.send('train@' + buildsendingmessageandsend(arrivalnum.trim(), stationnum, stationnum - 1, 1));
      } else {
        console.log('errorです');
        alert('名にこいつ');
      }
    }
  } else {
    alert("通信が無効です");
  }
}

const maketrainstop = () => {
  if (ws.readyState === WebSocket.OPEN) {
    if(arrivialexlc === '急行' && exst.indexOf(Number(stationnum)) === -1) {
      ws.send('train@' + buildsendingmessageandsend(arrivalnum.trim(), stationnum, stationnum + 1, 1));
    } else {
      ws.send('train@' + buildsendingmessageandsend(arrivalnum.trim(), stationnum, stationnum, 0));
    }
    
  } else {
    alert("通信が無効です");
  }
}


stopb.addEventListener('click', () => {
  investigatesituation('stop'); //止めたいときに発動。
  if(nexttrainstatus === 1 || mode === 2) {
    maketrainstop();
  } else {
    alert('まだ無効です');
  }
});

depab.addEventListener('click', () => {
  investigatesituation('go'); //止めたいときに発動。
  if(nexttrainstatus === 3 && mode === 1) {
    maketraingo();
  } else {
    alert('まだ無効です');
  }
});




this.addEventListener('keyup', (event) => {
  if(nexttrainstatus === 1) {
    maketrainstop();
  } else if(nexttrainstatus === 3 && mode === 1) {
    maketraingo();
  } else {
    console.log('なめとんか');
  }
});







button.addEventListener('click', countup);

submitter.addEventListener('click', () => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send('train@' + input.value);
  } else {
    alert("Connection Stopped");
  }
});


const timesetter = document.getElementById('timeset');
const timesetform = document.getElementById('timesetform');
timesetter.addEventListener('click', () => {
  if(autotimechecker.checked === true) {
    timearray = [timesetform.value[0] + timesetform.value[1], timesetform.value[2] + timesetform.value[3], timesetform.value[4] + timesetform.value[5]];
    console.log('タイム洗い発砲！！！' + timearray);
    console.log('ーーー内訳 フォームの値は' + timesetform.value + '　一文字ずつ取り出して' + timesetform.value[1] + 'とか。それを数字にして' + Number(timesetform.value[1]));
    jikokubai = Number(document.getElementById('jikokubai').value);
    timegoesauto = 1;
  } else if(autotimechecker.checked === false) {
    timegoesauto = 0;

    if (ws.readyState === WebSocket.OPEN) {
      ws.send('now@' + timesetform.value);
    } else {
      alert("Connection Stopped");
    }
  }
  
});

setInterval(() => {
  if(mode === 3 && timegoesauto === 1) {
    console.log('時刻変更します');
    timearray[2] = String(Number(timearray[2]) + jikokubai).padStart(2, '0');
    
    if(Number(timearray[2]) > 59) {
      timearray[1] = String(Number(timearray[1]) + 1).padStart(2, '0');
      timearray[2] = String(Number(timearray[2]) - 60).padStart(2, '0');
      if(Number(timearray[1]) > 59) {
        timearray[0] = String(Number(timearray[0]) + 1).padStart(2, '0');
        timearray[1] = String(Number(timearray[1]) - 60).padStart(2, '0');
      }
    }
    
    console.log('変更後：' + timearray);
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.send('now@' + timearray.join(''));
    } else {
      alert("Connection Stopped");
    }
  }
}, 1000);