var model = {

  init: function(width, height, asteroidCount) {
    model.resetGame();
    model.setCanvasSize(width, height);

    model.player = new model.Player();
    model.initPlayerMethods();

    for (var i = 0; i < asteroidCount; i++) {
      var asteroid = new model.Asteroid(model.initAsteroidAtts());
    };

    model.initAsteroidMethods();
    model.initBulletMethods();
  },

  // resets variables
  resetGame: function() {
    model.player = null;
    model.asteroids = [];
    model.nextAsteroidID = 0;
    model.bullets = [];
  },

  setCanvasSize: function(width, height) {
    model.width = width;
    model.height = height;
  },

  // player object, starts in the center
  Player: function() {
    this.x = Math.floor(model.width / 2);
    this.y = Math.floor(model.height / 2);
    this.velX = 0;
    this.velY = 0;
    this.heading = 0;
    this.cooldown = 0;
    this.destroyed = false;
  },

  initPlayerMethods: function() {

    model.Player.prototype.tic = function(inputs) {
      // stop moving if destroyed
      if (this.destroyed) {
        this.velX = 0;
        this.velY = 0;
      }

      else {
        // increment the inputs
        if (this.cooldown > 0) {
          this.cooldown--;
        };

        this.processInputs(inputs);
        this.x += this.velX;
        this.y += this.velY;
        this.wrapX();
        this.wrapY();
      };
    };

    // use appropriate method based on input
    model.Player.prototype.processInputs = function(inputs) {
      if (inputs.turningLeft) {
        this.turnLeft();
      };

      if (inputs.turningRight) {
        this.turnRight();
      };

      if (inputs.accelerating) {
        this.accelerate();
      };

      if (inputs.firing) {
        this.fire();
      };
    };

    model.Player.prototype.turnLeft = function() {
      model.player.heading -= 5;
    };

    model.Player.prototype.turnRight = function() {
      model.player.heading += 5;
    };

    model.Player.prototype.accelerate = function() {
      var angle = model.player.heading * Math.PI / 180;
      model.player.velX += 0.5 * Math.cos(angle);
      model.player.velY += 0.5 * Math.sin(angle);
    };

    model.Player.prototype.fire = function() {
      if (this.cooldown === 0) {
        var bullet = new model.Bullet();
        this.cooldown = 10;
      };
    };

    // if the player is moving a direction and moves off the canvas in that direction, wrap the player to the other side of the canvas
    // horizontal wrap
    model.Player.prototype.wrapX = function() {
      var offScreenRight = (this.x > model.width + (2 * 10));
      var movingRight = (this.velX > 0);
      var offScreenLeft = (this.x < (-2 * 10));
      var movingLeft = (this.velX < 0);

      if (offScreenRight && movingRight) {
        this.wrapToLeft();
      }

      else if (offScreenLeft && movingLeft) {
        this.wrapToRight();
      };
    };

    // vertical wrap
    model.Player.prototype.wrapY = function() {
      var offScreenBottom = (this.y > model.height + (2 * 10));
      var movingDown = (this.velY > 0);
      var offScreenTop = (this.y < (-2 * 10));
      var movingUp = (this.velY < 0);

      if (offScreenBottom && movingDown) {
        this.wrapToTop();
      }

      else if (offScreenTop && movingUp) {
        this.wrapToBottom();
      };
    };

    // instead of using just the width of the model, this allows the player heading to tip from the other side of the wrap
    model.Player.prototype.wrapToLeft = function() {
      this.x = -2 * 10;
    };

    model.Player.prototype.wrapToRight = function() {
      this.x = model.width + (2 * 10);
    };

    // vertical wrapping
    model.Player.prototype.wrapToTop = function() {
      this.y = -2 * 10;
    };

    model.Player.prototype.wrapToBottom = function() {
      this.y = model.height + (2 * 10);
    };

    // checks for player collision with asteroid
    model.Player.prototype.asteroidCollisions = function() {
      $.each(model.asteroids, function(index, asteroid) {
        if (model.player.collidesWith(asteroid)) {
          model.player.destroyed = true;
          asteroid.destroyed = true;
        };
      });
    };

    model.Player.prototype.collidesWith = function(asteroid) {
      var dx = this.x - asteroid.x;
      var dy = this.y - asteroid.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 10 + asteroid.radius) {
        return true;
      };
    };

    model.Player.prototype.destroy = function() {
      model.player = null;
    };

  },

  // asteroid object
  Asteroid: function(atts) {
    this.id = model.nextAsteroidID;
    model.nextAsteroidID++;

    this.x = atts.x;
    this.y = atts.y;
    this.velX = atts.velX;
    this.velY = atts.velY;
    this.radius = atts.radius;
    this.destroyed = false;
    model.asteroids.push(this);
  },

  initAsteroidAtts: function(x, y, velX, velY, radius) {
    var atts = {
      id: model.asteroids.length,
      x: (x) ? x : model.startSpawnZone(model.width),
      y: (y) ? y : model.startSpawnZone(model.height),
      velX: (velX) ? velX : model.randNum(-2, 2),
      velY: (velY) ? velY : model.randNum(-2, 2),
      radius: (radius) ? radius: model.randNum(10, 30)
    };

    return atts;
  },

  // makes sure that asteroids can't spawn on top of ship/center of the board
  startSpawnZone: function(range) {
    if (model.randNum(0, 1) === 0) {
      return model.randNum(0, range / 4)
    }

    else {
      return model.randNum(3 / 4 * range, range)
    };
  },

  initAsteroidMethods: function() {

    model.Asteroid.prototype.tic = function() {
      if (this.destroyed) {
        this.destroy()
      }

      else {
        this.x += this.velX;
        this.y += this.velY;
        this.wrapX();
        this.wrapY();
      };
    };

    model.Asteroid.prototype.wrapX = function() {
      var offScreenRight = (this.x > model.width + (2 * this.radius));
      var movingRight = (this.velX > 0);
      var offScreenLeft = (this.x < (-2 * this.radius));
      var movingLeft = (this.velX < 0);

      if (offScreenRight && movingRight) {
        this.wrapToLeft();
      }

      else if (offScreenLeft && movingLeft) {
        this.wrapToRight();
      };
    };

    model.Asteroid.prototype.wrapY = function() {
      var offScreenBottom = (this.y > model.height + (2 * this.radius));
      var movingDown = (this.velY > 0);
      var offScreenTop = (this.y < (-2 * this.radius));
      var movingUp = (this.velY < 0);

      if (offScreenBottom && movingDown) {
        this.wrapToTop();
      }

      else if (offScreenTop && movingUp) {
        this.wrapToBottom();
      };
    };

    model.Asteroid.prototype.wrapToLeft = function() {
      this.x = -2 * this.radius;
    };

    model.Asteroid.prototype.wrapToRight = function() {
      this.x = model.width + (2 * this.radius);
    };

    model.Asteroid.prototype.wrapToTop = function() {
      this.y = -2 * this.radius;
    };

    model.Asteroid.prototype.wrapToBottom = function() {
      this.y = model.height + (2 * this.radius);
    };

    model.Asteroid.prototype.asteroidCollisions = function() {
      var thisAsteroid = this;
      var otherAsteroids = $(model.asteroids).map(function(index, asteroid) {
        if (asteroid.id > thisAsteroid.id) {
          return asteroid;
        };
      });

      $.each(otherAsteroids, function(index, otherAsteroid) {
        if (thisAsteroid.collidesWith(otherAsteroid)) {
          thisAsteroid.destroyed = true;
          otherAsteroid.destroyed = true;
        };
      });
    };

    model.Asteroid.prototype.collidesWith = function(other) {
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.radius + other.radius) {
        return true;
      };
    };

    model.Asteroid.prototype.destroy = function() {
      var index = model.asteroids.indexOf(this);
      delete model.asteroids[index];

      if (this.radius > 12) {
        this.spawnChildren();
      };
    };

    model.Asteroid.prototype.spawnChildren = function() {
      var spawns = 1 + Math.floor(this.radius / 10);
      var spawnSize = Math.floor(this.radius / spawns);
      var offsets = [[-2, -2], [2, 2], [-2, 2], [2, -2]];
      for (var i = 0; i < spawns; i++) {
        console.log(offsets[i]);
        var newX = this.x + spawnSize * offsets[i][0];
        var newY = this.y + spawnSize * offsets[i][1];
        var newRadius = spawnSize + model.randNum(-2, 2);
        var newVelX = offsets[i][0] * model.randNum(0, 2);
        var newVelY = offsets[i][1] * model.randNum(0, 2);
        new model.Asteroid(model.initAsteroidAtts(newX, newY, newVelX, newVelY, newRadius));
      };
    };

  },

  // bullet object
  Bullet: function() {
    var angle = model.player.heading * Math.PI / 180;
    this.x = model.player.x;
    this.y = model.player.y;
    this.velX = 10 * Math.cos(angle);
    this.velY = 10 * Math.sin(angle);
    this.radius = 2;
    this.destroyed = false;
    model.bullets.push(this);
  },

  initBulletMethods: function() {

    model.Bullet.prototype.tic = function() {
      if (this.destroyed) {
        this.destroy();
      }

      else {
        this.x += this.velX;
        this.y += this.velY;
      };
    };

    model.Bullet.prototype.destroy = function() {
      var index = model.bullets.indexOf(this);
      delete model.bullets[index];
    };

    model.Bullet.prototype.asteroidCollisions = function() {
      var thisBullet = this;

      $.each(model.asteroids, function(index, asteroid) {
        if (thisBullet.collidesWith(asteroid)) {
          thisBullet.destroyed = true;
          asteroid.destroyed = true;
        };
      });
    };

    model.Bullet.prototype.collidesWith = function(asteroid) {
      var dx = this.x - asteroid.x;
      var dy = this.y - asteroid.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 10 + asteroid.radius) {
        return true;
      };
    };

  },

  tic: function(playerInputs) {
    model.checkCollisions();

    $.each(model.asteroids, function(i, asteroid) {
      asteroid.tic();
    });

    model.player.tic(playerInputs);

    $.each(model.bullets, function(index, bullet) {
      bullet.tic();
    });

    model.ticCleanUp();
  },

  ticCleanUp: function() {
    model.asteroids = $.map(model.asteroids, function(asteroid) {
      if (asteroid) {
        return asteroid;
      };
    });

    model.bullets = $.map(model.bullets, function(bullet) {
      if (bullet) {
        return bullet;
      };
    });
  },

  checkCollisions: function() {
    $.each(model.asteroids, function(i, asteroid) {
      asteroid.asteroidCollisions();
    });

    model.player.asteroidCollisions();

    $.each(model.bullets, function(index, bullet) {
      bullet.asteroidCollisions();
    });
  },

  userInput: function() {
    switch(event.which) {
      case 37:
        model.player.turnLeft();
        break;
      case 39:
        model.player.turnRight();
        break;
      case 38:
        model.player.accelerate();
        break;
      case 32:
        model.player.fire();
        break;
    };
  },

  getPlayer: function() {
    return model.player;
  },

  getAsteroids: function() {
    return model.asteroids;
  },

  getBullets: function() {
    return model.bullets;
  },

  randNum: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

var view = {

  init: function(width, height, player, asteroids) {
    $('.gameover').remove();
    view.$canvas = $('#screen');
    view.context = view.$canvas[0].getContext('2d');
    view.setCanvasSize(width, height);
    view.renderTic(player, asteroids);
    $('.start-button').text('Click to Start').on('click', controller.start);
  },

  setCanvasSize: function(width, height) {
    view.$canvas.attr('width', width + 'px');
    view.$canvas.attr('height', height + 'px');
  },

  renderTic: function(player, asteroids, bullets) {
    view.context.clearRect(0, 0, view.$canvas.width(), view.$canvas.height());
    view.renderPlayer(player);
    if (asteroids) {
      $.each(asteroids, view.renderAsteroid);
    };

    if (bullets) {
      $.each(bullets, view.renderBullet);
    }
  },

  renderAsteroid: function(index, asteroid) {
    view.context.beginPath();
    // x, y are center, radius = radius of circle, start and end arc in radians. use arc() to create circle
    view.context.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2, false);
    view.context.closePath();
    // color of circle
    view.context.strokeStyle = "#000";
    // actually draw the circle
    view.context.stroke();
  },

  renderPlayer: function(player, gameover) {
    // push current drawing state onto drawing state stack
    view.context.save();
    view.context.translate(player.x, player.y);
    // rotate the triangle based on a given angle (heading * PI / 180)
    // e.g. heading = 5 ==> 5 degrees
    view.context.rotate(player.heading * Math.PI / 180);
    // create triangle, h = 30; b = 20
    view.context.beginPath();
    // 15px up from center
    view.context.moveTo(15, 0);
    // bottom left of triangle
    view.context.lineTo(-15, +10);
    // bottom right of triangle
    view.context.lineTo(-15, -10);
    view.context.closePath();

    // changes color of player when game is over
    if (gameover) {
      view.context.strokeStyle = "#F00";
    }

    else {
      view.context.strokeStyle = "#000";
    };

    view.context.stroke();
    // pop top state on the stack
    view.context.restore();
  },

  renderBullet: function(index, bullet) {
    // similar to asteroid in creating a circle
    view.context.beginPath();
    view.context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2, false);
    view.context.closePath();
    view.context.strokeStyle = "#F00";
    view.context.stroke();
  },

  // activate listeners
  startControls: function() {
    $(window).on('keydown', controller.userInput);
    $(window).on('keyup', controller.userInputStop);
  },

  // turn off listeners
  stopControls: function() {
    $(window).off('keydown');
  },

  // render game over state
  renderGameOver: function(player) {
    view.renderPlayer(player, true);
    // changes message based on if player is destroyed or if model.asteroids is empty
    // empty model.asteroids is falsey
    if (!model.asteroids.length) {
      $('.button-container').append("<h2 class='gameover'>You Win!</h4>");
    }

    else {
      $('.button-container').append("<h2 class='gameover'>Game Over!</h4>");
    };

    $('button').attr('disabled', false).text('Play Again?');
    $('.start-button').on('click', controller.restart);
  }

}

var controller = {

  init: function(width, height, asteroidCount) {
    this.width = width;
    this.height = height;
    this.asteroidCount = asteroidCount;

    model.init(width, height, asteroidCount);
    view.init(width, height, model.getPlayer(), model.getAsteroids());
  },

  // default settings
  width: 640,
  height: 480,
  asteroidCount: 20,

  inputs: {
    accelerating: false,
    turningLeft: false,
    turningRight: false,
    firing: false
  },

  tic: function() {
    model.tic(controller.inputs);
    view.renderTic(model.getPlayer(), model.getAsteroids(), model.getBullets());
    controller.checkGameOver();
  },

  start: function() {
    $('button').attr('disabled', true).off('click');
    view.startControls();
    controller.interval = setInterval(controller.tic, 25);
  },

  userInput: function() {
    switch(event.which) {
      case 37:
        controller.inputs.turningLeft = true;
        break;
      case 39:
        controller.inputs.turningRight = true;
        break;
      case 38:
        controller.inputs.accelerating = true;
        break;
      case 32:
        controller.inputs.firing = true;
        break;
    };
  },

  // for smoothing inputs
  userInputStop: function() {
    switch(event.which) {
      case 37:
        controller.inputs.turningLeft = false;
        break;
      case 39:
        controller.inputs.turningRight = false;
        break;
      case 38:
        controller.inputs.accelerating = false;
        break;
      case 32:
        controller.inputs.firing = false;
        break;
    };
  },

  // game is over if player is destroyed or if model.asteroids is empty
  checkGameOver: function() {
    if (model.player.destroyed || !model.asteroids.length) {
      clearInterval(controller.interval);
      controller.endGame();
    };
  },

  endGame: function() {
    view.stopControls();
    view.renderGameOver(model.getPlayer());
  },

  restart: function() {
    console.log( 'controller.init');
    $('.play-button').off('click');
    controller.init(controller.width, controller.height, controller.asteroidCount)
  }

}

$(document).ready( function() {
  controller.init(640, 480, 20);
})