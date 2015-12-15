function AsteroidConstructor(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
}

AsteroidConstructor.prototype.tic = function() {
  this.x += this.velX;
  this.y += this.velY;
}

function SecondConstructor(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.tic = function() {
    this.x += this.velX;
    this.y += this.velY;
  }
}

function Benchmark() {
  var startTime = new Date();

  function randNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (var i = 0; i < 5000; i ++) {
    var a = new AsteroidConstructor( randNum(0, 600), randNum(0, 600), randNum(-50, 50), randNum(-50, 50));

    for (var j = 0; j < 5000; j++) {
      a.tic()
    };
  };

  var endTime = new Date();

  console.log(endTime.getTime() - startTime.getTime());
}

// prototypal inheritance is slower