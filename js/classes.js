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
    colision(anPart) {
        return ((this.x + this.w >= anPart.x && this.x <= (anPart.x + anPart.w)) && (this.y + this.h >= anPart.y && this.y <= (anPart.y + anPart.h)))
    }
}
let Player  = class{
    constructor(position,w,h,color,type){
        this.w = w
        this.h = h
        this.position = position
        this.color = color
        this.setType(type)
    }
    draw(ctx){
        ctx.fillStyle = this.color
        if(this.type == 1){
            ctx.fillRect(this.position.x, this.position.y, this.w, this.h)
        }else{
            ctx.beginPath()
            ctx.ellipse(this.position.x+ this.w/2, this.position.y, this.w/2, this.h/2, 0, 0, 2*Math.PI);
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
}