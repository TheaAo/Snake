/*
* @Author: Administrator
* @Date:   2017-03-16 15:58:19
* @Last Modified by:   Administrator
* @Last Modified time: 2017-03-17 10:59:25
*/

'use strict';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

// 以 10*10 像素的网格划分画布
const BLOCKSIZE = 10;
var widthInBlock = width / BLOCKSIZE;
var heightInBlock = height / BLOCKSIZE;

// 初始化分数
var score = 0;

// 绘制边框
var drawBorder = function(){
  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, width, BLOCKSIZE);
  ctx.fillRect(width - BLOCKSIZE, 0, BLOCKSIZE, height);
  ctx.fillRect(0, 0, BLOCKSIZE, height);
  ctx.fillRect(0, height - BLOCKSIZE, width, BLOCKSIZE);
};

// 绘制分数
var drawScore = function(){
  ctx.font = "20px Courier";
  ctx.fillStyle = "black";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, BLOCKSIZE, BLOCKSIZE);
};

// 结束游戏
var gameOver = function(){
  clearInterval(intervalId);
  ctx.font = "60px Courier"
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("GAME OVER", width / 2, height / 2);
};

// 构造块对象
var Block = function(col, row){
  this.row = row;
  this.col = col;
};
Block.prototype.drawSquare = function(color){
  var x = this.col * BLOCKSIZE;
  var y = this.row * BLOCKSIZE;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, BLOCKSIZE, BLOCKSIZE);
};
Block.prototype.drawCircle = function(color){
  var x = (this.col + 0.5) * BLOCKSIZE;
  var y = (this.row + 0.5) * BLOCKSIZE;
  var r = BLOCKSIZE / 2;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.fill();
};
// 判断位置是否重合
Block.prototype.equal = function(anotherBlock){
  return this.col == anotherBlock.col && this.row == anotherBlock.row;
};

// 贪吃蛇构造函数
var Snake = function(color){
  this.color = color;
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
    gameOver();
    return;
  }

  this.segment.unshift(newHead);
  if (newHead.equal(apple.position)) {
    score++;
    apple.move();
  }
  else {
    this.segment.pop();
  }
};
Snake.prototype.checkCollision = function(head){
  var topCollision = (head.row == 0);
  var rightCollision = (head.col == widthInBlock - 1);
  var bottomCollision = (head.row == heightInBlock - 1);
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
  this.position = new Block(10,10);
};
Apple.prototype.draw = function(){
  this.position.drawCircle("LimeGreen");
};
Apple.prototype.move = function(){
  
  var randomCol = Math.floor(Math.random() * (widthInBlock - 2) + 1);
  var randomRow = Math.floor(Math.random() * (heightInBlock - 2) + 1);
  this.position = new Block(randomCol, randomRow);

  for (var i = 0; i < snake.length; i++) {
    if(this.position.equal(snake.segment[i])){
      this.move();
    }
  }
};

var snake = new Snake();
var apple = new Apple();

var intervalId = setInterval(function(){
  ctx.clearRect(0, 0, width, height);

  drawScore();
  snake.draw();
  snake.move();
  apple.draw();
  drawBorder();

},200);

var directions = {
  37: "left",
  38: "up",
  39: "right",
  40: "down"
}
// 绑定键盘事件
$("body").keydown(function(event){
  var newDirection = directions[event.keyCode];
  if (newDirection != undefined) {
    snake.setDirection(newDirection);
  }
});