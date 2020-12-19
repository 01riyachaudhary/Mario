var mario,marioImage,marioCollidedImage;
var bg,bgImage;
var ground,groundImage
var obs1,obs2,obs3,obs4;
var brickImage;
var bricksGroup, obstaclesGroup;
var score = 0;
var gameOver,gameOverImage;
var restart,restartImage;
var checkSound,dieSound,jumpSound;
var highScore=0;
var timer=0;

gameState = 'play';


function preload() {
  
  //loading all the images
  bgImage = loadImage("bg.png");
  marioImage = loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png") 
  groundImage = loadImage("ground2.png");
  
  marioCollidedImage = loadImage("collided.png");
  obstacleImage = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
   
  brickImage = loadImage("brick.png");
  restartImage = loadImage("restart.png");
  gameOverImage = loadImage("gameOver.png");
  
  //load Sounds
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
  checkSound = loadSound("checkPoint.mp3");

}


function setup() {
  createCanvas(600,400);
  
  //creating Ground
  ground = createSprite (300,360,600,400);
  ground.addImage(groundImage);
  ground.velocityX = -6;
  
  //creating Mario
  mario = createSprite(50,300,10,10);
  mario.addAnimation("running",marioImage);
  mario.addAnimation("collided",marioCollidedImage  );

  // debugging Mario 
  //mario.debug=true;  
  
  //creating Restart sprite
  restart = createSprite(300,260);
  restart.addImage(restartImage);
  restart.visible = false;
  restart.scale=0.5;
  
  //creating GameOver sprite 
  gameOver = createSprite(300,200);
  gameOver.addImage(gameOverImage);
  gameOver.visible = false;
  gameOver.scale=0.5
  
  //creating Groups of bricks & obstacles
  bricksGroup = createGroup();
  obstaclesGroup = createGroup();
  
}

function draw(){
  background(bgImage);
 
    
  if (gameState === "play") {
    
      //making ground velocity increase with score    
      ground.velocityX = -(6 + score/10);
 
      //resetting the ground
      if (ground.x<0){
                ground.x = ground.width/2
          }
  
      //Making Mario jump
      if (keyDown("space") && mario.y>300){
        mario.velocityY = -15  ;
        jumpSound.play();      
      }
  
      //console.log(mario.y)

      //Adding gravity to Mario
      mario.velocityY = mario.velocityY + 0.8;

      if (score%10 ===0 && score>0){
        //play the checkpoint sound after every 10 points
        checkSound.play();

      }

      //spawining obstacles & bricks
      spawnObstacles();
      spawnBricks();
      
      //increment time
      timer = timer + 1;
    
       
      //destroy the brick which touched Mario
        
      for (var i = 0; i < bricksGroup.length; i++) {
      if (bricksGroup.get(i).isTouching(mario)) {
        bricksGroup.get(i).destroy()
        score++;

      }
    }
          
      // checking for collision of mario with obstacles
      if (obstaclesGroup.isTouching (mario)){
        
          dieSound.play();
          gameState = "end";
          bricksGroup.setLifetimeEach(-1);
          obstaclesGroup.setLifetimeEach(-1);
          mario.velocityY=0; 
          ground.velocityX=0;
          bricksGroup.setVelocityXEach(0);
          obstaclesGroup.setVelocityXEach(0);
       
          mario.changeAnimation("collided",marioCollidedImage);
    
          gameOver.visible = true;
          restart.visible = true;
        
          
        }
  }
  else if (gameState === "end") {
    
      console.log(gameState);
          
      //restart when mouse pressed over restart button
      if(mousePressedOver(restart)) {
        
        gameState = "play";
        gameOver.visible = false;
        restart.visible = false;
        bricksGroup.destroyEach();
        obstaclesGroup.destroyEach();
        mario.changeAnimation("running",marioImage);
       //resetting the highScore
          if(score>highScore){
            highScore = score;
          }
        
        //resetting score & timer
        score=0;
        timer=0; 
  
      }
                          
 
    
  }
  
  mario.collide(ground);
  
  drawSprites();
  
  //displaying score, high score, timer
  stroke(6);               
  text("Score :  "+score, 500,20);
  text("Highest Score :  "+highScore, 250,20);
  text("Timer :  "+timer, 100,20)
  
  
}

//function to spawn obstacles        
function spawnObstacles(){
  
  if (frameCount%60===0) {

      var obstacle = createSprite(600,305,10,10);
      obstacle.addAnimation("moving",obstacleImage);
      obstacle.scale=0.7;
      obstacle.velocityX=- (6 + score/10);
      obstacle.lifetime=100;
      obstaclesGroup.add(obstacle);         
    
  }
  
}

//Function to spawn bricks
  function spawnBricks(){
      if (frameCount%50===0) {

          var brick = createSprite(600,Math.round(random(150,230)),10,10);
          brick.addImage(brickImage);
          brick.velocityX= -3;
          brick.lifetime=210;
  
          bricksGroup.add(brick);    
      }
    
  }
