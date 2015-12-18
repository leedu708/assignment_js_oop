# assignment_js_oop

by Dustin Lee

Objectify! Construct! Prototype!  Win.
[A JavaScript project using objects, constructors and prototypes from the Viking Code School](http://www.vikingcodeschool.com)

[Play Here](https://htmlpreview.github.io/?https://github.com/leedu708/assignment_js_oop/blob/master/index.html)

##Overview

###Model:

  Variables:
    player: holds player object
    asteroids: array holding asteroid objects
    nextAsteroidID: determines the ID of the next asteroid
    bullets: array holding bullet objects

  Objects:
    1. Player
      x: x-coordinate
      y: y-coordinate
      velX: horizontal velocity
      velY: vertical velocity
      heading: direction of top of player triangle
      cooldown: controls cooldown of bullets
      destroyed: flag that determines if player is destroyed
    2. Asteroids
      id: asteroid ID
      x
      y
      velX
      velY
      radius: radius of asteroid
      destroyed
    3. Bullets
      angle: angle of fired bullet based on player heading/direction
      x
      y
      velX
      velY
      radius: radius of bullet
      destroyed

  Player Methods:

    tic(): moves player on each tic, checks cooldown for bullets on each tic
    processInputs(): determines whether to turn left, turn right, accelerate, or fire
    turnLeft(): turns tip of ship 5 degrees CCW
    turnRight(): turns tip of ship 5 degrees CW
    accelerate(): increases the speed of the ship in the direction of the tip
    fire(): fires bullets with an internal cooldown of 250ms
    wrapX(): wraps player horizontally when ship goes off the left or right edge of the canvas
    wrapY(): wraps player vertically when ship goes off the top or bottom edge of the canvas
    wrapToLeft(): wraps ship to left side from right side
    wrapToRight(): wraps ship to right side from left side
    wrapToTop(): wraps ship to top side from bottom side
    wrapToBottom(): wraps ship to bottom side from top side
    asteroidCollisions(): checks for player collision with asteroid
    collidesWith(): returns true collision is detected
    destroy(): renders model.player to null

  Asteroid Methods:

    tic(): moves asteroid on each tic
    wrapX()
    wrapY()
    wrapToLeft()
    wrapToRight()
    wrapToTop()
    wrapToBottom()
    asteroidCollisions(): checks for collisions against other asteroids
    collidesWith()
    destroy(): removes asteroid from model.asteroids and spawns new asteroids
    spawnChildAsteroids(): spawns new asteroids based on size of original asteroid

  Bullet Methods:

    tic(): moves bullet on each tic
    destroy(): destroys bullet
    asteroidCollisions()
    collidsWith()

  Model Functions:

    tic(): controls tic for player, each asteroid, and each bullet.
    ticCleanUp(): ensures model.asteroids and model.bullets contain only the appropriate objects (no destroyed objects)
    checkCollisions(): checks for asteroid, player, and bullet collisions with other asteroids
    getPlayer(): returns player object
    getAsteroids(): return asteroids array
    getBullets(): return bullets array
    randNum(): generates a random number within a range

###View:

  Functions:

    init(): initiates the view, adds start-button listener
    setCanvasSize(): adjusts the canvas size with given input
    renderTic(): renders the objects into the view for each tic
    renderAsteroid(): creates and draws the asteroids
    renderPlayer(): creates and draws the player
    renderBullet(): creates and draws the bullets
    startControls(): adds 'keydown' and 'keyup' listeners on game start
    stopControls(): turns off listeners on game over
    renderGameOver(): renders game over screen

###Controller:

  Variables:

    width: width of game in px
    height: height of game in px
    asteroidCount: number of asteroids to spawn
    inputs: contains accelerating, turningLeft, turningRight, and firing flags

  Functions:

    init(): sets width, height, and asteroidCount. initiates the model and view
    tic(): initiates model.tic() and view.renderTic(). checks for game over on each tic
    start(): disables start button and initiates view.startControls(). sets game interval
    userInput(): determines which input is being used
    userInputStop(): stops user input on 'keyup'
    checkGameOver(): checks if the game is over
    endGame(): initiates view.stopControls() and view.renderGameOver()
    restart(): reinitiates the controller and restarts the game