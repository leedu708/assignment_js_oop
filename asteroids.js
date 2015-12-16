var model = {

  init: function(width, height, asteroidCount) {
    model.setCanvasSize(width, height);

    model.player = new model.Player();
    model.initPlayerMethods();

    for (var i = 0; i < asteroidCount; i++) {
      var asteroid = new model.Asteroid(model.initAsteroidAtts());
    };

    model.initAsteroidMethods();
  },

  player: null,
  asteroids: [],
  nextAsteroidID: 0,

  Player: function() {
    this.x = Math.floor(model.width / 2);
    this.y = Math.floor(model.height / 2);
    this.velX = 0;
    this.velY = 0;
    this.heading = 0;
  },

  initPlayerMethods: function() {
    model.Player.prototype.turnLeft = function() {
      model.player.heading--;
      console.log(model.player.heading);
    };
  },

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

  setCanvasSize: function(width, height) {
    model.width = width;
    model.height = height;
  },

  initAsteroidAtts: function(x, y, velX, velY, radius) {
    var atts = {
      id: model.asteroids.length,
      x: (x) ? x : model.randNum(0, model.width),
      y: (y) ? y : model.randNum(0, model.height),
      velX: (velX) ? velX : model.randNum(-2, 2),
      velY: (velY) ? velY : model.randNum(-2, 2),
      radius: (radius) ? radius: model.randNum(10, 25)
    };

    return atts;
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
      var offsets = [[-1, -1], [1, 1], [-1, 1], [1, -1]];
      for (var i = 0; i <= spawns; i++) {
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

  tic: function() {
    model.checkCollisions();

    $.each(model.asteroids, function(i, asteroid) {
      asteroid.tic();
    });

    model.ticCleanUp();
  },

  ticCleanUp: function() {
    model.asteroids = $.map(model.asteroids, function(asteroid) {
      if (asteroid) {
        return asteroid;
      };
    });
  },

  checkCollisions: function() {
    $.each(model.asteroids, function(i, asteroid) {
      asteroid.asteroidCollisions();
    });
  },

  userInput: function() {
    switch(even.which) {
      case 37:
        model.player.turnLeft();
        break;
      case 39:
        break;
      case 38:
        break;
    };
  },

  getPlayer: function() {
    return model.player;
  },

  getAsteroids: function() {
    return model.asteroids;
  },

  randNum: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

var view = {

  init: function(width, height, player, asteroids) {
    view.$canvas = $('#screen');
    view.context = view.$canvas[0].getContext('2d');
    view.setCanvasSize(width, height);
    view.renderTic(player, asteroids);
    $('.start-button').on('click', controller.start);
  },

  setCanvasSize: function(width, height) {
    view.$canvas.attr('width', width + 'px');
    view.$canvas.attr('height', height + 'px');
  },

  renderTic: function(player, asteroids) {
    view.context.clearRect(0, 0, view.$canvas.width(), view.$canvas.height());
    view.renderPlayer(player);
    $.each(asteroids, view.renderAsteroid);
  },

  renderAsteroid: function(index, asteroid) {
    view.context.beginPath();
    view.context.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2, false);
    view.context.closePath();
    view.context.strokeStyle = "#000";
    view.context.stroke();
  },

  renderPlayer: function(player) {
    view.context.beginPath();
    view.context.moveTo(player.x, player.y - 15);
    view.context.lineTo(player.x - 10, player.y + 15);
    view.context.lineTo(player.x + 10, player.y + 15);
    view.context.closePath();
    view.context.rotate(player.heading * Math.PI / 180);
    view.context.strokeStyle = "#000";
    view.context.stroke();
  },

  activateControls: function() {
    $(window).on('keydown', model.userInput);
  }

}

var controller = {

  init: function(width, height, asteroidCount) {
    model.init(width, height, asteroidCount);
    view.init(width, height, model.getPlayer(), model.getAsteroids());
  },

  tic: function() {
    model.tic();
    view.renderTic(model.getPlayer(), model.getAsteroids());
  },

  start: function() {
    $('button').attr('disabled', true).off('click');
    view.activateControls();
    controller.interval = setInterval(controller.tic, 5);
  }

}

$(document).ready( function() {
  controller.init(640, 480, 30);
})