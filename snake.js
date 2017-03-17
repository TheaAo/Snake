/*
* @Author: Administrator
* @Date:   2017-03-16 15:58:19
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-17 14:54:24
*/

'use strict';
const BLOCKSIZE = 10;

var Game = function(){
  this.isStop;
  this.isOver;
  this.intervalId;
  this.score;
  this.canvas;
  this.ctx;
  this.width;
  this.height
  this.widthInBlock;
  this.heightInBlock;
  this.speed;
};
Game.prototype.init = function(){
  this.canvas = document.getElementById("canvas");
  this.ctx = this.canvas.getContext("2d");
  this.width = this.canvas.width;
  this.height = this.canvas.height;
  this.speed = 200;

  // 以 10*10 像素的网格划分画布
  this.widthInBlock = this.width / BLOCKSIZE;
  this.heightInBlock = this.height / BLOCKSIZE;

  // 初始化分数和游戏状态
  this.score = 0;
  this.isStop = false;
  this.isOver = false;
  this.intervalId = null;

  // 绘制边框和分数
  this.drawBorder();
  this.drawScore();
  $("button").css("display","none");

};
Game.prototype.drawBorder = function(){
    this.ctx.fillStyle = "grey";
    this.ctx.fillRect(0, 0, this.width, BLOCKSIZE);
    this.ctx.fillRect(this.width - BLOCKSIZE, 0, BLOCKSIZE, this.height);
    this.ctx.fillRect(0, 0, BLOCKSIZE, this.height);
    this.ctx.fillRect(0, this.height - BLOCKSIZE, this.width, BLOCKSIZE);
  };
Game.prototype.drawScore = function(){
    this.ctx.font = "20px Courier";
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";
    this.ctx.fillText("Score: " + this.score, BLOCKSIZE, BLOCKSIZE);
  };
Game.prototype.start = function(speed){
  this.intervalId = setInterval(function(){

    game.ctx.clearRect(0, 0, game.width, game.height);
    game.drawScore();
    snake.draw();
    snake.move();
    apple.draw();
    game.drawBorder();

    },speed);
};
Game.prototype.stop = function(){
  clearInterval(this.intervalId);
};
Game.prototype.over = function(){
  this.stop();
  this.ctx.font = "60px Courier"
  this.ctx.fillStyle = "black";
  this.ctx.textAlign = "center";
  this.ctx.textBaseline = "middle";
  this.ctx.fillText("GAME OVER", this.width / 2, this.height / 2);
  this.isOver = true;
  $("button").css("display","inline-block");
};

// 构造块对象
var Block = function(col, row){
  this.row = row;
  this.col = col;
};
Block.prototype.drawSquare = function(color){
  var x = this.col * BLOCKSIZE;
  var y = this.row * BLOCKSIZE;
  game.ctx.fillStyle = color;
  game.ctx.fillRect(x, y, BLOCKSIZE, BLOCKSIZE);
};
Block.prototype.drawCircle = function(color){
  var x = (this.col + 0.5) * BLOCKSIZE;
  var y = (this.row + 0.5) * BLOCKSIZE;
  var r = BLOCKSIZE / 2;
  game.ctx.fillStyle = color;
  game.ctx.beginPath();
  game.ctx.arc(x, y, r, 0, Math.PI * 2, false);
  game.ctx.fill();
};
// 判断位置是否重合
Block.prototype.equal = function(anotherBlock){
  return this.col == anotherBlock.col && this.row == anotherBlock.row;
};

// 贪吃蛇构造函数
var Snake = function(){
  this.segment;
  this.direction;
  this.nextDirection;
};
Snake.prototype.init = function(){
  this.segment = [
    new Block(8,5),
    new Block(7,5),
    new Block(6,5),
  ];
  this.direction = "right";
  this.nextDirection = "right";
};
Snake.prototype.draw = function(){
  for (var i = 0; i < this.segment.length; i++) {
    this.segment[i].drawSquare("lightBlue");
  }
};
Snake.prototype.move = function(){
  var head = this.segment[0];
  var newHead;

  this.direction = this.nextDirection;

  if (this.direction == "right") {
    newHead = new Block(head.col + 1,head.row);
  }
  else if (this.direction == "left") {
    newHead = new Block(head.col - 1,head.row);
  }
  else if (this.direction == "up") {
    newHead = new Block(head.col, head.row - 1);
  }
  else if (this.direction == "down") {
    newHead = new Block(head.col, head.row + 1);
  }

  if (this.checkCollision(newHead)) {
    game.over();
    return;
  }

  this.segment.unshift(newHead);
  if (newHead.equal(apple.position)) {
    game.score++;
    apple.move();
  }
  else {
    this.segment.pop();
  }
};
Snake.prototype.checkCollision = function(head){
  var topCollision = (head.row == 0);
  var rightCollision = (head.col == game.widthInBlock - 1);
  var bottomCollision = (head.row == game.heightInBlock - 1);
  var leftCollision = (head.col == 0);

  var wallCollision = topCollision || rightCollision || bottomCollision || leftCollision;

  var selfCollision = false;

  for (var i = 0; i < this.segment.length; i++) {
    if (head.equal(this.segment[i])) {
      selfCollision = true;
    }
  }

  return wallCollision || selfCollision;
};
Snake.prototype.setDirection = function(newDirection){
  if (this.direction == "right" && newDirection == "left") {
    return;
  }
  else if (this.direction == "left" && newDirection == "right") {
    return;
  }
  else if (this.direction == "up" && newDirection == "down") {
    return;
  }
  else if (this.direction == "down" && newDirection == "up") {
    return;
  }

  this.nextDirection = newDirection;
};

// 创建苹果
var Apple = function() {
  this.position;
};
Apple.prototype.init = function(){
  this.position = new Block(10,10);
};
Apple.prototype.draw = function(){
  this.position.drawCircle("LimeGreen");
};
Apple.prototype.move = function(){
  
  var randomCol = Math.floor(Math.random() * (game.widthInBlock - 2) + 1);
  var randomRow = Math.floor(Math.random() * (game.heightInBlock - 2) + 1);
  this.position = new Block(randomCol, randomRow);

  //检测刷新位置
  for (var i = 0; i < snake.length; i++) {
    if(this.position.equal(snake.segment[i])){
      this.move();
    }
  }
};

var snake = new Snake();
var apple = new Apple();
var game = new Game();

snake.init();
apple.init();
game.init();
game.start(game.speed);

var directions = {
  32: "space",
  37: "left",
  38: "up",
  39: "right",
  40: "down"
}
// 绑定键盘事件
$("body").keydown(function(event){
  var newDirection = directions[event.keyCode];
  if (newDirection != undefined) {
    if (newDirection != "space") {
      snake.setDirection(newDirection);
    }
    else {
      if (game.isStop) {
        game.start();
      }
      else {
        game.stop();
      }
      game.isStop = !game.isStop;
    }
  }
});
// 绑定按钮事件
$("button").click(function(){
  snake.init();
  apple.init();
  game.init();
  game.start(game.speed);
});