let backgroundLoaded = false
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
                if(typeof window.particleArr !=="undefined"){
                    for (let i = 0; i < window.particleArr.length; i++) {
                        window.particleArr[i].move((newRoll.value - window.canSett.can.width) / 2, 0)
                    }
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
    widthRange.value = canvas.width
    speedRange.value = window.partSett.particleSpeed
}

function updCanvasSize(can) {
    //can.width = aWidth
    can.height = aHeight
    window.partSett.updateSpawnRange()
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
    updCanvasSize(canvas)
    window.refreshRefresher()
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
        loadBackground(ctx, canvas)
        backgroundLoaded = switchBool(backgroundLoaded)
    }
    hideElem(menuButtons[0])
    // ctx.strokeStyle = "black" 
    // ctx.fillStyle = "black"
    //for(let i = 0; i<menuButtons.length;i++){hideElem(menuButtons[i])} 
    // ctx.strokeRect(0,0,canvas.width,canvas.height)
    // ctx.fillRect(0,0,canvas.width,canvas.height)
    // // setTimeout(function(){
    // //     ctx.strokeStyle = "white" 
    // //     ctx.fillStyle = "white"
    // //     ctx.fillRect(0,0,canvas.width,canvas.height)
    // //     for(let i = 0; i<menuButtons.length;i++){showElem(menuButtons[i])} 
    // // },1000)
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
    }
}

function exitBut() {

}

function loadMenu() {
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

function createParticle(x, y, w, h, color, type) {
    let newParticle = new Particle(x, y, w, h, color, type)
    return newParticle;
}

function resetCanvas(canctx, can) {
    canctx.fillStyle = window.canSett.background
    canctx.fillRect(0, 0, can.width, can.height)
}

function createBackground(canctx, can) {
    window.particleArr = [];
    if (typeof createInt !== "undefined") {
        clearInterval(createInt)
    }

    function drawParticleArr() {
        for (let i = 0; i < window.particleArr.length; i++) {
            window.particleArr[i].draw(canctx)
        }
    }

    function moveParticalesDown() {
        for (let i = 0; i < window.particleArr.length; i++) {
            if (window.particleArr[i].type == "straight") {
                window.particleArr[i].move(0, 1 * window.partSett.particleSpeed)
            } else {
                window.particleArr[i].PI += window.particleArr[i].incriment
                if (window.particleArr[i].PI >= 6.28) window.particleArr[i].PI -= 6.28
                window.particleArr[i].move(Math.cos(window.particleArr[i].PI) * window.particleArr[i].altitude * window.particleArr[i].k, 1 * window.partSett.particleSpeed)
            }
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
        let x, y, h, w, color, type, newPart, createSucses = false
        w = window.partSett.w
        h = window.partSett.h
        window.partSett.setColor()
        color = window.partSett.color
        let chance = Math.round(getRandom(0, 1))
        window.partSett.setMode()

        function randomX() {
            return getRandom(window.partSett.spawnRange.begin, window.partSett.spawnRange.end)
        }
        if (window.partSett.mode == "all") {
            if (Math.round(getRandom(0, 1))) type = "straight"
            else type = "sin";
        } else type = window.partSett.mode
        if (window.particleArr.length > 0) {
            createSucses = false
            while (!createSucses) {
                x = randomX()
                y = -h
                newPart = createParticle(x, y, w, h, color, type)
                // for (let i = 0; i < window.particleArr.length; i++) {
                //     if (!(newPart.colision(window.particleArr[i]))) createSucses = true
                // }
                createSucses = true
            }
        } else {
            x = randomX()
            y = -h
            newPart = createParticle(x, y, w, h, color, type)
        }
        window.particleArr.push(newPart)
        window.createInter = setTimeout(createPartInterval, (1000 / window.partSett.particleSpawnPerSec))
    }

    function refreshInterval() {
        resetCanvas(canctx, can)
        checkOut()
        drawParticleArr()
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