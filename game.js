const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png' 
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 175
  },
  imageSrc: './img/shop_anim.png',
  scale: 2.5,
  framesMax: 6
});

const player = new Fighter({
  position: {
    x: 0, 
    y: 0 
  }, 
  velocity: {
    x: 0,
    y: 10 
  },
  imageSrc:'img/mack/Martial Hero/Sprites/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Idle.png',
      frames: 8
    },
    run: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Run.png',
      frames: 8
    },
    jump: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Jump.png',
      frames: 2
    },
    fall: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Fall.png',
      frames: 2
    },
    attack1: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Attack1.png',
      frames: 6
    },
    takeHit: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Take Hit - white silhouette.png',
      frames: 4
    },
    death: {
      imageSrc: 'img/mack/Martial Hero/Sprites/Death.png',
      frames: 6
    }

  },
  attackBox: {
    width: 160,
    height: 50,
    offset: {
      x: -100,
      y: -50
    }
  },
  health: 100
});

const enemy = new Fighter({
  position: {
    x: 400, 
    y: 100 
  }, 
  velocity: {
    x: 0,
    y: 10 
  },
  imageSrc:'img/kenji/Martial Hero 2/Sprites/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Idle.png',
      frames: 4
    },
    run: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Run.png',
      frames: 8
    },
    jump: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Jump.png',
      frames: 2
    },
    fall: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Fall.png',
      frames: 2
    },
    attack1: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Attack1.png',
      frames: 4
    },
    takeHit: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Take hit.png',
      frames: 3
    },
    death: {
      imageSrc: 'img/kenji/Martial Hero 2/Sprites/Death.png',
      frames: 7
    }
  },
  attackBox: {
    width: 160,
    height: 50,
    offset: {
      x: 175,
      y: -50
    }
  },
  health: 80
});

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  
  player.velocity.x = 0;
  
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // if (keys.w.pressed && player.position.y + player.height >= canvas.height - 80) {
  //   player.velocity.y = -20;
  //   player.image = player.sprites.jump.image;
  //   player.framesMax = player.sprites.jump.framesMax;
  // }
  if (player.velocity.y < 0) { 
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  enemy.velocity.x = 0;

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.switchSprite('run');
    enemy.velocity.x = 5;
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0) { 
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // if (keys.ArrowUp.pressed && enemy.position.y + enemy.height >= canvas.height) {
  //   enemy.velocity.y = -20;
  // }

  //collision detection
  if (checkCollision({
    rectangle1: player,
    rectangle2: enemy
  }) && player.isAttacking && player.frameCurrent === 4) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemyHealth', {duration: 0.5, width: enemy.health + '%'});
  }

  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  if (checkCollision({
    rectangle1: enemy,
    rectangle2: player
  }) && enemy.isAttacking && enemy.frameCurrent === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {duration: 0.5, width: player.health + '%'});
  }

  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({
      player,
      enemy,
      timerId
    });
  }
}

animate();

window.addEventListener('keydown', (e) => {
  if (!player.dead) {
    switch(e.key) {
      case 'w':
      keys.w.pressed = true;
      if (player.velocity.y === 0)
        player.velocity.y = -20;
      break;
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case ' ':
      player.attack();
      break;
    }
  }
  if (!enemy.dead) {
    switch(e.key) {
      case 'ArrowUp':
        keys.ArrowUp.pressed = true;
        if (enemy.velocity.y === 0)
          enemy.velocity.y = -20;
        break;
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (e) => {
  switch(e.key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
    case 'w':
      keys.w.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
});