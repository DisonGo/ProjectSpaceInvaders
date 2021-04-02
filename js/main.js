let canvas = document.body.querySelector("#mainCanvas")
let ctx = canvas.getContext('2d'); // Контекст холста
window.addEventListener("resize", RESIZE);
window.canSett = {
    can : canvas,   
    ctx : ctx,
    background : "pink"
}
window.partSett = {
    w: 10,
    h: 10,
    setSize(width, height) {
        this.w = width;
        this.h = height
    },
    color: "",
    curColorMode: "random",
    colorMods: {
        1: "random",
        2: "black"
    },
    setColor() {
        for (key in this.colorMods) {
            if (key == this.curColorMode)
                this.curColorMode = this.colorMods[key]
        }
        switch (this.curColorMode) {
            case "random":
                this.color = getRandCSSColor()
                break;
            case "black":
                this.color = "black"
                break;
            default:
                alert("setColor error")
        }
    },
    particleSpawnPerSec: 5,
    setParticleSpawnSpeed(x) {
        this.particleSpawnPerSec = x
    },
    spawnRange:{
        begin: 0,
        end: window.canSett.can.width - this.w
    },
    setSpawnRange(begin,end){
        this.spawnRange.begin = begin
        this.spawnRange.end = end
    },
    updateSpawnRange(){
        window.partSett.setSpawnRange(0,window.canSett.can.width - window.partSett.w)
    },
    particleSpeed: 10,
    setParticleSpeed(x) {
        this.particleSpeed = x
    },
    dynamicSpeedOn: false,
    curTypeMode: 1,
    typeMods: {
        1: "all",
        2: "onlyStraight",
        3: "onlySin"
    },
    setMode() {
        for (key in this.typeMods) {
            if (key == this.curTypeMode)
                this.curTypeMode = this.typeMods[key]
        }
        switch (this.curTypeMode) {
            case "all":
                this.mode = "all"
                break;
            case "onlyStraight":
                this.mode = "straight"
                break;
            case "onlySin":
                this.mode = "sin"
                break;
            default:
                alert("setMode error")
        }
    },
    mode: ""
}
window.playerSett = {
    w:70,
    h:70,
    position : {
        x:window.canSett.can.width/2 - this.w/2,
        y:window.canSett.can.height - 60 - this.h
    },
    color:getRandCSSColor(),
    type:"square",
    setSize(w,h){
        this.w = w
        this.h = h
    }
}
window.gameStarted = false
window.canvas = canvas
window.ctx = ctx
canvas.width = 500
canvas.height = aHeight
window.partSett.dynamicSpeedOn = false
window.partSett.setParticleSpawnSpeed(100)
window.partSett.setSize(10, 10)
window.partSett.setSpawnRange(0,window.canSett.can.width - window.partSett.w)
window.partSett.setParticleSpeed(4)
window.playerSett.setSize(20,20)
let menuButtons = []
startGame()