let player;
let bullets = [];
let enemy;
let timer;
let patternCD = false;

function setup() {
  createCanvas(600, 900);
  colorMode(HSB);
  timer = millis();
  
  player = new Player()
  enemy = new Enemy(100, createVector(width/2, 100), 2, 4000)

  bullets.push(new Bullet(50, createVector(enemy.pos.x, enemy.pos.y), createVector(player.pos.x - enemy.pos.x, player.pos.y - enemy.pos.y), 3));
}

function draw() {
  background(220);
  player.updatePlayerPosition();
  
  enemy.show();
  for(let bullet of bullets){
    bullet.updateBulletPosition();
    bullet.show();
  }
  player.show();
  
  if((millis() - timer >= 1000) && !patternCD){
    enemy.pattern1();
    print("done");
    console.log(bullets);
    patternCD = true;
    timer = millis();
  }
  
  if((millis() - timer >= 4000) && patternCD){
    patternCD = false;
    timer = millis();
  }
}

class Player {
  constructor(){
    this.vel = createVector(0, 0);
    this.pos = createVector(width / 2, height / 2);
    this.size = 20;
    this.focusedVel = createVector(0, 0);
    this.lives = 3;
    this.isInvuln = false;
    this.timer = 0;
  }
  
  clone(){
    return new Player();
  }
  
  updatePlayerPosition() {
    let mouseVec = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(mouseVec, this.pos);
    dir.setMag(4);
    let prevPosX = this.pos.x;
    let prevPosY = this.pos.y;
  
    this.pos.add(dir);
  
    if((prevPosX < mouseX && this.pos.x > mouseX) || (prevPosX > mouseX && this.pos.x < mouseX)){
      this.pos.x = mouseX;
    }
    if((prevPosY < mouseY && this.pos.y > mouseY) || (prevPosY > mouseY && this.pos.y < mouseY)){
      this.pos.y = mouseY;
    }
    
    this.checkForBullet();
    
    if(millis() - this.timer >= 1000){
      this.isInvuln = false;
    }
  }
  
  checkForBullet(){
    for(let bullet of bullets){
      if(!this.isInvuln && (dist(this.pos.x, this.pos.y, bullet.pos.x, bullet.pos.y) <= (this.size + bullet.size)/4)){
        this.lives--;
        this.isInvuln = true;
        this.timer = millis();
      }
    }
  }
  
  show(){
    fill(255,100,100);
    circle(this.pos.x, this.pos.y, this.size);
    textSize(40);
    text("Lives: " + this.lives, 10, 50);
  }
}

class Enemy {
  constructor(size, pos, speed, health){
    this.size = size;
    this.pos = pos;
    this.speed = speed;
    this.health = health;
  }
  
  pattern1(){
    for(let i = 0; i < 12; i++){
      bullets.push(new Bullet(20, createVector(this.pos.x, this.pos.y), createVector(width/2-i*(width/10), height), 3))
    }
    print("done2")
    console.log(bullets)
  }
  
  show(){
    fill(100,255,100);
    circle(this.pos.x, this.pos.y, this.size)
  }
}

class Bullet {
  constructor(size, pos, vel, speed){
    this.size = size;
    this.pos = pos;
    this.vel = vel;
    this.speed = speed;
  }
  
  updateBulletPosition(){
    this.vel.setMag(this.speed);
    if(mouseIsPressed){
      this.vel.setMag(1);
    }
    
    this.pos.add(this.vel);
  }
  
  show(){
    fill(200,100,100);
    circle(this.pos.x, this.pos.y, this.size);
  }
}