let Particle = class {
    constructor(x, y, w, h, color, moveType, viewType) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.edges = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h
        }
        this.r = window.partSett.w / 2
        this.color = color
        this.moveType = moveType
        this.viewType = viewType
        this.type = "particle"
        this.calcScaled()
        if (moveType == "straight") {
            this.k = 0
        } else {
            this.refreshSpeed()
            this.k = getRandom(0, 1)
            this.PI = 0
            this.incriment = getRandom(0.04, 0.3)
        }
    }
    calcScaled(scaleX,scaleY) { 
        let newScale = {
        w : this.w * scaleX,
        h : this.h * scaleY,
        x : this.x * scaleX,
        y : this.y * scaleY
        }
        return(newScale)
    }
    refreshSpeed() {
        if (this.moveType == "sin") {
            this.altitude = getRandom(window.partSett.particleSpeed * window.partSett.particleSpeed / 10, window.partSett.particleSpeed)
        }
    }
    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = this.color
        if (this.viewType == "elipse") {
            ctx.ellipse((this.x + this.w / 2), (this.y + this.h / 2), this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
            ctx.fill()
        } else {
            ctx.fillRect(this.x, this.y, this.w, this.h)
        }
    }
    move(x, y) {
        this.x += x
        this.y += y
    }
    calcEdges() {
        this.edges = {
            x1: this.x,
            x2: this.x + this.w,
            y1: this.y,
            y2: this.y + this.h
        }
    }
    collision(obj2) {
        let obj1 = this
        let XColl = false;
        let YColl = false;

        if ((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w)) XColl = true;
        if ((obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h)) YColl = true;

        if (XColl & YColl) {
            return true;
        }
        return false;
    }
    switchViewType() {
        if (this.viewType == "elipse") this.viewType = "square"
        else this.viewType = "elipse"
    }
}
let BadPart = class extends Particle {
    constructor(x, y, w, h, color, moveType, viewType) {
        super(x, y, w, h, color, moveType, viewType)
        this.type = "Bad Particle"
    }
    inflictStatus(obj, status) {
        if (obj.statusCapable) {
            obj.getStatus(status)
        }
    }
    inflictDamage(obj, damage) {
        if (obj.hasHealth) {
            obj.getDamage(damage)
        }
    }
}
let DamagePart = class extends BadPart {
    constructor(x, y, w, h, color, moveType, viewType, damage) {
        super(x, y, w, h, color, moveType, viewType)
        this.type = "Damage Particle"
        this.damage = damage
        this.color = "white"
    }
}
let PlayerPart = class extends Particle {
    constructor(x, y, w, h, color, moveType, viewType) {
        super(x, y, w, h, color, moveType, viewType)
        this.type = "Player Particle"
        this.selected = false
        this.editMode = true
        this.selectedPart = "none"
        this.findAccuracy = 6
        this.border = {
            px: 2,
            type: "fill",
            color: "",
            selectionColor: "red"
        }
        this.selected = false
        this.lockPartFocus = false
        this.draggble = true
        this.touchPoint = {
            x: 0,
            y: 0,
            difX: 0,
            difY: 0
        }
    }
    findPart(x, y) {
        if (!this.lockPartFocus) {
            if ((this.x + this.findAccuracy > x) && (this.x - this.findAccuracy < x) && (this.y + this.findAccuracy > y) && (this.y - this.findAccuracy < y)) {
                this.selectedPart = "UL";
                window.constrCanSett.can.style.cursor = "nwse-resize"
            } else if ((this.x + this.w + this.findAccuracy > x) && (this.x + this.w - this.findAccuracy < x) && (this.y + this.findAccuracy > y) && (this.y - this.findAccuracy < y)) {
                this.selectedPart = "UR";
                window.constrCanSett.can.style.cursor = "nesw-resize"
            } else if ((this.x + this.w + this.findAccuracy > x) && (this.x + this.w - this.findAccuracy < x) && (this.y + this.h + this.findAccuracy > y) && (this.y + this.h - this.findAccuracy < y)) {
                this.selectedPart = "DR";
                window.constrCanSett.can.style.cursor = "nwse-resize"
            } else if ((this.x + this.findAccuracy > x) && (this.x - this.findAccuracy < x) && (this.y + this.h + this.findAccuracy > y) && (this.y + this.h - this.findAccuracy < y)) {
                this.selectedPart = "DL";
                window.constrCanSett.can.style.cursor = "nesw-resize"
            } else if ((this.x + this.findAccuracy < x) && (this.x + this.w - this.findAccuracy > x) && (this.y + this.findAccuracy > y) && (this.y - this.findAccuracy < y)) {
                this.selectedPart = "U";
                window.constrCanSett.can.style.cursor = "ns-resize"
            } else if ((this.x + this.findAccuracy < x) && (this.x + this.w - this.findAccuracy > x) && (this.y + this.h + this.findAccuracy > y) && (this.y + this.h - this.findAccuracy < y)) {
                this.selectedPart = "D";
                window.constrCanSett.can.style.cursor = "ns-resize"
            } else if ((this.x + this.findAccuracy > x) && (this.x - this.findAccuracy < x) && (this.y + this.findAccuracy < y) && (this.y + this.h - this.findAccuracy > y)) {
                this.selectedPart = "L";
                window.constrCanSett.can.style.cursor = "ew-resize"
            } else if ((this.x + this.w + this.findAccuracy > x) && (this.x + this.w - this.findAccuracy < x) && (this.y + this.findAccuracy < y) && (this.y + this.h - this.findAccuracy > y)) {
                this.selectedPart = "R";
                window.constrCanSett.can.style.cursor = "ew-resize"
            } else if ((this.x + this.findAccuracy < x) && (this.x + this.w - this.findAccuracy > x) && (this.y + this.findAccuracy < y) && (this.y + this.h - this.findAccuracy > y)) {
                this.selectedPart = "B";
                window.constrCanSett.can.style.cursor = "move"
            } else {
                this.selectedPart = "none";
                window.constrCanSett.can.style.cursor = "default"
            }
        }

    }
    drag(x, y) {
        //this.findPart(x,y)
        function UL(elem) {
            elem.w += elem.x - x
            elem.h += elem.y - y
            elem.x = x
            elem.y = y
        }

        function UR(elem) {
            elem.w += (x - elem.w) - elem.x
            elem.h -= y - elem.y
            elem.y += y - elem.y
        }

        function DR(elem) {
            elem
            elem.w += x - (elem.x + elem.w)
            elem.h += y - (elem.y + elem.h)
        }

        function DL(elem) {
            elem.w += elem.x - x
            elem.h += y - (elem.y + elem.h)
            elem.x = x
        }

        function U(elem) {
            elem.h += elem.y - y
            elem.y = y
        }

        function R(elem) {
            elem.w += x - (elem.x + elem.w)
        }

        function D(elem) {
            elem.h += y - (elem.y + elem.h)
        }

        function L(elem) {
            elem.w += elem.x - x
            elem.x = x
        }

        function B(elem) {
            elem.x = x - elem.touchPoint.difX
            elem.y = y - elem.touchPoint.difY
        }
        if (this.draggble) {
            switch (this.selectedPart) {
                case "UL":
                    if ((this.x + this.findAccuracy < this.x + this.w - this.findAccuracy) && (this.y + this.findAccuracy < this.y + this.h - this.findAccuracy)) {
                        UL(this)
                    } else {
                        this.x += -this.findAccuracy
                        this.y += -this.findAccuracy
                        this.w += this.findAccuracy * 2
                        this.h += this.findAccuracy * 2
                        this.draggble = false
                    }
                    break
                case "UR":
                    if ((this.x + this.w - this.findAccuracy > this.x + this.findAccuracy) && (this.y + this.findAccuracy < this.y + this.h - this.findAccuracy)) {
                        UR(this)
                    } else {
                        this.x += 0
                        this.y += -this.findAccuracy
                        this.w += this.findAccuracy * 2
                        this.h += this.findAccuracy
                        this.draggble = false
                    }
                    break
                case "DR":
                    if ((this.x + this.w - this.findAccuracy > this.x + this.findAccuracy) && (this.y + this.h - this.findAccuracy > this.y + this.findAccuracy)) {
                        DR(this)
                    } else {
                        this.x += 0
                        this.y += 0
                        this.w += this.findAccuracy
                        this.h += this.findAccuracy
                        this.draggble = false
                    }
                    break
                case "DL":
                    if ((this.x + this.findAccuracy < this.x + this.h - this.findAccuracy) && (this.y + this.h - this.findAccuracy > this.y + this.findAccuracy)) {
                        DL(this)
                    } else {
                        this.x += -this.findAccuracy
                        this.y += 0
                        this.w += this.findAccuracy
                        this.h += this.findAccuracy
                        this.draggble = false
                    }
                    break
                case "U":
                    if ((this.y + this.findAccuracy < this.y + this.h - this.findAccuracy)) {
                        U(this)
                    } else {
                        this.x += 0
                        this.y += -this.findAccuracy
                        this.w += 0
                        this.h += this.findAccuracy * 2
                        this.draggble = false
                    }
                    break
                case "D":
                    if ((this.y + this.h - this.findAccuracy > this.y + this.findAccuracy)) {
                        D(this)
                    } else {
                        this.x += 0
                        this.y += 0
                        this.w += 0
                        this.h += this.findAccuracy * 2
                        this.draggble = false
                    }
                    break
                case "L":
                    if ((this.x + this.findAccuracy < this.x + this.w - this.findAccuracy)) {
                        L(this)
                    } else {
                        this.x += -this.findAccuracy
                        this.y += 0
                        this.w += this.findAccuracy * 2
                        this.h += 0
                        this.draggble = false
                    }
                    break
                case "R":
                    if ((this.x + this.w - this.findAccuracy > this.x + this.findAccuracy)) {
                        R(this)
                    } else {
                        this.x += 0
                        this.y += 0
                        this.w += this.findAccuracy * 2
                        this.h += 0
                        this.draggble = false
                    }
                    break
                case "B":
                    B(this)
                    break
                default:

            }
        }
    }
    switchSelect() {
        if (!this.selected) {
            this.selected = true
        } else this.selected = false
    }
    draw(ctx) {
        super.draw(ctx)
        if (this.selected) {
            this.drawBorder(ctx)
        }
    }
    drawBorder(ctx) {
        ctx.beginPath()
        ctx.lineWidth = this.border.px
        ctx.strokeStyle = this.border.selectionColor
        if (this.viewType == "elipse") {
            ctx.ellipse((this.x + this.w / 2) , (this.y + this.h / 2) , (this.w / 2 + this.border.px) , (this.h / 2 + this.border.px) , 0, 0, 2 * Math.PI)
            ctx.stroke()
        } else {
            ctx.strokeRect((this.x - this.border.px) , (this.y - this.border.px) , (this.w + this.border.px * 2), (this.h + this.border.px * 2) )
        }
    }
    resize(x, y) {

    }
}
let DOMFuncs = class {
    constructor() {
        this.listHeadFunc = (elem) => {
            for (let elm of elem.DOM.listArr) {
                if (elm.DOM.type != "listHead") {
                    elm.DOM.hidden = switchBool(elm.DOM.hidden)
                }
            }
        }
        this.listElemFunc = (elem) => {}
    }
}
let DOMElement = class {
    constructor(type, id, listId, groupId, hidden) {
        this.type = type
        this.id = id
        this.listId = listId
        this.groupId = groupId
        this.hidden = hidden
    }
}
let UIButton = class {
    constructor(x, y, w, h, ctx, text, background, viewType, func, DOM) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.r = this.w / 2
        this.ctx = ctx
        this.color = background
        this.viewType = viewType
        this.selected = false
        this.border = {
            px: 2,
            type: "fill",
            color: "black",
            selectionColor: "red"
        }
        this.text = text
        this.fontSize = this.h / 5
        this.font = this.fontSize + "px 'Open Sans', sans-serif"
        this.clickFunc = func.clickFunc
        this.hoverFunc = func.hoverFunc
        this.hoverActive = false
        this.mouseOutFunc = func.mouseOutFunc
        this.DOM = DOM
        this.DOM.listArr = []
        this.checkDOMType()
    }
    draw() {
        if (!this.DOM.hidden) {
            this.drawBorders()
            this.drawText()
        }
    }
    checkDOMType() {
        let domFuncs = new DOMFuncs()
        switch (this.DOM.type) {
            case "listHead":
                this.typeFunc = domFuncs.listHeadFunc
                break
            case "listElement":
                this.typeFunc = domFuncs.listElemFunc

        }
    }
    switchSelect() {
        if (!this.selected) {
            for (let elem of this.DOM.listArr) {
                if (elem.DOM.type != "listHead") {
                    elem.selected = false
                }
            }
            this.selected = true
        } else this.selected = false
    }
    drawBorders() {
        this.ctx.beginPath()
        if (this.selected) {
            this.ctx.fillStyle = this.border.selectionColor
        } else {
            this.ctx.fillStyle = this.border.color
        }
        if (this.viewType == "elipse") {
            this.ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.fillStyle = this.color
            this.ctx.beginPath()
            this.ctx.ellipse(this.x + this.w / 2, this.y + this.h / 2, this.w / 2 - this.border.px, this.h / 2 - this.border.px, 0, 0, 2 * Math.PI)
            this.ctx.fill()
        } else {
            this.ctx.fillRect(this.x, this.y, this.w, this.h)
            this.ctx.fillStyle = this.color
            this.ctx.fillRect(this.x + this.border.px, this.y + this.border.px, this.w - this.border.px * 2, this.h - this.border.px * 2)
        }
    }
    drawText() {
        this.ctx.font = this.font
        this.ctx.textAlign = "center"
        this.ctx.fillStyle = "black"
        this.ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2 + this.fontSize / 4)
    }
    setBorderSize(x) {
        this.border.px = x
    }

    collision(obj2) {
        let obj1 = this
        let XColl = false;
        let YColl = false;

        if ((obj1.x + obj1.w >= obj2.x) && (obj1.x <= obj2.x + obj2.w)) XColl = true;
        if ((obj1.y + obj1.h >= obj2.y) && (obj1.y <= obj2.y + obj2.h)) YColl = true;

        if (XColl & YColl) {
            return true;
        }
        return false;
    }
    clickEvent(e) {
        this.e = e
        if (!this.DOM.hidden) {
            this.switchSelect()
            this.hitSound = new Audio("")
            this.hitSound.src = "sound/UI/ButClick.wav"
            this.hitSound.canPlay = false
            this.hitSound.addEventListener("ended", function () {
                this.currentTime = 0;
            })
            this.hitSound.addEventListener('canplaythrough', function () {
                this.canPlay = true
            }, false);
            this.hitSound.play()
            this.typeFunc(this)
            this.clickFunc(this)
        }
    }
    hoverEvent(e) {
        this.e = e
        if (!this.DOM.hidden) {
            this.hoverActive = true
            this.hoverFunc(this)
        }
    }
    mouseOutEvent(e) {
        this.e = e
        if (!this.DOM.hidden) {
            this.mouseOutFunc(this)
        }
    }
}
let Player = class {
    constructor(position, w, h, color, type) {
        this.w = w
        this.h = h
        this.position = position
        this.color = color
        this.setType(type)
        this.SizeLimit = 500
        this.lifeLimit = 500
        this.life = 1
        this.eatMulti = 1 / 8
        this.fontSize = 10
        this.hasHealth = true
        this.statusCapable = true
        this.statusList = []
        this.calcActiveArea()
        this.SaveData = {
            w: this.w,
            h: this.h,
            position: this.position,
            color: this.color,
            type: this.type
        }
    }
    loadSkin(skin){
        this.skin = skin
        for(let elem of this.skin){
            elem.Xdif = elem.x   
            elem.Ydif = elem.y   
        }
    }
    drawSkin(ctx){
        for(let elem of this.skin){
            elem.draw(ctx) 
        }
    }
    draw(ctx) {
        if (this.curCtx != ctx) this.curCtx = ctx
        this.fontSize = 10 + 10 * this.life / 100
        ctx.font = this.fontSize + "px 'Open Sans', sans-serif"
        ctx.textAlign = "center"
        ctx.fillStyle = this.color
        if (this.type == 1) {
            ctx.fillRect(this.position.x, this.position.y, this.w, this.h)
        } else if(this.type == 2){
            ctx.beginPath()
            ctx.ellipse(this.position.x + this.w / 2, this.position.y + this.h / 2, this.w / 2, this.h / 2, 0, 0, 2 * Math.PI);
            ctx.fill()
        }else {
            this.drawSkin(ctx)
        }
        ctx.fillStyle = "Black"
        ctx.strokeText(this.life, this.position.x + this.w / 2, this.position.y + this.h / 2 + this.fontSize / 4)
    }
    makePopUp(text) {
        ctx.fillStyle = "green"
        ctx.font = this.fontSize / 2 + Math.max(this.w, this.h) / 4 + "px 'Open Sans', sans-serif"
        ctx.fillText(text, this.position.x + this.w * 4 / 5, this.position.y + this.h / 5)
    }
    move(pos) {
        this.position.x = pos.x - this.w / 2
        this.position.y = pos.y - this.h / 2
        if(typeof(this.skin) !="undefined"){
            for(let elem of this.skin){
                elem.x = this.position.x + elem.Xdif
                elem.y = this.position.y + elem.Ydif
            }
        }
    }
    setType(t) {
        switch (t) {
            case "square":
                this.type = 1
                break;
            case "elipse":
                this.type = 2
                break;
            case "skin":
                this.type = 3
                break;
            default:
                console.log("Wrong type input");
        }
    }
    setSize(w, h) {
        this.w = w
        this.h = h
    }
    // switchType() {
    //     if (this.type == 1) this.type = 2
    //     else this.type = 1
    // }
    setColor(color) {
        this.color = color
    }
    collision(obj2) {
        let obj1 = this
        let XColl = false;
        let YColl = false;

        if ((obj1.position.x + obj1.w >= obj2.x) && (obj1.position.x <= obj2.x + obj2.w)) XColl = true;
        if ((obj1.position.y + obj1.h >= obj2.y) && (obj1.position.y <= obj2.y + obj2.h)) YColl = true;

        if (XColl & YColl) {
            return true;
        }
        return false;
    }

    increaseSize(inc) {
        // if(Math.max(this.w,this.h)<this.SizeLimit)
        inc *= this.eatMulti
        if (this.life < this.lifeLimit) {
            this.w += inc
            this.h += inc
            this.position.x -= inc / 2
            this.position.y -= inc / 2
        } else {
            //this.switchType()
            this.position.x += this.w / 2 - this.SaveData.w / 2
            this.position.y += this.h / 2 - this.SaveData.h / 2
            this.w = this.SaveData.w
            this.h = this.SaveData.h
            this.life = 1
            this.lifeLimit += 100
            return true
        }
        this.life++
        return false
    }
    calcActiveArea() {
        this.activeArea = {
            x1: this.x,
            y1: this.y,
            x2: this.x + this.w,
            y2: this.y + this.h,
        }
    }
    getStatus(status) {
        if (status.tickType) {
            status.tickInt = setInterval(status.func, status.tickDuration)
            status.durationTimerFunc = () => {
                clearInterval(status.tickInt)
            }
            status.durationTimer = setTimeout(status.durationTimerFunc, status.duration)
        } else {
            status.func()
            status.durationTimerFunc = () => {
                this.clearStatus(status)
            }
            status.durationTimer = setTimeout(status.durationTimerFunc, status.duration)
        }
        this.statusList.push(status)
    }
    clearStatus(status) {
        status.clear()
        for (let i = this.statusList.length - 1; i >= 0; i--) {
            if (this.statusList[i].id == status.id) {
                this.statusList.splice(i)
            }
        }
    }
    getDamage(damage) {
        this.life -= damage.value
        damage.value *= this.eatMulti
        this.w -= damage.value
        this.h -= damage.value
        this.position.x += damage.value / 2
        this.position.y += damage.value / 2

        if (this.ifDead()) this.dead()
    }
    ifDead() {
        if (this.life < 0) return true
        else return false
    }
    dead() {

    }
}