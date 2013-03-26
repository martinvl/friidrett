var Overview = require('../../views/Overview/Overview');

var view = new Overview();
var state = {
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    numContestants:'38',
    remarks:'800g spyd',
    notifications:[
        'Husk å registrere vind',
        'Husk å gå på do',
        'Ikke drit deg ut',
        'Kjøp øl',
    ],
    rulebookAddress:'http://lemonparty.org'
};

view.setState(state);

var container = document.createElement('div');
container.style.height = (window.innerHeight - 40) + 'px';
container.style.padding = "20px";

container.appendChild(view.el);
document.body.appendChild(container);
