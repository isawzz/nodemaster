// C:\DATA\dev\js\08cardGame1\script
var game = new Game;
game.run();

//#region funcs (v5stack.js)
function Game() {
    this.panel = new Panel();
    this.run = function () {
        this.panel.start();
    }
}
function Number(div, board, n) {
    var self = this;
    this.div = div;
    this.board = board;
    this.n = n;
}
function Panel() {
    var self = this;
    this.div = document.getElementById("div-board");
    this.receptors = new Array();
    this.numbers = new Array();
    this.drags = new Array();
    this.dragX = 0;
    this.dragY = 0;
    this.start = function () {
        self.createNumbers(5);
    }
    this.createReceptors = function (num) {
        var w = 100;
        var h = 30;
        for (i = 0; i < num; i++) {
            self.createReceptor("r" + String(i), 64 * i, 120, w, h);
        }
    }
    this.createReceptor = function (id, l, t, w, h) {
        var div = createDroppable(id, "receptorclass", l, t, w, h);
        var receptor = new Receptor(div, self);
        self.receptors.push(receptor);
        self.div.appendChild(div);
        return (receptor);
    }
    this.createNumbers = function (num) {
        var w = 100;
        var offset = 10;
        for (i = 0; i < num; i++) {
            var randomnumber = Math.floor(Math.random() * 11)
            self.createNumber("n" + String(i), randomnumber, (w + offset) * i, 0, w);
        }
    }
    this.createNumber = function (id, n, l, t, w) {
        var div = createDraggable(id, "numberclass", l, t, w, String(n));
        var number = new Number(div, self, n);
        self.numbers.push(number);
        self.div.appendChild(div);
        return (number);
    }
}
function Receptor(div, board) {
    var self = this;
    this.div = div;
    this.board = board;
}
//#endregion funcs (v5stack.js)
