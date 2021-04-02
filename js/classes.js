let Particle = class{
    constructor(x, y, w, h, color, moveType,viewType) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.r = window.partSett.w/2
        this.color = color
        this.moveType = moveType
        this.viewType = viewType
        
        if (moveType == "straight") {
            this.k = 0
        } else {
            this.refreshSpeed()
            this.k = getRandom(0, 1)
            this.PI = 0
            this.incriment = getRandom(0.04,0.3)
        }
    }
    refreshSpeed() {
        if (this.moveType == "sin") {
            this.altitude = getRandom(window.partSett.particleSpeed * window.partSett.particleSpeed / 10, window.partSett.particleSpeed)
        }
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        if(this.viewType=="circle"){
            ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, 1)
            ctx.fill()
            ctx.fillStyle = this.color
        }
        else{
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }
    }
    move(x, y) {
        this.x += x
        this.y += y
    }
    collision(obj2){
        let obj1 = this
        let XColl=false;
        let YColl=false;
      
        if ((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w)) XColl = true;
        if ((obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h)) YColl = true;
      
        if (XColl&YColl){
            return true;
        }
        return false;
    }
    switchViewType(){
        if(this.viewType == "circle")this.viewType = "square"
        else this.viewType = "circle"
    }
}
let BadPart = class extends Particle {
    constructor(x, y, w, h, moveType,viewType,damage){
        super(x, y, w, h, "red", moveType,viewType)
        this.damage = damage
    }
    inflictStatus(obj,statusSett,statusFunc){
        if(obj.statusCapable){
            obj.getStatus(statusSett,statusFunc)
        }
    }
    inflictDamage(obj){

    }
}
let Player = class {
    constructor(position,w,h,color,type){
        this.w = w
        this.h = h
        this.position = position
        this.color = color
        this.setType(type)
        this.SizeLimit = 500
        this.lifeLimit = 500
        this.life = 1
        this.fontSize = 10
        this.hasHealth = true
        this.statusCapable = true
        this.calcActiveArea()
        this.SaveData = {
            w:this.w,
            h:this.h,
            position:this.position,
            color:this.color,
            type:this.type
        }
    }
    draw(ctx){
        if(this.curCtx != ctx)this.curCtx = ctx
        this.fontSize = 10+ 10* this.life/100
        ctx.font = this.fontSize+"px 'Open Sans', sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = this.color
        if(this.type == 1){
            ctx.fillRect(this.position.x, this.position.y, this.w, this.h)
        }else{
            ctx.beginPath()
            ctx.ellipse(this.position.x+ this.w/2, this.position.y+this.h/2, this.w/2, this.h/2, 0, 0, 2*Math.PI);
            ctx.fill()
        }
        ctx.fillStyle = "Black"
        ctx.strokeText(this.life,this.position.x+ this.w/2, this.position.y+this.h/2+this.fontSize/4)
    }
    makePopUp(text){
        ctx.fillStyle = "green"
        ctx.font = this.fontSize/2+ Math.max(this.w,this.h)/4+"px 'Open Sans', sans-serif"
        ctx.fillText(text,this.position.x+ this.w*4/5, this.position.y+this.h/5)
    }
    move(pos){
        this.position.x = pos.x - this.w/2
        this.position.y = pos.y - this.h/2
    }
    setType(t){
        switch(t){
            case "square":
                this.type = 1
                break;
            case "elipse":
                this.type = 2
                break; 
            default:
                console.log("Wrong type input");
        }
    }
    setSize(w,h){
        this.w = w
        this.h = h
    }
    switchType(){
        if(this.type == 1)this.type = 2
        else this.type = 1
    }
    setColor(color){
        this.color = color
    }
    collision(obj2){
        let obj1 = this
        let XColl=false;
        let YColl=false;
      
        if ((obj1.position.x + obj1.w >= obj2.x) && (obj1.position.x <= obj2.x + obj2.w)) XColl = true;
        if ((obj1.position.y + obj1.h >= obj2.y) && (obj1.position.y <= obj2.y + obj2.h)) YColl = true;
      
        if (XColl&YColl){return true;}
        return false;
    }

    increaseSize(inc){
        // if(Math.max(this.w,this.h)<this.SizeLimit)
        if(this.life<this.lifeLimit){
            this.w+=inc
            this.h+=inc
            this.position.x-=inc/2
            this.position.y-=inc/2
        }
        else{
            this.switchType()
            this.position.x+=this.w/2 - this.SaveData.w/2
            this.position.y+=this.h/2 - this.SaveData.h/2
            this.w = this.SaveData.w
            this.h = this.SaveData.h
            this.life = 1
            this.lifeLimit+=100
            return true
        }
        this.life++
        return false
    }
    calcActiveArea(){
        this.activeArea = {
            x1:this.x,
            y1:this.y,
            x2:this.x+ this.w,
            y2:this.y+ this.h,
        }
    }
    ifDead(){
        if(this.life<0){

        }
    }
    dead(){

    }
}