var ContestantsView = require('../../views/ContestantsView/ContestantsView');

var view = new ContestantsView();
var state = {
    discipline:'Spyd',
    className:'MJ',
    location:'Hovedbanen',
    startingTime:'09.00',
    contestants:[
        {
            startNum:69,
            name:'Martin Larsen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Sebastian Søberg',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Mathias Johansen',
            club:'Moss IL',
            present:false
        },
        {
            startNum:69,
            name:'Jonas Aarum',
            club:'Moss IL',
            present:true
        }
    ]
};

view.on('toggle_contestant', function (contestantView) {
    contestantView.toggle();
});

view.setState(state);

document.body.appendChild(view.el);
