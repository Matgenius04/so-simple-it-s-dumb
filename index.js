const port = 3000;
const http = require('http');
let clock = 50; //milleseconds between sending updates
const express = require('express');
const app = express();
const server = http.createServer(app)
const io = require('socket.io').listen(server);
app.use(express.static('public'));
server.listen(port);
let list = {
    ids:[],
    people:[]
}
io.on('connection', socket => {
    let latency = ()=>{
        socket.emit('latency',Date.now(),starttime=>{
            return Date.now() - starttime;
        });
    };
    let movementMessages = {up:0,left:0,down:0,right:0};
    setInterval(()=>{
        movementMessages = {up:0,left:0,down:0,right:0};
    },clock)
    console.log('someone connected');
    socket.on('position', (position) => {
    let color = ['red','blue','orange','yellow','black','green'];
    let pickColor = Math.floor(Math.random()*6);
        let person = {
            xPosition: position.x,
            yPosition: position.y,
            color: color[pickColor],
            barrelAngle: 0
        }
        list.ids.push(socket.id);
        list.people.push(person);
        console.log(list);
        socket.emit('numberid',list.ids.length - 1);
        socket.emit('update',list.people);
    })
    socket.on('barrelAngle',angle=>{
        const find = list.ids.findIndex(id => id == socket.id);
        if (list.people[find]) {
            list.people[find].barrelAngle = angle;
        }
    })
    socket.on('move', (direction) => {
        const find = list.ids.findIndex(id => id == socket.id);
        if (list.people[find]) {
            if(direction=='up') {
            movementMessages.up++;
            list.people[find].yPosition += -2;
        }
        if(direction=='left') {
            movementMessages.left++;
            list.people[find].xPosition += -2;
        }
        if(direction=='down') {
            movementMessages.down++;
            list.people[find].yPosition += 2;
        }
        if(direction=='right') {
            movementMessages.right++;
            list.people[find].xPosition += 2;
        }
        }
        if (movementMessages == undefined) {
            movementMessages = {up:0,left:0,down:0,right:0};
        }
        if (movementMessages.up>6 || movementMessages.left>6 || movementMessages.down>6 || movementMessages.right>6) {
            socket.emit('hacker',movementMessages);socket.disconnect()
        }
    });
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
        console.log(list)
        const find = list.ids.findIndex(id => id == socket.id);
        list.people.splice(list.people[find],1)
        list.ids.splice(list.ids[find],1)
        for(let x=0;x<list.people.length;x++){
            sendNumberId(x);
        }
    })
})

sendNumberId = personIndex =>{
    io.to(list.ids[personIndex]).emit('numberid',personIndex);
}
checkProximity = ()=>{
    
}
setInterval(()=>{
    io.emit('update',list.people)

    //trying to detect collisions
    // let positions = [];
    // let n = list.people.length;
    // for (let x=0;x<n;x++){
    //     positions.push({x:list.people[x].xPosition,y:list.people[x].yPosition})
    // }
    // for (let x=0;x<n*(n-1)/2;x++){}
},clock)