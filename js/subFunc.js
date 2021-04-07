let backgroundLoaded = false
let playerLoaded = false
let RangeVis = false
let cooldown = false
let turn = true
window.PI = 0

function setCooldown() {
    window.cooldown = switchBool(cooldown)
    setTimeout(function () {
        window.cooldown = false
    }, 400)
}
window.setCoolDown = setCooldown;

function createRanges() {
    let curRoll = "widthRange"

    function createRoll() {
        let newRoll = document.createElement("input")
        newRoll.type = "range"
        newRoll.previousDisplay = "block"
        newRoll.prevCursor = "pointer"
        newRoll.classList.add("transisted")
        newRoll.style.width = "150px"
        newRoll.style.height = "50px"
        newRoll.style.display = "none"
        newRoll.style.opacity = 0
        newRoll.style.position = "absolute"
        newRoll.style.background = "white"
        newRoll.style.borderRadius = "5%"
        //newRoll.style.border = "1px solid white"
        return newRoll
    }
    for (let i = 0; i < 2; i++) {
        let newRoll = createRoll()
        if (i == 0) {
            curRoll = "widthRange"
        } else curRoll = "speedRange"
        if (curRoll == "widthRange") {
            newRoll.min = 0;
            newRoll.max = aWidth
            newRoll.style.bottom = "60px"
            newRoll.id = "widthRange"
            newRoll.addEventListener("input", function () {
                window.canSett.can.width = newRoll.value
                window.partSett.updateSpawnRange()
                if (typeof window.particleArr !== "undefined") {
                    // for (let i = 0; i < window.particleArr.length; i++) {
                    //     window.particleArr[i].move((newRoll.value - window.canSett.can.width) / 2, 0)
                    // }
                    window.refreshRefresher();
                }
            })
        } else {
            newRoll.min = 1;
            newRoll.max = 10
            newRoll.style.bottom = "90px"
            newRoll.id = "speedRange"
            newRoll.addEventListener("input", function () {
                window.partSett.particleSpeed = newRoll.value
                window.refreshSpeed()
            })
        }
        document.body.insertBefore(newRoll, document.body.firstChild)
    }
    widthRange.value = window.canSett.can.width
    speedRange.value = window.partSett.particleSpeed
}

function preLoadPlayerConsrtuctor() {
    let constructCanvas = document.createElement("canvas")
    constructCanvas.height = aHeight
    constructCanvas.width = 600
    constructCanvas.classList.add("centered")
    constructCanvas.id = "constrCanvas"
    document.body.insertBefore(constructCanvas, document.body.firstChild)
    let ctx = constructCanvas.getContext('2d');
    window.constrCanSett = {
        can: constructCanvas,
        ctx: ctx,
        background: "pink"
    }
    loadUI(ctx, constructCanvas)
    window.addEventListener("resize", function () {
        updCanvasSize(constructCanvas)
        window.UI.refreshRefresher()
    });
}

function updCanvasSize(can) {
    if (typeof (can) !== "undefined") {
        can.height = aHeight
        if (can == window.canSett.can) {
            window.partSett.updateSpawnRange()
        }
    }
}

function updateInputRange() {
    if (typeof widthRange !== "undefined") {
        widthRange.max = aWidth
    }
}

function RESIZE() {
    updateSizes()
    updateInputRange()
    resizeBody()
    updCanvasSize(window.canSett.can)
    if (window.gameStarted) window.refreshRefresher()
}

function switchDispElemTo(elem, newDisplay) {
    elem.previousDisplay = elem.style.display
    elem.style.display = newDisplay
}

function undoSwitchDispl(elem) {
    elem.style.display = elem.previousDisplay
}


function hideElem(elem) {
    elem.style.opacity = 0;
    elem.prevCursor = elem.style.cursor;
    elem.style.cursor = "default"
    setTimeout(function () {
        if (elem.style.display == "none" || typeof elem.style.previousDisplay === "undefined") {
            elem.previousDisplay = "block"
        } else elem.previousDisplay = elem.style.display
        switchDispElemTo(elem, "none")
    }, 400)
}

function showElem(elem) {
    undoSwitchDispl(elem)
    elem.style.opacity = 1;
    elem.style.cursor = elem.prevCursor;
}

function startBut() {
    if (!backgroundLoaded) {
        loadBackground(window.canSett.ctx, window.canSett.can)
        backgroundLoaded = switchBool(backgroundLoaded)
    }
    hideElem(menuButtons[0])
    for (let i = 0; i < menuButtons.length; i++) {
        menuButtons[i].classList.add("hiddenMenu")
    }
    window.canSett.can.style.cursor = "none"
    window.gameStarted = true
    if (!playerLoaded) {
        loadPlayer()
    }
}

function settingsBut() {
    if (typeof widthRange === 'undefined') {
        createRanges()
    }
    if (!window.cooldown) {
        if (RangeVis) {
            hideElem(widthRange)
            hideElem(speedRange)
            RangeVis = switchBool(RangeVis)
            window.setCooldown()
        } else {
            showElem(widthRange)
            showElem(speedRange)
            RangeVis = switchBool(RangeVis)
            window.setCooldown()
        }
        if (window.gameStarted) {
            menuButtons[1].classList.toggle("hiddenMenu")
        }
    }
}

function exitBut() {
    window.location.reload()
}

function loadPlayer() {
    let w = window.playerSett.w,
        h = window.playerSett.h,
        type = window.playerSett.type,
        color = window.playerSett.color
    let position = window.playerSett.position
    window.Player = new Player(position, w, h, color, type)
    if(typeof(window.playerSkin)!=="undefined"){
        window.Player.loadSkin(window.playerSkin)
    }
    window.Player.draw(window.canSett.ctx)
}

function loadMenu() {
    showElem(window.canSett.can)
    let butNum = 3;
    let butSet = {
        width: 70,
        height: 50,
        space: 4
    }
    for (let i = 0; i < butNum; i++) {
        let newButton = document.createElement("div");
        switch (i) {
            case 0:
                newButton.innerHTML = "Start";
                newButton.addEventListener("click", startBut)
                newButton.style.marginLeft = -(butSet.width + 4 + butSet.space) * 2 + "px"
                break;
            case 1:
                newButton.innerHTML = "Settings";
                newButton.addEventListener("click", settingsBut)
                break;
            case 2:
                newButton.innerHTML = "Exit";
                newButton.addEventListener("click", exitBut)
                newButton.style.marginRight = -(butSet.width + 4 + butSet.space) * 2 + "px"
                break;
        }
        newButton.style.width = butSet.width + "px"
        newButton.style.height = butSet.height + "px"
        newButton.classList.add("menuButtons")
        newButton.classList.add("noSelect")
        newButton.classList.add("transisted")
        newButton.addEventListener("mouseenter", function () {
            newButton.style.background = "rgb(233,238,241)"
        })
        newButton.addEventListener("mouseleave", function () {
            newButton.style.background = ""
        })
        newButton.addEventListener("mousedown", function () {
            newButton.style.background = "rgb(51,51,51)"
            newButton.style.color = "white"
        })
        newButton.addEventListener("mouseup", function () {
            newButton.style.background = ""
            newButton.style.color = "black"
        })
        menuButtons.push(newButton)
    }
    for (let i = menuButtons.length - 1; i >= 0; i--) {
        //log(menuButtons)
        document.body.insertBefore(menuButtons[i], document.body.firstChild)
    }

}

function createTimedAnimation(time, fps, func) {
    let newAnimationSett = {
        time: time,
        fps: fps,
        func: func,
        animationOn: true,
        firstRun: true
    }
    if (typeof (window.animationArr) !== "undefined") {
        window.animationArr.push(newAnimationSett)
    } else {
        window.animationArr = []
        window.animationArr.push(newAnimationSett)
    }
}

function createParticle(x, y, w, h, color, moveType, viewType, type) {
    let newParticle
    switch (type) {
        case "Particle":
            newParticle = new Particle(x, y, w, h, color, moveType, viewType)
            break
        case "Bad Particle":
            newParticle = new BadPart(x, y, w, h, color, moveType, viewType)
            break
        case "Damage Particle":
            newParticle = new DamagePart(x, y, w, h, color, moveType, viewType, arguments[arguments.length - 1])
            break
    }
    return newParticle;
}

function drawAnimations() {
    if (typeof (window.animationArr) !== "undefined") {
        for (let i = window.animationArr.length - 1; i >= 0; i--) {
            let timer
            if (window.animationArr[i].animationOn) {
                window.animationArr[i].func()
                if (window.animationArr[i].firstRun) {
                    timer = setTimeout(function () {
                        window.animationArr[i].animationOn = false
                        window.animationArr.splice(i)
                    }, window.animationArr[i].time)
                    window.animationArr[i].firstRun = false
                }
            }
        }
    }
}

function checkUIButLists() {
    if (typeof (window.UI.buttonArr) !== "undefined") {
        let arr = window.UI.buttonArr
        if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                for (let j = i+1; j < arr.length; j++) {
                    if (arr[i].DOM.listId == arr[j].DOM.listId) {
                        arr[i].DOM.listArr.push(arr[j])
                        arr[j].DOM.listArr.push(arr[i])
                    }
                }
            }
        }
    }
}

function resetCanvas(canctx, can) {
    canctx.fillStyle = window.canSett.background
    canctx.fillRect(0, 0, can.width, can.height)
}

function loadUI(ctx, can) {
    window.UI = {}
    let UI = window.UI
    UI.buttonArr = []
    UI.buttonArr.searchById = (id)=>{
        for(let elem of UI.buttonArr){
            if(elem.DOM.id == id)return elem 
        }
        return false
    }
    UI.createSett = {}
    UI.createMod = false
    can.playerPartArr = []
    let test
    function closePlayerConstructor() {
        //window.UI = {}
        let cordsx1 = [],cordsy1 = []
        let cordsx2 = [],cordsy2 = []
        for(let elem of can.playerPartArr)
        {
            elem.calcEdges()
            cordsx1.push(elem.edges.x1)
            cordsx2.push(elem.edges.x2)
            cordsy1.push(elem.edges.y1)
            cordsy2.push(elem.edges.y2)
        }
        function sor(a,b) {
            return a-b
        }
        let playerCords = {
            x1:(cordsx1.sort(sor))[0],
            y1:(cordsy1.sort(sor))[0],
            x2:(cordsx2.sort(sor))[cordsx2.length-1],
            y2:(cordsy2.sort(sor))[cordsy2.length-1],
            mid : {
                x:this.x1 + (this.x2 - this.x1)/2,
                y:this.y1 + (this.y2 - this.y1)/2
            }
        }
        let scaleX = window.playerSett.w / (playerCords.x2 - playerCords.x1)  
        let scaleY = window.playerSett.h / (playerCords.y2 - playerCords.y1)
        let scaledPlayerParts = []  
        for(let elem of can.playerPartArr)
        {
            elem.x -= playerCords.x1
            elem.y -= playerCords.y1
            let data = elem.calcScaled(scaleX,scaleY);
            scaledPlayerParts.push(new PlayerPart(data.x,data.y,data.w,data.h,elem.color,elem.moveType,elem.viewType))
        }
        window.playerSkin = scaledPlayerParts
        UI = {}
        clearInterval(window.UI.refreshInter)
        hideElem(can)
        showElem(window.canSett.can)
        loadMenu()
    }
    function createObjPreview() {
        test = new PlayerPart(0, 0, 100, 100, "rgba(9,9,9,.1)", "straight", UI.createSett.type)
    }
    let but1 = new UIButton(0, 0, 50, 50, ctx, "Добавить", "white", "elipse", {
        clickFunc: (elem) => {
            let deleteBut = UI.buttonArr.searchById(4)
            if (deleteBut.selected) deleteBut.selected = false
            if (!elem.selected) {
                UI.createMod = false
                UI.createSett.type = "none"
            }
            UI.deleteMod = false
        },
        hoverFunc: (elem) => {
            elem.color = "rgb(238, 238, 238)"
        },
        mouseOutFunc: (elem) => {
            elem.color = "white"
        }
    }, new DOMElement("listHead", 1, 1, 1, false))
    let but2 = new UIButton(60, 0, 80, 50, ctx, "Прямоугольник", "white", "square", {
        clickFunc: (elem) => {
            UI.createMod = true
            UI.deleteMod  = false
            UI.createSett.type = "square"
            
            createObjPreview()
            test.x = elem.e.x - test.w / 2
            test.y = elem.e.y - test.h / 2
            return 1
        },
        hoverFunc: (elem) => {
            elem.color = "rgb(238, 238, 238)"
        },
        mouseOutFunc: (elem) => {
            elem.color = "white"
        }
    }, new DOMElement("listElement", 2, 1, 1, true))
    let but3 = new UIButton(150, 0, 100, 50, ctx, "Элипс", "white", "elipse", {
        clickFunc: (elem) => {
            UI.createMod = true
            UI.deleteMod = false
            UI.createSett.type = "elipse"
            
            createObjPreview()
            test.x = elem.e.x - test.w / 2
            test.y = elem.e.y - test.h / 2
            return 1
        },
        hoverFunc: (elem) => {
            elem.color = "rgb(238, 238, 238)"
        },
        mouseOutFunc: (elem) => {
            elem.color = "white"
        }
    }, new DOMElement("listElement", 3, 1, 1, true))
    let but4 = new UIButton(0, 60, 50, 50, ctx, "Удалить", "white", "elipse", {
        clickFunc: (elem) => {
            let createBut = UI.buttonArr.searchById(1)
            if (createBut.selected){
                createBut.selected = false
                createBut.typeFunc(createBut)
            }
            if(elem.selected){
                UI.createMod = false
                UI.deleteMod = true
            }else UI.deleteMod = false
            return 1
        },
        hoverFunc: (elem) => {
            elem.color = "rgb(238, 238, 238)"
        },
        mouseOutFunc: (elem) => {
            elem.color = "white"
        }
    }, new DOMElement("listHead", 4, 3, 3, false))
    let doneBut = new UIButton(0,120 ,50 ,50 ,ctx, "Создать","white","elipse", {
        clickFunc: (elem) => {
            closePlayerConstructor()
        },
        hoverFunc: (elem) => {
            elem.color = "rgb(238, 238, 238)"
        },
        mouseOutFunc: (elem) => {
            elem.color = "white"
        }
    },new DOMElement("listElement","completeBut",4,4,false ))
    UI.buttonArr.push(but1, but2, but3, but4,doneBut)
    loadColorPannel()
    checkUIButLists()
    
    function checkButColision(x, y, event) {
        let e = {
            x: x,
            y: y
        }
        for (let elem of UI.buttonArr) {
            if (elem.collision({
                    x: x,
                    y: y,
                    w: 1,
                    h: 1
                })) {
                switch (event) {
                    case "click":
                        elem.clickEvent(e)
                        return true
                        break
                    case "mousemove":
                        if (!elem.hoverActive) {
                            elem.hoverEvent(e)
                            elem.hoverActive = true
                            return true
                        }
                        break
                    default:
                        console.log("UIBut: Wrong event enter");
                }
            } else {
                if (elem.hoverActive) {
                    elem.hoverActive = false
                    elem.mouseOutEvent(e)
                }
            }
        }
        return false
    }

    function loadColorPannel() {
        UI.colorButArr = []
        let colors = []
        UI.color = "black"
        let h = 50,
        w = 50,
        x = 0,
        y = 0,
        butCount = 9,
        margins = 10
        for(let i = 0;i<butCount;i++)
        {

        }
        for (let i = 0; i < butCount; i++) {
            x = (can.width - (w * butCount + margins *(butCount-1))) / 2 + i * margins + i*w
            y = can.height - margins - h
            let colorBut = new UIButton(x, y, w, h, ctx, "", getRandCSSColor(), "elipse", {
                clickFunc: (elem) => {
                    UI.color = elem.color
                    for(let elm of can.playerPartArr){
                        if(elm.selected){
                            elm.color = elem.color
                        }
                    }
                },
                hoverFunc: ()=>{},
                mouseOutFunc: ()=>{}
            }, new DOMElement("listElement", i + 5, 2, 2, false))
            UI.colorButArr.push(colorBut)
            UI.buttonArr.push(colorBut)
        }
    }

    function checkPlayerPartCol(x, y) {
        let arr = can.playerPartArr
        if (typeof (arr) !== "undefined") {
            for (let elem of arr) {
                elem.selected = false
            }
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i].collision({
                        x: x,
                        y: y,
                        w: 1,
                        h: 1
                    })) {
                    arr[i].selected = true
                    arr[i].findPart(x, y)
                    if (arr.length > 1) {
                        arr.sort((a, b) => {
                            return a.selected - b.selected
                        })
                    }
                    break
                }
            }
        }
    }
    can.addEventListener("click", function (e) {
        let x = e.clientX - can.getBoundingClientRect().x
        let y = e.clientY - can.getBoundingClientRect().y
        checkPlayerPartCol(x, y)
        if (!checkButColision(x, y, "click") && UI.createMod) {
            let newPlayerPart = new PlayerPart(x - 50, y - 50, 100, 100, UI.color, "straight", window.UI.createSett.type)
            can.playerPartArr.push(newPlayerPart)

        }
        else if (UI.deleteMod){
            let arr = can.playerPartArr
            for(let i = arr.length-1;i>=0;i--){
                if(arr[i].selected)[
                    arr.splice(i)
                ]
            }
        }
    })

    function playerPartArrHover(x, y) {
        let arr = can.playerPartArr
        if (typeof (arr) !== "undefined") {
            for (let elem of arr) {
                if (elem.selected) {
                    elem.findPart(x, y)
                }
                if (can.mouseDown) {
                    elem.drag(x, y)
                }
            }
        }
    }
    can.addEventListener("mousemove", function (e) {
        let x = e.clientX - can.getBoundingClientRect().x
        let y = e.clientY - can.getBoundingClientRect().y
        checkButColision(x, y, "mousemove")
        if (UI.createMod) {
            test.x = x - test.w / 2
            test.y = y - test.h / 2
        }
        playerPartArrHover(x, y)
    })

    function playerPartArrMouseDown(x, y) {
        let arr = can.playerPartArr
        if (typeof (arr) !== "undefined") {
            for (let elem of arr) {
                elem.lockPartFocus = true
                elem.touchPoint.x = x
                elem.touchPoint.y = y
                elem.touchPoint.difX = elem.touchPoint.x - elem.x
                elem.touchPoint.difY = elem.touchPoint.y - elem.y
            }
        }
    }
    can.addEventListener("mousedown", function (e) {
        let x = e.clientX - can.getBoundingClientRect().x
        let y = e.clientY - can.getBoundingClientRect().y
        //checkButColision(e.clientX - can.getBoundingClientRect().x, e.clientY, "mousemove")
        can.mouseDown = true
        playerPartArrMouseDown(x, y)
    })

    function playerPartArrMouseUp() {
        let arr = can.playerPartArr
        if (typeof (arr) !== "undefined") {
            for (let elem of arr) {
                elem.lockPartFocus = false
                elem.draggble = true
            }
        }
    }
    can.addEventListener("mouseup", function () {
        can.mouseDown = false
        playerPartArrMouseUp()
    })

    function drawUI() {
        if (UI.createMod) {
            test.draw(ctx)
        }
        for (let elem of UI.buttonArr) {
            elem.draw()
        }
        if (typeof (UI.colorButArr) !== "undefined") {
            for (let elem of UI.colorButArr) {
                elem.draw()
            }
        }
        if(typeof(window.playerSkin)!=="undefined"){
            for(let elem of window.playerSkin){
                elem.draw(ctx)
            }
        }
    }

    function drawPlayerArr() {
        if (typeof (can.playerPartArr) !== "undefined") {
            for (let elem of can.playerPartArr) {
                elem.draw(ctx)
            }
        }
    }

    function refreshInterval() {
        resetCanvas(ctx, can)
        drawUI()
        drawPlayerArr()
        drawAnimations()
    }
    UI.refreshInter = setInterval(refreshInterval, 10)
    UI.refreshRefresher = function () {
        refreshInterval()
    }
}

function createBackground(canctx, can) {
    window.particleArr = [];
    window.particleArr.subArr = []
    if (typeof createInt !== "undefined") {
        clearInterval(createInt)
    }

    function setShadow() {
        canctx.shadowColor = 'black';
        canctx.shadowBlur = 3;
        canctx.shadowOffsetX = 3;
        canctx.shadowOffsetY = 3;
    }

    function drawParticleArr() {
        for (let i = 0; i < window.particleArr.length; i++) {
            window.particleArr[i].draw(canctx)
        }
    }


    function moveParticalesDown() {
        function checkCol(elem, index) {
            if (window.Player.collision(elem)) {
                if (elem.type == "Damage Particle") {
                    elem.inflictDamage(window.Player, elem.damage)
                }
                window.particleArr.splice(index, 1)
                if (window.Player.increaseSize(2)) {
                    createTimedAnimation(4000, 100, function () {
                        window.Player.makePopUp("+100")
                    })
                }
            }
        }
        let x = 0,
            y = 1
        for (let i = window.particleArr.length - 1; i >= 0; i--) {
            if (window.particleArr[i].moveType == "straight") {
                window.particleArr[i].move(x, y * window.partSett.particleSpeed)
            } else {
                window.particleArr[i].PI += window.particleArr[i].incriment
                if (window.particleArr[i].PI >= 6.28) window.particleArr[i].PI -= 6.28
                window.particleArr[i].move(Math.cos(window.particleArr[i].PI) * window.particleArr[i].altitude * window.particleArr[i].k, y * window.partSett.particleSpeed)
            }
            checkCol(window.particleArr[i], i)
        }
    }

    function refreshSpeed() {
        for (let i = 0; i < window.particleArr.length; i++) {
            if (window.particleArr[i].type == "sin") {
                window.particleArr[i].refreshSpeed()
            }
        }
    }

    window.refreshSpeed = refreshSpeed;

    function checkOut() {
        for (let i = 0; i < window.particleArr.length; i++) {
            if (window.particleArr[i].y > can.height) window.particleArr.splice(i, 1)
        }
        //log(window.particleArr.length)
    }

    function movePartInterval() {
        moveParticalesDown()
    }

    function createPartInterval() {
        let x, y, h, w, color, moveType, viewType, type, newPart, createSucses = false
        w = window.partSett.w
        h = window.partSett.h
        window.partSett.setColor()
        color = window.partSett.color
        viewType = window.partSett.viewType
        let chance
        window.partSett.setMode()

        function randomX() {
            return getRandom(window.partSett.spawnRange.begin, window.partSett.spawnRange.end)
        }
        if (window.partSett.mode == "all") {
            if (Math.round(getRandom(0, 1))) moveType = "straight"
            else moveType = "sin";
        } else moveType = window.partSett.mode
        chance = Math.round(getRandom(0, 10))
        if (chance == 0) {
            type = "Damage Particle"
            w *= 1.5
            h *= 1.5
        } else {
            type = "Particle"
        }
        if (window.particleArr.length > 0) {
            createSucses = false
            let tryN = 0
            while (!createSucses) {
                if (tryN >= 10) break
                x = randomX()
                y = -h
                newPart = createParticle(x, y, w, h, color, moveType, viewType, type, {
                    value: 10
                })
                createSucses = true
                for (let i = window.particleArr.length - 1; i >= 0; i--) {
                    if (newPart.collision(window.particleArr[i])) {
                        createSucses = false
                        break;
                    }
                }
                tryN++
                //  createSucses = true
            }
        } else {
            x = randomX()
            y = -h
            newPart = createParticle(x, y, w, h, color, moveType, viewType, type, {
                value: 10
            })
        }
        window.particleArr.push(newPart)
        window.createInter = setTimeout(createPartInterval, (1000 / window.partSett.particleSpawnPerSec))
    }

    function drawPlayer() {
        if (typeof (window.Player) == "undefined") loadPlayer()
        else window.Player.draw(canctx)
    }
    // function checkCol(){
    //     for(let i=window.particleArr.length-1;i>=0; i--){
    //         if(window.Player.collision(window.particleArr[i])){
    //             window.particleArr.splice(i--,1)
    //             window.Player.increaseSize(0.125*2)
    //         }
    //     }
    // }

    function refreshInterval() {
        window.refreshTimeStarted = new Date()
        resetCanvas(canctx, can)
        checkOut()
        //checkCol()
        drawParticleArr()
        drawPlayer()
        drawAnimations()
    }

    function dynamicSpeedInterval() {
        if (turn) {
            if (window.partSett.particleSpeed < 10) window.partSett.particleSpeed++
            else {
                turn = switchBool(turn)
            }
        } else {
            if (window.partSett.particleSpeed > 1) window.partSett.particleSpeed--
            else {
                turn = switchBool(turn)
            }
        }
        window.refreshSpeed()
    }
    window.partSett.switchPartViewType = function () {
        for (let elem of window.particleArr) {
            elem.switchViewType()
        }
        if (window.partSett.viewType == "square") window.partSett.viewType = "elipse"
        else window.partSett.viewType = "square"
    }
    window.canSett.can.addEventListener("mousemove", function (e) {
        if (typeof (window.Player) !== "undefined") {
            let position = {
                x: e.clientX - window.canSett.can.getBoundingClientRect().x,
                y: e.clientY
            }
            window.Player.move(position)
        }
    })
    window.canSett.can.addEventListener("click", function () {
        if (typeof (window.Player) !== "undefined") {
            window.Player.setColor(getRandCSSColor())
            //window.Player.switchType()
        }
    })
    if (window.partSett.dynamicSpeedOn) window.dynamicSpeedInter = setInterval(dynamicSpeedInterval, 100)
    window.createInter = setTimeout(createPartInterval, (1000 / window.partSett.particleSpawnPerSec))
    window.moveInter = setInterval(movePartInterval, 20)
    window.refreshInter = setInterval(refreshInterval, 10)
    if (typeof speedRange === "undefined") {
        createRanges()
    }
    window.refreshCreateSpeed = function () {
        clearTimeout(window.createInter)
        window.createInter = setTimeout(createPartInterval, (1000 / window.partSett.particleSpawnPerSec))
    }
    window.refreshRefresher = function () {
        refreshInterval()
    }
    speedRange.addEventListener("input", function () {
        window.refreshCreateSpeed()
        //clearInterval(window.moveInter)
        //window.moveInter = setInterval(movePartInterval, 200 / window.partSett.particleSpeed)
    })
}