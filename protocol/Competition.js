{
    name:'',
    isClosed:false,
    disciplines:[
        {
            name:'',
            description:''
        }
    ],
    events:{
        <event id>:{
            disciplineName:'',
            className:'',
            remarks:'',
            location:'',
            startTime:'',
            notifications:['', ''],
            participations:{
                <competitor id>:{
                    isPresent:false,
                    seasonBest:0.0,
                    result:{
                        // result data goes here
                    }
                }
            }
        }
    },
    competitors:{
        <competitor id>:{
            startNum:1,
            name:'',
            club:'',
            className:'',
            participations:[
                <event id>, ...
            ]
        }
    }
}
