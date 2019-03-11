let socket = io();
let lastpeople;
let numberId;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let mouseX;
let mouseY;
let screenX = window.innerWidth/2;
let screenY = window.innerHeight/2;
document.getElementsByTagName('body')[0].style.margin = "0 auto";
socket.emit('position', {
  x: 0,
  y: 0
});
socket.on('numberid', number => {
  numberId = number;
  alert(numberId);
});
socket.on('hacker',(moveMentMessages)=>{
  console.log(moveMentMessages);
  alert('Stop trying to hack the game. This session has been terminated.');
});
// document.getElementById('canvas').style.width = `${window.innerWidth}px`;
// document.getElementById('canvas').style.height = `${window.innerHeight}px`;
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.translate(screenX,screenY);
ctx.scale(screenX*2/1080,screenX*2/1080);
window.addEventListener('resize', () => {
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  // document.getElementById('canvas').style.width = `${window.innerWidth}px`;
  // document.getElementById('canvas').style.height = `${window.innerHeight}px`;
  screenX = window.innerWidth/2;
  screenY = window.innerHeight/2;
  ctx.translate(screenX,screenY);
  ctx.scale(screenX*2/1080,screenX*2/1080);
});
let keys = [];
window.addEventListener('load',()=>{
  setTimeout(()=>{

window.addEventListener('keydown', e => {
  keys[e.keyCode] = true;
}, false);

window.addEventListener('keyup', e => {
  keys[e.keyCode] = false;
}, false);

window.addEventListener('mousemove',e=>{
  screenX = window.innerWidth/2;
  screenY = window.innerHeight/2;
  mouseX = e.clientX-screenX-lastpeople[numberId].xPosition;
  mouseY = e.clientY-screenY-lastpeople[numberId].yPosition;
  // console.log(lastpeople[numberId].xPosition)
  // console.log((Math.atan2(mouseY,mouseX)*180)/Math.PI);
});
},500);

});

setInterval(() => {
  if (keys[87]) {
    // console.log('keydown w')
    socket.emit('move', 'up');
    //client prediction
    // lastpeople[numberId].yPosition += 3;
    // updatePos()
  }
  if (keys[65]) {
    // console.log('keydown a')
    socket.emit('move', 'left');
    //client prediction
    // lastpeople[numberId].xPosition += -3;
    // updatePos()
  }
  if (keys[83]) {
    // console.log('keydown s')
    socket.emit('move', 'down');
    //client prediction
    // lastpeople[numberId].yPosition += -3;
    // updatePos()
  }
  if (keys[68]) {
    // console.log('keydown d')
    socket.emit('move', 'right');
    //client prediction
    // lastpeople[numberId].xPosition += 3;
    // updatePos()
  }
  socket.emit('barrelAngle',Math.atan2(mouseY,mouseX));
  socket.on('latency',(starttime,cb)=>{
    cb(starttime);
  });
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
  ctx.clearRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);
  window.requestAnimationFrame(draw);
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
});

function draw() {
  ctx.fillRect(-5,-5,10,10);
  let circle = new Path2D();
  let barrel = new Path2D();
  for (let x=0; x<lastpeople.length;x++) {
    ctx.save();
    ctx.translate(lastpeople[x].xPosition,lastpeople[x].yPosition);
    ctx.rotate(lastpeople[x].barrelAngle-(Math.PI/2));
    barrel.rect(-3,-3,6,40);
    ctx.fillStyle = 'gray';
    ctx.fill(barrel);
    ctx.restore();
    ctx.fillStyle = lastpeople[x].color;
    circle.arc(lastpeople[x].xPosition,lastpeople[x].yPosition,20,0,Math.PI*2,true);
    ctx.fill(circle);
  }
}

socket.on('disconnect',()=>{
  console.log('DISCONNECTED');
});