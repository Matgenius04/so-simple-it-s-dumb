let socket = io();
let lastpeople;
let numberId;
const canvas = document.getElementsById('canvas');
const ctx = canvas.getContext('2d');
socket.emit('position', {
  x: 0,
  y: 0
});
socket.on('numberid', number => {
  numberId = number;
})
window.addEventListener('resize', () => {
  let screenX = window.innerWidth/2;
  let screenY = window.innerHeight/2;
  ctx.translate(screenX,screenY);
})
let keys = [];
setTimeout(()=>{
window.addEventListener('keydown', e => {
  keys[e.keyCode] = true;
  console.log(e.keyCode);
}, false);

window.addEventListener('keyup', e => {
  keys[e.keyCode] = false;
}, false)
},50)


setInterval(() => {
  if (keys[87]) {
    console.log('keydown w')
    socket.emit('move', 'up');
    //client prediction
    // lastpeople[numberId].yPosition += 3;
    // updatePos()
  }
  if (keys[65]) {
    console.log('keydown a')
    socket.emit('move', 'left');
    //client prediction
    // lastpeople[numberId].xPosition += -3;
    // updatePos()
  }
  if (keys[83]) {
    console.log('keydown s')
    socket.emit('move', 'down');
    //client prediction
    // lastpeople[numberId].yPosition += -3;
    // updatePos()
  }
  if (keys[68]) {
    console.log('keydown d')
    socket.emit('move', 'right');
    //client prediction
    // lastpeople[numberId].xPosition += 3;
    // updatePos()
  }
}, 50);

//client prediction
/*
let updatePos = () => {
  if (document.getElementsByClassName('player').length) {
    for (let r = 0; r < document.getElementsByClassName('player').length; r++) {
      document.getElementsByClassName('player')[r].remove();
    }
  }
  for (let x = 0; x < lastpeople.length; x++) {
    let circle = document.createElement('div');
    let midx = window.innerWidth / 2;
    let midy = window.innerHeight / 2;
    circle.setAttribute('style', `position:absolute;left:${midx + lastpeople[x].xPosition}px;top:${midy - lastpeople[x].yPosition}px;background-color:${lastpeople[x].color};height:50px;width:50px;border-radius:25px;display:block;`)
    circle.setAttribute('class', 'player');
    document.getElementById('fakecanvas').appendChild(circle);
  }
}
*/

//server updates
socket.on('update', people => {
  lastpeople = people;
  for (let x=0; x<people.length;x++) {
    window.requestAnimationFrame(draw)
  }

  //html version
  // if (document.getElementsByClassName('player').length) {
  //   for (let r = 0; r < document.getElementsByClassName('player').length; r++) {
  //     document.getElementsByClassName('player')[r].remove();
  //   }
  // }
  // for (let x = 0; x < people.length; x++) {
  //   let circle = document.createElement('div');
  //   let midx = window.innerWidth / 2;
  //   let midy = window.innerHeight / 2;
  //   circle.setAttribute('style', `position:absolute;left:${midx + people[x].xPosition}px;top:${midy - people[x].yPosition}px;background-color:${people[x].color};height:50px;width:50px;border-radius:25px;display:block;`)
  //   circle.setAttribute('class', 'player');
  //   document.getElementById('fakecanvas').appendChild(circle);
  // }
})

let draw = () => {
  let circle = new Path2D();
  circle.arc()
}