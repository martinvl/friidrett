var EventEmitter = require('events').EventEmitter;

function ContestantView() {
    EventEmitter.prototype.constructor.apply(this);

    this.initialize();
    this.update();
}

ContestantView.prototype = new EventEmitter();
ContestantView.prototype.constructor = ContestantView;
module.exports = ContestantView;

ContestantView.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

ContestantView.prototype.setupState = function () {
    this.state = {};
};

ContestantView.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'contestant';

    this.startNumField = document.createElement('div');
    this.startNumField.className = 'contestant_start_num';
    this.el.appendChild(this.startNumField);

    this.presentField = document.createElement('div');
    var presentButton = document.createElement('div');
    presentButton.className = 'contestant_button';
    this.presentField.appendChild(presentButton);
    this.el.appendChild(this.presentField);

    var self = this;
    if (this.presentField.hasOwnProperty('ontouchend')) {
        this.presentField.ontouchend = function () {
            self.handleToggle();
        };
    } else {
        this.presentField.onclick = function () {
            self.handleToggle();
        };
    }

    this.nameField = document.createElement('div');
    this.nameField.className = 'contestant_name';
    this.el.appendChild(this.nameField);

    this.clubField = document.createElement('div');
    this.clubField.className = 'contestant_club';
    this.el.appendChild(this.clubField);
};

ContestantView.prototype.handleToggle = function () {
    this.emit('toggle', this);
};

ContestantView.prototype.toggle = function () {
    this.state.present = !this.state.present;
    this.update();
};

ContestantView.prototype.setState = function (state) {
    this.state = state;

    this.update();
};

ContestantView.prototype.update = function () {
    this.startNumField.innerHTML = this.state.startNum;
    this.presentField.className = 'contestant_present' + (this.state.present ? '' : ' contestant_not_present');
    this.nameField.innerHTML = this.state.name;
    this.clubField.innerHTML = this.state.club;
};

/*
   {
   startNum:69,
   name:'Mathias Johansen',
   club:'Moss IL',
   present:false
   }
   */
