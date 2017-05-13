var canvasEl = document.querySelector('#canvas');
var ctx = canvasEl.getContext('2d');
var mousePos = [0, 0];

var easingFactor = 5.0;
var backgroundColor = '#000';
var nodeColor = '#fff';
var edgeColor = '#fff';

var nodes = [];
var edges = [];

window.onresize = function () {
    canvasEl.width = document.body.clientWidth;
    canvasEl.height = canvasEl.clientHeight;

    if (nodes.length == 0) {
        constructNodes();
    }

    render();
}

function constructNodes() {
    for (var i = 0; i < 100; i++) {
        var node = {
            drivenByMouse: i == 0,
            x: Math.random() * canvasEl.width,
            y: Math.random() * canvasEl.height,
            vx: Math.random() * 1 - 0.5,
            vy: Math.random() * 1 - 0.5,
            radius: Math.random() > 0.9 ? Math.random() * 3 + 3 : Math.random() * 3 + 1
        }
        nodes.push(node);
    }

    nodes.forEach(function (e) {
        nodes.forEach(function (e2) {
            if (e == e2) {
                return;
            }

            var edge = {
                from: e,
                to: e2
            }

            addEdge(edge);
        });
    });
}

function addEdge(edge) {
    var ignore = false;

    edges.forEach(function (e) {
        if (e.from == edge.from && e.to == edge.to) {
            ignore = true;
        }

        if (e.to == edge.from && e.from == edge.to) {
            ignore = true;
        }
    });

    if (!ignore) {
        edges.push(edge);
    }
}

function step() {
    nodes.forEach(function (e) {
        if (e.drivenByMouse) {
            return;
        }

        e.x += e.vx;
        e.y += e.vy;

        function clamp(min, max, value) {
            if (value > max) {
                return max;
            } else if (value < min) {
                return min
            } else {
                return value;
            }
        }

        if (e.x <= 0 || e.x >= canvasEl.width) {
            e.vx *= -1;
            e.x = clamp(0, canvasEl.width, e.x);
        }

        if (e.y <= 0 || e.y >= canvasEl.height) {
            e.vy *= -1;
            e.y = clamp(0, canvasEl.height, e.y);
        }
    });

    adjustNodeDrivenByMouse();
    render();
    window.requestAnimationFrame(step);
}

function adjustNodeDrivenByMouse() {
    nodes[0].x += (mousePos[0].x - nodes[0].x) / easingFactor;
    nodes[0].y += (mousePos[0].y - nodes[0].y) / easingFactor;
}

function lengthOfEdge(edge) {
  return Math.sqrt(Math.pow((edge.from.x - edge.to.x), 2) + Math.pow((edge.from.y - edge.to.y), 2));
}

function render() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

    edges.forEach(function (e) {
        var l = lengthOfEdge(e);
        var threshold = canvasEl.width / 8;

        if (l > threshold) {
            return;
        }

        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = (1.0 - l / threshold) * 2.5;
        ctx.globalAlpha = (1.0 - l / threshold);
        ctx.beginPath();
        ctx.moveTo(e.from.x, e.from.y);
        ctx.lineTo(e.to.x, e.to.y);
        ctx.stroke();
    });

    ctx.globalAlpha = 1.0;

    nodes.forEach(function (e) {
        if (e.drivenByMouse) {
            return;
        }

        ctx.fillStyle = nodeColor;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, 2 * Math.PI);
        ctx.fill();
    });
}

// window.onmousemove = function (e) {
//   mousePos[0] = e.clientX;
//   mousePos[1] = e.clientY;
// }

window.onresize();
window.requestAnimationFrame(step);
















