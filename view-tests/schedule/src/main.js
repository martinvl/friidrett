var ScheduleView = require('../../views/ScheduleView/ScheduleView');

var view = new ScheduleView();
var state = {
    1:{
        startTime:'09.00',
        disciplineName:'Spyd',
        className:'MJ',
        location:'Hovedbanen'
    },
    2:{
        startTime:'10.00',
        disciplineName:'Spyd',
        className:'J18-19',
        location:'Kjelleren'
    }
};

view.on('select', function (eventId) {
    window.alert('Select event ' + eventId);
});

view.setState(state);

document.body.appendChild(view.el);
