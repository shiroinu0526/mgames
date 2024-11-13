//おじさんクラス


const ANIME_STAND =1;
const ANIME_WALK =2;
const ANIME_BRAKE = 4;
const ANIME_JUMP =8;
const GRAVITY = 4;
const MAX_SPEED = 32;
const TYPE_MINI = 1;
const TYPE_BIG = 2;
const TYPE_FIRE = 4;

class Ojisan
{
    constructor(x, y)
    {
        this.x = x<<4;
        this.y = y<<4;
        this.ay = 0;
        this.w = 16;
        this.h = 16;
        this.vx = 0;
        this.vy = 0;
        this.anim = 0;
        this.snum = 0;
        this.dirc = 0;
        this.jump = 0;

        this.kinoko = 0;
        this.type = TYPE_MINI;
    }
    //床の判定
    checkFloor()
    {
        if(this.vy<=0)return;
        
        let lx = ((this.x+this.vx)>>4);
        let ly = ((this.y+this.vy)>>4);

        let p = this.type==TYPE_MINI?2:0;
    
        if(field.isBlock(lx+1+p, ly+31)||
        field.isBlock(lx+14-p, ly+31))
        {
                
            if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
            this.jump = 0;
            this.vy = 0;
            this.y = ((((ly+31)>>4)<<4)-32)<<4;
        }
    }

    //横の壁の判定
    checkWall()
    {

        let lx = ((this.x+this.vx)>>4);
        let ly = ((this.y+this.vy)>>4);

        let p = this.type==TYPE_MINI?16+8:9;

        //右側のチェック
        if(field.isBlock(lx+15, ly+p)||
        (this.type==TYPE_BIG && (
        field.isBlock(lx+15, ly+15)||
        field.isBlock(lx+15, ly+24))))
        {     
            this.vx = 0;
            this.x -= 8;
        }
        else
        //左側のチェック
        if(field.isBlock(lx, ly+p)||
        field.isBlock(lx, ly+15)||
        field.isBlock(lx, ly+24))
        {     
            this.vx = 0;
            this.x += 8;
        }
    }

    //天井の判定
    checkCeal()
    {
        if(this.vy>=0)return;
        
        let lx = ((this.x+this.vx)>>4);
        let ly = ((this.y+this.vy)>>4);

        let ly2 = ly+(this.type == TYPE_MINI?21:5);

        let bl;
        if(bl=field.isBlock(lx+8, ly2))
        {
            this.jump = 15;
            this.vy = 0;

            let x = (lx+8)>>4;
            let y = (ly2)>>4;

            if(bl==374)
            {

            }
            else if(bl!=371)
            {
                block.push(new Block(374, x, y));
                item.push(new Item(218, x, y, 0, 0));
            }
            else if(this.type==TYPE_MINI)
            {
                block.push(new Block(bl, x, y));
            }
            else
            {
                block.push(new Block(bl, x, y ,1, 20, -60));
                block.push(new Block(bl, x, y, 1, -20, -60));
                block.push(new Block(bl, x, y, 1, 20, -20));
                block.push(new Block(bl, x, y, 1, -20, -20));
            }
        }
    }




    //ジャンプ
    updateJump()
    {
            //ジャンプ
        if(keyb.aBUTTON)
            {
                if(this.jump == 0)
                {
                    this.anim = ANIME_JUMP
                    this.jump = 1;
                }
                if(this.jump<15)this.vy = -(64-this.jump);
            }
            if(this.jump)this.jump++;
    }
    
    //横方向の移動
    updateWalkSub(dir)
    {

        //最高速までの加速
        if(dir==0 && this.vx<MAX_SPEED)this.vx++;
        if(dir==1 && this.vx>-MAX_SPEED)this.vx--;

        //ジャンプしてない時
        if(!this.jump)
        {
            //立ちポーズだった時はカウンタリセット
            if(this.anim==ANIME_STAND)this.acou=0;

            //アニメを歩きアニメ
            this.anim = ANIME_WALK;
            //方向を設定
            this.dirc = dir;
        
            //逆の時はブレーキをかける
            if(dir ==0 && this.vx<0)this.vx++;
            if(dir ==1 && this.vx>0)this.vx--;
            //逆に強い加速はブレーキアニメ
            if(dir==1 && this.vx>8||
                dir == 0 && this.vx<-8)
                this.anim=ANIME_BRAKE;
        }
    }

    //歩く処理
    updateWalk()
    {
            //横移動
        if(keyb.Left) {
            this.updateWalkSub(1);
        }else if(keyb.Right) {
            this.updateWalkSub(0);
        }else {
            if(!this.jump)
            {
                if(this.vx>0)this.vx-=1;
                if(this.vx<0)this.vx+=1;
                if(!this.vx) this.anim = ANIME_STAND;
            }
        }
    }
    //スプライトを変える
    updateAnim()
    {
        switch(this.anim)
        {
            case ANIME_STAND:
                this.snum = 0;
                break;
            case ANIME_WALK:
                this.snum = 2+((this.acou/6)%3);
                break;
            case ANIME_JUMP:
                this.snum = 6;
                break;
            case ANIME_BRAKE:
                this.snum = 5;
                break;
        }
        //ちっちゃいおじさん
        if(this.type == TYPE_MINI)this.snum+=32;
    
        if(this.dirc)this.snum += 48;
    }
    update()
    {
        //きのこを取った時のエフェクト
        if(this.kinoko)
        {
            let anim = [32, 14, 32, 14, 32, 14, 0, 32, 14, 0];
            this.snum = anim[this.kinoko>>2];
            this.h = this.snum==32?16:32;
            if(this.dirc)this.snum += 48;

            if(++this.kinoko == 40)
            {
                this.type = TYPE_BIG;
                this.ay = 0;
                this.kinoko = 0;
            }
            return;
        }
    //アニメ用のカウンタ
        this.acou++;
        if(Math.abs(this.vx)==MAX_SPEED)this.acou++;

        this.updateJump();
        this.updateWalk();
        this.updateAnim();

            //重力
        if(this.vy<64)this.vy+=GRAVITY;

        //横の壁のチェック
        this.checkWall();

        //床のチェック
        this.checkFloor();

       //天上のチェック
       this.checkCeal();


        this.x += this.vx;
        this.y += this.vy;

        /*
        //床にぶつかる
            if(this.y>160<<4)
            {
                if(this.anim==ANIME_JUMP)this.anim=ANIME_WALK;
                this.jump = 0;
                this.vy = 0;
                this.y = 160<<4;
            }
        */

    }
    draw()
    {
        let px = (this.x>>4)-field.scx;
        let py = (this.y>>4)-field.scy;

        let sx = (this.snum&15)<<4;
        let sy = (this.snum>>4)<<4;
        let w = this.w;
        let h = this.h
        
        py += (32-h);

        vcon.drawImage(chImg, sx, sy, w, h, px, py, w, h);
    }
}
