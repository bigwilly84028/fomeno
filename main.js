var width = window.innerWidth;
var height = window.innerHeight;

function loadImages(sources, callback) {
    var assetDir = './assets/';
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function () {
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = assetDir + sources[src];
    }
}

function drawBackground(background, beachImg, text) {
    var context = background.getContext();
    context.drawImage(beachImg, 0, 0);
    context.setAttr('font', '20pt Calibri');
    context.setAttr('textAlign', 'center');
    context.setAttr('fillStyle', 'white');

    if (text) {
        context.fillText(text, background.getStage().getWidth() / 2, 40);
    }
}

function initStage(images) {
    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
    });

    var background = new Konva.Layer();
    var overLayer = new Konva.Layer();
    var animalShapes = [];

    // defaul overlay positions
    var overLays = {
        overLay: {
            x: 20,
            y: 20
        }
    };

    // create draggable overlays
    for (var key in overLays) {
        // anonymous function to induce scope
        (function () {
            var privKey = key;
            var anim = overLays[key];

            var overLay = new Konva.Image({
                image: images[key],
                x: anim.x,
                y: anim.y,
                draggable: true,
                name: "overlayObjName"
            });

            // overLay.on('dragmove', function () {
            //     document.body.style.cursor = 'pointer';
            // });

            // DONT FORGET MOBILE EVENTS TOO
            //overLay.on('click touchstart', function (event) {
                //alert("boo-yah, grandma... ", event);
            //});

            overLayer.add(overLay);
            animalShapes.push(overLay);
        })();
    }

    // begin transform attempt
    stage.on('click touchstart', function (event) {
        focusLayer(event);
    });

    function focusLayer(event) {
        // if click on empty area - remove all transformers
        if (event.target === stage) {
            stage.find('Transformer').destroy();
            document.body.style.cursor = 'default';
            overLayer.draw();
            return;
        }
        // do nothing if clicked NOT on our rectangles
        if (!event.target.hasName('overlayObjName')) {
            return;
        }

        // create new transformer anchors
        var tr = new Konva.Transformer({
            anchorSize: 20,
            borderDash: [7, 7]
        });
        overLayer.add(tr);
        tr.attachTo(event.target);
        event.target.moveToTop();
        document.body.style.cursor = 'pointer';

        overLayer.draw();
    }

    // end transform attempt

    stage.add(background);
    stage.add(overLayer);

    //drawBackground(background, images.background, 'Ahoy! Here is some custom text');
    drawBackground(background, images.background);
}

var sources = {
    background: 'baby3.jpg',
    overLay: 'overlay-two-dark.png'
};

loadImages(sources, initStage);


