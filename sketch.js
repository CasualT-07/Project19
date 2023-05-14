var towerImg, tower;
var doorImg, door, doorsGroup;
var climberImg, climber, climbersGroup;
var ghost, ghostImg;
var invisibleBlockGroup, invisibleBlock;
var gameState = "play"
var score

function preload(){
  towerImg = loadImage("tower.png");
  doorImg = loadImage("door.png");
  climberImg = loadImage("climber.png");
  ghostImg = loadAnimation("ghost-standing.png");
  ghostJumpingImg = loadAnimation("ghost-jumping.png");
  spookySound = loadSound("spooky.wav");
}

function setup() {
  createCanvas(600, 600);
  spookySound.loop();

  score = 0;

  //create tower
  tower = createSprite(300,300);
  tower.addImage("tower",towerImg);
  tower.velocityY = 3;

  //create ghost
  ghost = createSprite(300,300);
  ghost.addAnimation("ghostStanding",ghostImg);
  //ghost.debug = true;
  ghost.setCollider("rectangle",-15,0,ghost.width-150,ghost.height)
  ghost.scale = 0.3;

  //create Groups
  doorsGroup = new Group();
  climbersGroup = new Group();
  invisibleBlockGroup = new Group();

  //create borders
  top_edge = createSprite(300,-50,600,5);
  top_edge.visible = false;

  left_edge = createSprite(60,300,5,600);
  left_edge.visible = false;

  right_edge = createSprite(540,300,5,600);
  right_edge.visible = false;
}

function draw() {
  background(200);
  drawSprites();

  if(gameState == "play") {

    //background
    if(tower.y > 400){
      tower.y = 300
    }

    //score
    score = Math.round(frameCount/5);

    //ghost gravity
    ghost.velocityY += 0.8;

    //ghost collision
    ghost.collide(climbersGroup);
    ghost.collide(top_edge);
    ghost.collide(left_edge);
    ghost.collide(right_edge);

    //controls
    if(keyDown("space") || keyDown("up_arrow") || keyDown("w")) {
      ghost.velocityY = -12;
      //ghost.changeAnimation("ghostJumping",ghostJumpingImg);
    }
    if(keyDown("left_arrow") || keyDown("a")) {
      ghost.x -= 5;
      if(ghost.mirrorX() == -1) {
        ghost.mirrorX(1);
      }
    }
    if(keyDown("right_arrow") || keyDown("d")) {
      ghost.x += 5;
      if(ghost.mirrorX() == 1) {
        ghost.mirrorX(-1);
      }
    }

    //create platforms
    if(frameCount % 120 == 0) {
      spawnDoors();
    }
    
    //change to end state
    if(ghost.y > 600) {
      gameState = "end";          
    }

  }

  if(gameState === "end") {
    ghost.destroy();
    tower.velocityY = 0;
    climbersGroup.setVelocityYEach(0);
    doorsGroup.setVelocityYEach(0);
    fill("pink");
    textAlign(CENTER);
    textSize(50);
    stroke("black");
    text("Game Over!",width/2,height/2);
  }

  fill("white");
  stroke("black");
  textSize(15);
  text("Score: "+score,80,25);
  
}

function spawnDoors() {
  rand = random(130,470);

  door = createSprite(rand,-100);
  door.addImage(doorImg);
  door.velocityY = tower.velocityY;
  ghost.depth = door.depth+1;
  doorsGroup.add(door);

  climber = createSprite(door.x,door.y+70);
  climber.addImage(climberImg);
  climber.velocityY = tower.velocityY;
  //climber.debug = true;
  climber.setCollider("rectangle",0,-5,climber.width,climber.height/2)
  climbersGroup.add(climber);

}
