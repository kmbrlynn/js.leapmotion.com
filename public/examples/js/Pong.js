// Pong for the Leap with Paper.js animation framework (http://paperjs.org/)
// By @kmbrlynn

// ======================================== Gameplay
 
// window dimensions
var width = window.innerWidth; 
var height = window.innerHeight;

// scoreboard
var score = 0; 
var scoreboard = new PointText(new Point(width/2, height/3));
scoreboard.justification = 'center';
scoreboard.fillColor = 'rgb(200, 200, 200)';
scoreboard.fontSize = width/6;  

// lives
var life = 3;
var lives = new PointText(new Point(width/2, 0.66*height));
lives.justification = 'center';
lives.fillColor = 'rgb(200, 200, 200)';
lives.fontSize = width/6;  

// paddle
var rectWidth = width/10; 
var rectHeight = height/30;
var point = new Point(width/2, height);
var size = new Size(rectWidth, rectHeight);
var rect = new Path.Rectangle(point, size);
rect.fillColor = 'black';

// ball
var radius = height/60; 
var ballXSpeed; 
var ballYSpeed; 
ballXSpeed = 1; 
ballYSpeed = 1; 
var ball = new Path.Circle(new Point(Math.floor((Math.random()*width-radius)+radius), radius), radius);
ball.fillColor = 'black';

// move bar with the mouse
function onMouseMove(event) {
    rect.position = event.point;
    rect.position.y = height - 3*rectHeight; //restrict vertical
}

// set ball in motion
function onFrame(event) {

    ball.position.x = ball.position.x + 5 * ballXSpeed; 
    ball.position.y = ball.position.y + 5 * ballYSpeed;

    // tally points
    scoreboard.content = score + ' points';
    if (score == 1) {
        scoreboard.content = score + ' point';
    }
    // lives left
    lives.content = life + ' lives';
    if (life == 1) {
        lives.content = life + ' life';
    }
    // game over
    if (life < 0) {
        lives.content = 'GAME OVER';
        ballXSpeed = 0; 
        ballYSpeed = 0;  
    }
    // bounce off side walls
    if ((ball.position.x > width - radius) || (ball.position.x < radius)) {
        ballXSpeed *= -1; 
    } 
    // bounce off ceiling
    if (ball.position.y < radius) {
        ballYSpeed *= -1; 
        ballXSpeed += 0.1; //faster and faster 
        ballYSpeed += 0.1; 
    }
    // miss the paddle and reset
    if (ball.position.y + radius > rect.position.y) {
        if (!(ball.bounds.intersects(rect.bounds))) {
            ball.position.x = Math.floor((Math.random()*width-radius)+radius); 
            ball.position.y = radius; 
            life -= 1; 
            }
    }
    // hit the paddle
    if (ball.bounds.intersects(rect.bounds)) {
        ballYSpeed *= -1;
        score += 1; 
    } 
}

// ======================================== Leap Motion 

// Thanks to @keanw (http://through-the-interface.typepad.com/)
// for giving us some great examples!  

if (typeof Leap !== "undefined") { //start loop only if Leap library is available
    Leap.loop(function (frame) {
        if (frame.hands.length > 0) {
          var hand = frame.hands[0]; // just one hand
          rect.position = new Point(hand.palmPosition[0] * 4 + view.size.width / 2,
                                   height - 3*rectHeight); //restricts y-value
                                                            //so as not to overrun the ball
                                   //hand.palmPosition[2] * 0.5 + 0.8*view.size.height);
                                   
        }
      })
    }

