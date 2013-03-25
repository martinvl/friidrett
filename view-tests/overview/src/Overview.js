function Overview() {
    this.initialize();
    this.update();
}

module.exports = Overview;

Overview.prototype.initialize = function () {
    this.setupState();
    this.setupElement();
};

Overview.prototype.setupState = function () {
    this.state = {};
};

Overview.prototype.setupElement = function () {
    this.el = document.createElement('div');
    this.el.className = 'overview';

    var header = document.createElement('div');
    header.className = 'header';
    this.el.appendChild(header);

    this.disciplineField = document.createElement('div');
    this.disciplineField.className = 'discipline';
    header.appendChild(this.disciplineField);

    this.classNameField = document.createElement('div');
    this.classNameField.className = 'class';
    header.appendChild(this.classNameField);

    var info = document.createElement('div');
    info.className = 'info';
    this.el.appendChild(info);

    this.locationField = document.createElement('div');
    this.locationField.className = 'location';
    info.appendChild(this.locationField);

    this.startingTimeField = document.createElement('div');
    this.startingTimeField.className = 'startingTime';
    info.appendChild(this.startingTimeField);

    this.numContestantsField = document.createElement('div');
    this.numContestantsField.className = 'numContestants';
    this.el.appendChild(this.numContestantsField);

    this.remarksField = document.createElement('div');
    this.remarksField.className = 'remarks';
    this.el.appendChild(this.remarksField);

    this.notificationsList = document.createElement('div');
    this.notificationsList.className = 'notifications';
    this.el.appendChild(this.notificationsList);

    this.rulesButton = document.createElement('div');
    this.rulesButton.className = 'rules';
    this.rulesButton.innerHTML = 'Regler';
    this.el.appendChild(this.rulesButton);
};

Overview.prototype.setState = function (state) {
    this.state = state;

    this.update();
};

Overview.prototype.update = function () {
    this.disciplineField.innerHTML = this.state.discipline;
    this.classNameField.innerHTML = this.state.className;
    this.locationField.innerHTML = this.state.location;
    this.startingTimeField.innerHTML = this.state.startingTime;
    this.numContestantsField.innerHTML = this.state.numContestants + ' påmeldte';
    this.remarksField.innerHTML = this.state.remarks;

    this.notificationsList.innerHTML = '';
    for (var idx in this.state.notifications) {
        var notification = this.state.notifications[idx];

        var notificationField = document.createElement('div');
        notificationField.className = 'notification';
        notificationField.innerHTML = notification;

        this.notificationsList.appendChild(notificationField);
    }
};

/*
{
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    numContestants:'38',
    remarks:'800g',
    notifications:['Husk å registrere vind', 'Husk å gå på do'],
    rulebookAddress:'http://lemonparty.org'
}
*/
