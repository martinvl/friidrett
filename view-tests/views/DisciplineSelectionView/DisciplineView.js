var EventEmitter = require('events').EventEmitter;

function DisciplineView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

DisciplineView.prototype = new EventEmitter();
DisciplineView.prototype.constructor = DisciplineView;
module.exports = DisciplineView;

DisciplineView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

DisciplineView.prototype.setupState = function () {
    this.state = {};
};

DisciplineView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'discipline';

    if (this.el.hasOwnProperty('ontouchend')) {
        this.el.ontouchend = function () {
            self.handleSelect();
        };
    } else {
        this.el.onclick = function () {
            self.handleSelect();
        };
    }

    this.nameField = document.createElement('div');
    this.nameField.className = 'discipline_name';
    this.el.appendChild(this.nameField);
};

DisciplineView.prototype.setState = function (state, silent) {
    this.state = state;

    if (!silent)
        this.update();
};

DisciplineView.prototype.handleSelect = function () {
    this.emit('select');
};

DisciplineView.prototype.update = function () {
    this.nameField.innerHTML = this.state.name;
};

/*
   {
   name:'',
   description:''
   }
   */
