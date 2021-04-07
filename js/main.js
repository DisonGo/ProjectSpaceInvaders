let gameCanvas = document.createElement("canvas")
gameCanvas.height = aHeight
gameCanvas.width = 600
gameCanvas.classList.add("centered")
gameCanvas.id = "gameCanvas"
document.body.insertBefore(gameCanvas, document.body.firstChild)
hideElem(gameCanvas)
let ctx = gameCanvas.getContext('2d');
window.addEventListener("resize", RESIZE);
window.canSett = {
    can: gameCanvas,
    ctx: ctx,
    background: "pink"
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
    spawnRange: {
        begin: 0,
        end: window.canSett.can.width - this.w
    },
    setSpawnRange(begin, end) {
        this.spawnRange.begin = begin
        this.spawnRange.end = end
    },
    updateSpawnRange() {
        window.partSett.setSpawnRange(0, window.canSett.can.width - window.partSett.w)
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
    viewType: "elipse",
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
    w: 70,
    h: 70,
    position: {
        x: window.canSett.can.width / 2 - this.w / 2,
        y: window.canSett.can.height - 60 - this.h
    },
    color: getRandCSSColor(),
    type: "skin",
    setSize(w, h) {
        this.w = w
        this.h = h
    }
}
window.gameStarted = false
gameCanvas.width = 500
gameCanvas.height = aHeight
window.partSett.dynamicSpeedOn = false
window.partSett.setParticleSpawnSpeed(50)
window.partSett.setSize(20, 20)
window.partSett.setSpawnRange(0, window.canSett.can.width - window.partSett.w)
window.partSett.setParticleSpeed(4)
window.playerSett.setSize(50, 50)
let menuButtons = []
startGame()