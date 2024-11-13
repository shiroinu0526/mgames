

let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");

let can = document.getElementById("can");
let con = can.getContext("2d");

vcan.width = SCREEN_SIZE_W;
vcan.height = SCREEN_SIZE_H;

can.width = SCREEN_SIZE_W*2;
can.height = SCREEN_SIZE_H*2;

con.mozimageSmoothingEnabled = false;
con.msimageSmoothingEnabled = false;
con.webkitimageSmoothingEnabled = false;
con.imageSmoothingEnabled = false;

let frameCount = 0;
let startTime = 0;


let chImg = new Image();
chImg.src = "sprite.png";

//おじさん情報
//キーボード
let keyb = [];
//おじさんを作る
let ojisan = new Ojisan(100, 100);

//フィールドを作る
let field = new Field();

//ブロックのオブジェクト
let block = [];
let item = [];

//chImg.onload = draw;
function updateObj(obj)
{
    //ブロックを表示
    for(let i=obj.length-1;i>=0;i--)
        {
            obj[i].update();
            if(obj[i].kill)obj.splice(i, 1);
        }
}

//更新処理
function update()
{
    //マップの更新
    field.update();
    updateObj(block);
    updateObj(item);
    ojisan.update();
}

function drawSprite(snum, x, y)
{
    let sx = (snum&15)*16;
    let sy = (snum>>4)*16;
    vcon.drawImage(chImg, sx, sy, 16, 32, x, y, 16, 32);
}

function drawObj(obj)
{
    //ブロックを表示
    for(let i=0;i<obj.length;i++)
        {
            obj[i].draw();
        }
}

//描画処理
function draw()
{
    //画面を水色でクリア
    vcon.fillStyle="#66AAFF";
    vcon.fillRect(0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H); 
    //マップを表示
    field.draw();
    drawObj(block);
    drawObj(item);
    //おじさんを表示
    ojisan.draw();

    vcon.font="20px Impact";
    vcon.fillStyle = "white";
    vcon.fillText("FRAME:"+frameCount, 10, 20);

    //仮想画面から実画面に転送
    con.drawImage(vcan, 0, 0, SCREEN_SIZE_W, SCREEN_SIZE_H, 0, 0, SCREEN_SIZE_W*2, SCREEN_SIZE_H*2);
}
//setInterval(mainLoop, 1000/60);
//ループ開始
window.onload = function()
{
    startTime = performance.now();
    mainLoop();
}

//メインループ
function mainLoop()
{
    let nowTime = performance.now();
    let nowFrame = (nowTime-startTime) / GAME_FPS;

    if(nowFrame > frameCount)
    {
        let c=0;
        while(nowFrame > frameCount)
        {
            //
            update();
            frameCount++;
            if(++c>=4)break;
        }
    //
    draw();
    }

    requestAnimationFrame(mainLoop);

}


document.onkeydown = function(e)
{
    if(e.keyCode == 37)keyb.Left = true;
    if(e.keyCode == 39)keyb.Right = true;
    if(e.keyCode == 90)keyb.aBUTTON = true;
    if(e.keyCode == 88)keyb.bBUTTON = true;

    if(e.keyCode == 65)field.scx--;
    if(e.keyCode == 83)field.scx++;
}

document.onkeyup = function(e)
{
    if(e.keyCode == 37)keyb.Left = false;
    if(e.keyCode == 39)keyb.Right = false;
    if(e.keyCode == 90)keyb.aBUTTON = false;
    if(e.keyCode == 88)keyb.bBUTTON = false;
}
