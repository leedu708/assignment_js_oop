var model = {

  init: function(asteroidCount) {
    for (var i = 0; i < asteroidCount; i++) {
      var asteroid = new model.Asteroid(model.randomAttributes());
    };

    model.Asteroid.prototype.tic = function() {
      this.x += this.velX;
      this.y += this.velY;
    };
  },

  asteroids: [],

  Asteroid: function(atts) {
    this.x = atts.x;
    this.y = atts.y;
    this.velX = atts.velX;
    this.velY = atts.velY;
    this.radius = atts.radius;
    model.asteroids.push(this);
  },

  randomAttributes: function() {
    var atts = {
      x: model.randNum(0, 640),
      y: model.randNum(0, 480),
      velX: model.randNum(-25, 25),
      velY: model.randNum(-25, 25),
      radius: model.randNum(10, 25)
    };

    return atts;
  },

  getAsteroids: function() {
    return model.asteroids;
  },

  tic: function() {
    $.each(model.asteroids, function(i, asteroid) {
      asteroid.tic();
    })
  },

  randNum: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

var view = {

  init: function(asteroids) {
    view.renderTic(asteroids)
  },

  renderTic: function(asteroids) {
    $.each(asteroids, view.renderAsteroid);
  },

  renderAsteroid: function() {
    var canvas = $('#screen')[0].getContext('2d');
    canvas.beginPath();
    canvas.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2, false);
    canvas.closePath();
    canvas.strokeStyle = "#000";
    canvas.stroke();
  }

}

var controller = {

  init: function(asteroidCount) {
    model.init(asteroidCount);
    view.init(model.getAsteroids());
    setTimeout(controller.tic, 2000);
  },

  tic: function() {
    model.tic();
    view.init(model.getAsteroids());
  }

}

$(document).ready( function() {
  controller.init(10);
})