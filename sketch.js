var bg,bgImg;
var player, shooterImg, shooter_shooting;
var zombie, zombieImg;

var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;

var explosionSound, loseSound, winSound, bgSound;

var live=3;
var score=0;
var bullets=60;
var gameState="fight";

var zombieGroup, bulletGroup;

function preload(){
  
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

 // shooterImg = loadAnimation("assets/shooter_1.png","assets/shooter_2.png")
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  zombieImg = loadImage("assets/zombie.png")

  bgImg = loadImage("assets/bg.jpeg")

  // add remaining images/sounds 
  explosionSound=loadSound("assets/explosion.mp3");
  loseSound=loadSound("assets/lose.mp3");
  winSound=loadSound("assets/win.mp3");
  bgSound=loadSound("assets/bg.wav");
}

function setup() {

  createCanvas(windowWidth,windowHeight);

  bgSound.loop();

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
    player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
    player.addImage(shooterImg)
    player.scale = 0.3
    player.debug = false;
    player.setCollider("rectangle",0,0,300,300)


   //creating sprites to depict lives remaining
    heart1 = createSprite(displayWidth-150,40,20,20)
    heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4
   
    //creating group for zombies    
    zombieGroup = new Group();

    //add a bullets group 
    bulletGroup=new Group();
}

function draw() {
  background(0); 

  if(gameState="fight"){

   //To add lives here. Write the code for if(live==3/2/1) respectively{}  
  if(live==2){
    heart2.visible=true;
    heart3.visible=false; 
    heart1.visible=false;
  }

  if(live==1){
    heart2.visible=false;
    heart3.visible=false;
    heart1.visible=true;
  }

  //if live becomes 0, the gameState should become lost.
  if (live==0){
    gameState="lost";
  } 
  //the gameState should be converted won when the score reaches 100. 

  if(score==100){
    gameState="won";
  }

  if(bullets==0){
    gameState="bullet";
    live=live-1;
  }

  //gamestates can be fight, bullet, lost, won

  //moving the player up and down and making the game mobile compatible using touches
if(keyDown("UP_ARROW")||touches.length>0){ //touches is an array that automatically captures the x and y coordinates of the point where the player will tap on the mobile screen 
  player.y = player.y-30
}
if(keyDown("DOWN_ARROW")||touches.length>0){
 player.y = player.y+30
}

//release bullets and change the image of shooter to shooting position when space is pressed
if(keyWentDown("space")){

  bullet=createSprite(displayWidth-1150, player.y-30, 20, 10);
  bullet.velocityX=30;
  bulletGroup.add(bullet);
  bullets=bullets-1;

  player.depth=bullet.depth;
  player.depth=player.depth+2;

  player.addImage(shooter_shooting);
  
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//destroy zombie when player touches it
if(zombieGroup.isTouching(player)){
 
 for(var i=0;i<zombieGroup.length;i++){     
      //i is the index number and zombie group[i] denotes the zombie at i th index of the zombie group
        if(zombieGroup[i].isTouching(player)){ 
       zombieGroup[i].destroy()

       live=live-1;
       } 
 }
}

if(zombieGroup.isTouching(bulletGroup)){

for(var i=0; i<zombieGroup.length;i++){

  if(zombieGroup.isTouching(bulletGroup)){
  zombieGroup[i].destroy();
  bulletGroup.destroyEach();

  explosionSound.play();
  score=score+2;
  }

}
}

//calling the function to spawn zombies
enemy();

} //code for gameState="fight", ends here. 
drawSprites();

textSize(30);
fill("white");
text("Score="+score, windowWidth-700, windowHeight-550);

//add text for bullets=, score=, live= 
textSize(20);

if(gameState=="bullet"){

  //destroy the zombie group, bullet group and the player and a message needs to be displayed, "you ran out of bullets"
  zombieGroup.destroyEach();
  bulletGroup.destroyEach();
  player.destroy();

  textSize(20);
  text("You ran out of bullets", windowWidth-700, windowHeight-200);

} //gameState=="bullet", ends here. 

if(gameState=="lost"){
  //destroy the zombie group and the player and a message needs to be displayed, "you lost"
  zombieGroup.destroyEach();
  player.destroy();
  loseSound.play();

  textSize(25);
  text("You lost :(", windowWidth-700, windowHeight-500);
} //code for gameState=="lost", ends here. 

if(gameState=="won"){
  //destroy the zombie group and the player and a message needs to be displayed, "you won"
  zombieGroup.destroyEach();
  player.destroy();
  winSound.play();

  textSize(20);
  text("You won :)", windowWidth-700, windowHeight-500);

}//code for gameState=="won", ends here.
// = is for assignment and == is for comparision

} //function draw(){} ends here. 



//creating function to spawn zombies
function enemy(){
  if(frameCount%50===0){ /* if the framecount is a multiple of 50, that is after every 50th frame */

    //giving random x and y positions for zombie to appear
    zombie = createSprite(random(500,1100),random(100,500),40,40)

    zombie.addImage(zombieImg)
    zombie.scale = 0.15
    zombie.velocityX = -3
    zombie.debug= false;
    zombie.setCollider("rectangle",0,0,850,850)
   
    zombie.lifetime = 400
   zombieGroup.add(zombie)
  }

}