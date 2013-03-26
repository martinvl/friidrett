var DisciplineSelectionView = require('../../views/DisciplineSelectionView/DisciplineSelectionView');

var view = new DisciplineSelectionView();
var state = [
    {
        name:'Spyd',
        description:''
    },
    {
        name:'Lengde',
        description:''
    },
    {
        name:'Kast',
        description:''
    },
    {
        name:'Stav',
        description:''
    }
];

view.setState(state);

view.on('select', function (discipline) {
    window.alert(discipline.name);
});

document.body.appendChild(view.el);
