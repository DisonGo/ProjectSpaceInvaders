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
    draw(canctx) {
        canctx.beginPath()
        canctx.fillStyle = this.color
        //canctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, 1)
        //canctx.fill()
        //canctx.fillStyle = this.color
        canctx.fillRect(this.x, this.y, this.w, this.h)
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
    constructor(){

    }
}