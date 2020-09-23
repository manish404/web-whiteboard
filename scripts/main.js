// point class to store mouse coordinates
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// like jquery selector
function $(selector) {
    elem = document.querySelector(selector);
    return elem;
}

// hide and show function
function hide(elem) {
    elem.style.display = "none";
}

function show(elem) {
    elem.style.display = "block";
}

// creates click event listener on element
function addEventListener(elem, work) {
    elem.addEventListener('click', work);
}

// important functions =====================
function findDistance() {
    let dis = Math.sqrt(Math.pow(currPos.x - startPos.x, 2) + Math.pow(currPos.y - startPos.y, 2));
    return dis;
}

// draw function
function draw(x, y) {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
}

function drawShapes() {
    context.putImageData(savedPos, 0, 0);
    context.beginPath();

    if (choosenShape == "line") {
        context.moveTo(startPos.x, startPos.y);
        context.lineTo(currPos.x, currPos.y);
    } else if (choosenShape == "rectangle") {
        let w = currPos.x - startPos.x;
        let h = currPos.y - startPos.y;
        context.rect(startPos.x, startPos.y, w, h);
    } else if (choosenShape == "circle") {
        let distance = findDistance(startPos, currPos);
        context.arc(startPos.x, startPos.y, distance, 0, 2 * Math.PI, false);
    } else if (choosenShape == "triangle") {
        context.moveTo(startPos.x + (currPos.x - startPos.x) / 2, startPos.y);
        context.lineTo(startPos.x, currPos.y);
        context.lineTo(currPos.x, currPos.y);
        context.closePath();
    }
    // remaining eclipse and square

    context.stroke();
}

// download/save drawing
function saveDrawing(url) {
    let name = prompt("Enter filename");

    if (name == null) {
        alert("Enter filename please!");
    } else {
        let fullname = name + ".png";
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(canvas.msToBlob(), fullname);
        } else {
            var src = document.createElement('a');
            src.download = fullname;
            src.href = url;
            src.click();
        }
    }
}

// open menu
function openMenu() {
    let menu = $('.menu');
    menu.style.display = "flex";    // don't remove this.
    // using flex as display:none is used before
    menu.classList.add('makeMenuFlexed');
}

// undo
function undo() {
    if (strikes.length <= 0) alert("Nothing left for undo!");
    
    undos.push(strikes[strikes.length - 1]);
    context.putImageData(strikes[strikes.length - 1], 0, 0);
    strikes.pop();
}

// redo
function redo() {
    if (undos.length <= 0) alert("Nothing left for redo!");

    strikes.push(undos[undos.length - 1]);
    context.putImageData(undos[undos.length - 1], 0, 0);
    undos.pop();
}

// erasing function
function erase(eraserSize) {
    let w, h = eraserSize;
    context.clearRect(currPos.x, currPos.y, w, h);
}

// deleting all boards
function deleteAllBoard() {
    res = confirm("Do you want to delete all boards?");
    if (res) {
        context.clearRect(0, 0, board.width, board.height);
        document.querySelectorAll('.preview').forEach(elem => {
            $('#previewList').removeChild(elem);
        });
        hide(filesDrawer);
        window.location.reload();
    }
}

// shows zoomed value on zoom
function showZoomedValue(value) {
    // let actionsMenu = $('.actions');
    let actionsMenu = $('.actions');
    try {
        actionsMenu.removeChild($('#zoomValue'));
    } catch (e) {
        return e;
    } finally {
        let elem = document.createElement('span');
        elem.innerText = value;
        elem.id = "zoomValue";
        elem.classList.add('.actionBtn');
        actionsMenu.appendChild(elem);
    }
}

function zoomIn() {
    if (zoom <= "2.80") {
        zoom += 0.01;
        let zoomInPercent = zoom.toFixed(2);
        board.style.transform = `translate(0, 0) scale(${zoom})`;
        showZoomedValue(zoomInPercent);
    }
}

function zoomOut() {
    if (zoom >= "0.30") {
        zoom -= 0.01;
        let zoomInPercent = zoom.toFixed(2);
        board.style.transform = `translate(0, 0) scale(${zoom})`;
        showZoomedValue(zoomInPercent);
    }
}

// ===========================================================================================================================================
let canvaBox = $('.board');
let board, context;

let startPos;
let currPos;
let savedPos;
let strikes = [];
let undos = [];
let zoom = 1;

let paintable, shapesOpened, bgListOpened = false;
let choosenShape = null;
let tool = "pen";

// Creating Canvas
function createBoard() {
    board = document.createElement('canvas');
    board.height = canvaBox.clientHeight;
    board.width = canvaBox.clientWidth;
    board.id = "board";
    context = board.getContext('2d');
    canvaBox.appendChild(board);
}
createBoard();

// menus and action buttons / imports =======================
let menu = $('.menu'),
    closeMenuBtn = $('#closeMenuBtn'),
    showFilesBtn = $('#showFilesBtn'),
    filesDrawer = $('.filesDrawer'),
    closeFilesBtn = $('#closeFilesBtn'),
    penSizeBtn = $('#penSize'),
    eraserSizeBtn = $('#eraserSize'),
    penColorBtn = $('#penColor'),
    bgColorBtn = $('#bgColor'),
    shapeChooserBtn = $('.shapeChooser'),
    shapeChooserHolder = $('.shapes'),
    bgChooserBtn = $('#bgChooser'),
    bgImgHolder = $('.bg_images');

let previewId;  // used in functions inside context-menu
let contextMenu = $('#context-menu'),
    openBtnCM = $('#openBtnCM'),
    editBtnCM = $('#editBtnCM'),
    saveBtnCM = $('#saveBtnCM'),
    deleteBtnCM = $('#deleteBtnCM');

// adding functionalities to action buttons.
document.querySelectorAll('.actionBtn').forEach(Btn => {
    let btnID = Btn.id;
    switch (btnID) {
        // MENU
        case "menuBtn":
            addEventListener(Btn, openMenu);
            break;
        // UNDO
        case "undoBtn":
            addEventListener(Btn, undo);
            break;
        // REDO
        case "redoBtn":
            addEventListener(Btn, redo);
            break;
        // SAVE DRAWING
        case "saveBtn":
            addEventListener(Btn, () => {
                let url = board.toDataURL();
                saveDrawing(url);
            });
            break;
        // CLEAR BOARD
        case "clearBtn":
            addEventListener(Btn, () => {
                // because of confirmation no function is created.
                res = confirm("Do you want to clear this board?");
                if (res) context.clearRect(0, 0, board.width, board.height);
            });
            break;
        // DELETE ALL BOARDS
        case "deleteBtn":
            addEventListener(Btn, deleteAllBoard);
            break;
        // MAXIMIZE SCREEN
        case "fullscreenBtn":
            addEventListener(Btn, () => {
                hide($('.actions'));
                show($('.minimizeScreen'));
                hide(menu);
            });
            break;
        //  ZOOM IN BOARD
        case "zoomInBtn":
            addEventListener(Btn, zoomIn);
            break;
        // ZOOM OUT BOARD
        case "zoomOutBtn":
            addEventListener(Btn, zoomOut);
            break;
        //  OPEN FILES DRAWER
        case "showFilesBtn":
            addEventListener(Btn, () => {show(filesDrawer);});
            break;
    }
});

// adding functionaliities to menu buttons
document.querySelectorAll('.CMBtn').forEach(Btn => {
    let btnID = Btn.id;
});

// styling cursor
context.lineCap = "round";
context.lineWidth = penSizeBtn.value;
context.strokeStyle = penColorBtn.value;

// pen and eraser size
['change', 'click'].forEach(event => {
    penSizeBtn.addEventListener(event, () => {
        tool = "pen";
        context.lineWidth = penSizeBtn.value;
        choosenShape = null;
    });
});

['change', 'click'].forEach(event => {
    eraserSizeBtn.addEventListener(event, () => {
        tool = "eraser";
    });
});

// prevent refresh
TODO:

// minimize screen
// minimizing
addEventListener($('.minimizeScreen'), () => {
    show($('.actions'));
    hide($('.minimizeScreen'));
})

// selecting pen color
penColorBtn.addEventListener('change', () => {
    context.strokeStyle = penColorBtn.value;
});
// selecting bg color
bgColorBtn.addEventListener('change', () => {
    board.style.backgroundColor = bgColorBtn.value;
});

// creating shape chooser
let shapePaths = [
    "rectangle",
    "square",
    "circle",
    "eclipse",
    "triangle",
    "line",
]

let shapeChooserList;
function createShapeChooser() {
    shapeChooserList = document.createElement('ul');
    shapePaths.forEach(shape => {
        let shapeChooser = document.createElement('li');
        shapeChooser.classList.add('shapeChooser');
        shapeChooser.title = shape;
        let shapeElm = document.createElement('img');
        shapeElm.src = "./assets/shapes/" + shape + ".png";
        shapeElm.style.filter = "grayscale(100%)";
        // adding functionality to each shapes
        shapeChooser.addEventListener('click', () => {
            choosenShape = shape;
        });
        shapeChooser.appendChild(shapeElm);
        shapeChooserList.appendChild(shapeChooser);
    });
    shapeChooserHolder.appendChild(shapeChooserList);
    shapesOpened = true;
}

// open shape chooser / shapes
shapeChooserBtn.addEventListener('click', () => {
    hide(bgImgHolder);
    show(shapeChooserHolder);
    if (!shapesOpened) {
        createShapeChooser();
    } else if (shapesOpened) {
        shapeChooserHolder.removeChild(shapeChooserList);
        hide(shapeChooserHolder);
        shapesOpened = false;
    }
});

// creating bg images chooser
function createBgChooser() {
    let bgChooserList = document.createElement('ul');
    for (let i = 1; i <= 5; i++) {
        let bgElem = document.createElement('li');
        bgElem.classList.add('bgChooser');
        let bg = document.createElement('img');
        let imgSrc = "./assets/backgrounds/bg" + i + ".jpg";
        bg.src = imgSrc;
        bgElem.appendChild(bg);
        bgElem.addEventListener('click', () => {
            let imageObj = new Image();
            imageObj.onload = function () {
                context.drawImage(imageObj, 0, 0, board.width, board.height);
            };
            imageObj.src = imgSrc;
        });
        bgChooserList.appendChild(bgElem);
    }
    bgImgHolder.appendChild(bgChooserList);
    bgListOpened = true;
}

bgChooserBtn.addEventListener('click', () => {
    hide(shapeChooserHolder);
    show(bgImgHolder);
    if (!bgListOpened) {
        createBgChooser();
    } else if (bgListOpened) {
        bgImgHolder.removeChild(bgChooserList);
        hide(bgImgHolder);
        bgListOpened = false;
    }
});

closeMenuBtn.addEventListener('click', () => {
    hide(menu);
});

// open new board and load sidebar =============================
let previewList = document.createElement('ul');
previewList.id = "previewList";
newBoardBtn.addEventListener('click', () => {
    let preview = document.createElement('img');
    preview.classList.add('preview');
    preview.src = board.toDataURL();
    preview.title = "Right Click Enabled";
    // To open previews in board
    [preview, openBtnCM].forEach(elem => {
        elem.addEventListener('click', () => {
            context.clearRect(0, 0, board.width, board.height);
            let img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            }
            if (elem == preview) {
                img.src = preview.src;
            } else {
                img.src = previewId;
                hide(contextMenu);
            }
        });
    });

    // showing context-menu on click on each preview (using previewID)
    preview.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        previewId = preview.src;    // used for context menu
        contextMenu.style.top = e.clientY + "px";
        contextMenu.style.left = e.clientX + "px";
        show(contextMenu);
    });

    previewList.appendChild(preview);
    filesDrawer.appendChild(previewList);
    context.clearRect(0, 0, board.width, board.height);
});

// editing and deleting board previews
// editing
editBtnCM.addEventListener('click', () => {
    let previewItems = document.querySelectorAll('.preview');
    let editItem = previewId;
    previewItems.forEach(item => {
        if (item.src == editItem) {
            context.clearRect(0, 0, board.width, board.height);
            let img = new Image();
            img.onload = function () {
                context.drawImage(img, 0, 0);
            }
            img.src = item.src;

            let saveEdited_Btn = document.createElement('button');
            saveEdited_Btn.classList.add('actionBtn');
            saveEdited_Btn.innerText = "OK";
            saveEdited_Btn.style.border = "2px solid green"; // for getting focus on the btn.

            saveEdited_Btn.addEventListener('click', () => {
                item.src = board.toDataURL();
                context.clearRect(0, 0, board.width, board.height);
                $('.actions').removeChild(saveEdited_Btn);
            });
            $('.actions').appendChild(saveEdited_Btn);
        }
    });
    hide(contextMenu);
});

// saving preview image
saveBtnCM.addEventListener('click', () => {
    let previewItems = document.querySelectorAll('.preview');
    let saveItem = previewId;
    previewItems.forEach(item => {
        if (item.src == saveItem) {
            saveDrawing(item.src);
        }
    });
});

// deleting
function deletePreview(previewList, delItem) {
    previewList.forEach(item => {
        if (item.src == delItem) {
            $('#previewList').removeChild(item);
            hide(contextMenu);
            context.clearRect(0, 0, board.width, board.height);
        }
    });
}
deleteBtnCM.addEventListener('click', () => {
    let previewItems = document.querySelectorAll('.preview');
    let delItem = previewId;
    deletePreview(previewItems, delItem);
});

// close files drawer
closeFilesBtn.addEventListener('click', () => {
    hide(filesDrawer);
})

// main function implementation =======================
function start(e) {
    paintable = true;

    hide(menu);

    savedPos = context.getImageData(0, 0, board.clientWidth, board.clientHeight);

    if (strikes.length >= 10) strikes.shift();  // removing first position if strikes > 10;
    strikes.push(savedPos);

    if (tool === "eraser") {
        let w, h = eraserSizeBtn.value;
        context.clearRect(startPos.x, startPos.y, w, h);
    } else {
        draw(e.clientX, e.clientY);
    }

    board.addEventListener('mousemove', move);
    document.addEventListener('mouseup', end);

    startPos = new Point(e.clientX, e.clientY);
}

function move(e) {
    currPos = new Point(e.clientX, e.clientY);

    if (!paintable) return;

    if (tool === "eraser") {
        erase(eraserSizeBtn.value);
    } else {
        if (choosenShape != null) {
            drawShapes();
        } else {
            draw(e.clientX, e.clientY);
        }
    }
}

function end(e) {
    board.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', end);
    paintable = false;
    context.beginPath();
}

// listening to board's events
board.addEventListener('mousedown', start);
board.addEventListener('mouseup', end);

board.addEventListener('mousemove', move);

board.addEventListener('change', () => {
    canvaBox.clientWidth = screen.clientWidth;
    canvaBox.clientHeight = screen.clientHeight;
    board.width = canvaBox.clientWidth;
    board.height = canvaBox.clientHeight;
});

board.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) { zoomIn(); } else { zoomOut(e); }
});

// hiding context-menu
[board, filesDrawer].forEach(elem => {
    elem.addEventListener('click', () => {
        hide(contextMenu);
    });

});

document.addEventListener('keydown', (e) => {
    if(e.key === 'f') {
        hide($('.actions'));
        show($('.minimizeScreen'));
        hide(menu);
        $('#status').innerText = 'Press Esc to minimize screen';
        setTimeout(() => {
            $('#status').innerText = '';
        }, 2000);
    }
    else if (e.key === 'Escape') {
        show($('.actions'));
        hide($('.minimizeScreen'));
        $('#status').innerText = 'Press f to maximize screen';
        setTimeout(() => {
            $('#status').innerText = '';
        }, 2000);
    }
});