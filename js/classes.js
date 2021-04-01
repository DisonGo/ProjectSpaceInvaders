let Particle = class {
    constructor(x, y, w, h, color, type) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.r = window.partSett.w/2
        this.color = color
        this.type = type
        if (type == "straight") {
            this.k = 0
        } else {
            this.refreshSpeed()
            this.k = getRandom(0, 1)
            this.PI = 0
            this.incriment = getRandom(0.04,0.3)
        }
    }
    refreshSpeed() {
        if (this.type == "sin") {
            this.altitude = getRandom(window.partSett.particleSpeed * window.partSett.particleSpeed / 10, window.partSett.particleSpeed)
        }
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        //ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, 1)
        //ctx.fill()
        //ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
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
}
let Player  = class{
    constructor(position,w,h,color,type){
        this.w = w
        this.h = h
        this.position = position
        this.color = color
        this.setType(type)
        this.limit = 100
    }
    draw(ctx){
        ctx.fillStyle = this.color
        if(this.type == 1){
            ctx.fillRect(this.position.x, this.position.y, this.w, this.h)
        }else{
            ctx.beginPath()
            ctx.ellipse(this.position.x+ this.w/2, this.position.y+this.h/2, this.w/2, this.h/2, 0, 0, 2*Math.PI);
            ctx.fill()
        }
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
        if(Math.max(this.w,this.h)<this.limit){
            this.w+=inc
            this.h+=inc
        }
    }
}