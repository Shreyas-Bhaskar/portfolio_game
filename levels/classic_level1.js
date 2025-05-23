// levels/classic_level1.js
export function registerClassicLevel1() {
  // --- Kaboom mechanics ---
  function patrol(speed = 60, dir = 1) {
    return {
      id: "patrol",
      require: ["pos", "area"],
      add() {
        this.on("collide", (obj, col) => {
          if (col.isLeft() || col.isRight()) {
            dir = -dir
          }
        })
      },
      update() {
        this.move(speed * dir, 0)
      },
    }
  }

  function big() {
    let timer = 0
    let isBig = false
    let destScale = 1
    return {
      id: "big",
      require: ["scale"],
      update() {
        if (isBig) {
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
          }
        }
        this.scale = this.scale.lerp(vec2(destScale), dt() * 6)
      },
      isBig() { return isBig },
      smallify() { destScale = 1; timer = 0; isBig = false },
      biggify(time) { destScale = 2; timer = time; isBig = true },
    }
  }

  const JUMP_FORCE = 1320
  const MOVE_SPEED = 480
  const FALL_DEATH = 2400

  const LEVELS = [
    [
      "    0       ",
      "   --       ",
      "       $$   ",
      " %    ===   ",
      "            ",
      "   ^^  > = @",
      "============",
    ],
    [
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "                          $",
      "           $$         =   $",
      "  %      ====         =   $",
      "                      =   $",
      "                      =    ",
      "       ^^      = >    =   @",
      "===========================",
    ],
    [
      "     $    $    $    $     $",
      "     $    $    $    $     $",
      "                           ",
      "                           ",
      "                           ",
      "                           ",
      "                           ",
      " ^^^^>^^^^>^^^^>^^^^>^^^^^@",
      "===========================",
    ],
  ]

  const levelConf = {
    tileWidth: 64,
    tileHeight: 64,
    tiles: {
      "=": () => [
        sprite("grass"),
        area(),
        body({ isStatic: true }),
        anchor("bot"),
        offscreen({ hide: true }),
        "platform",
      ],
      "-": () => [
        sprite("steel"),
        area(),
        body({ isStatic: true }),
        offscreen({ hide: true }),
        anchor("bot"),
      ],
      "0": () => [
        sprite("bag"),
        area(),
        body({ isStatic: true }),
        offscreen({ hide: true }),
        anchor("bot"),
      ],
      "$": () => [
        sprite("coin"),
        area(),
        pos(0, -9),
        anchor("bot"),
        offscreen({ hide: true }),
        "coin",
      ],
      "%": () => [
        sprite("prize"),
        area(),
        body({ isStatic: true }),
        anchor("bot"),
        offscreen({ hide: true }),
        "prize",
      ],
      "^": () => [
        sprite("spike"),
        area(),
        body({ isStatic: true }),
        anchor("bot"),
        offscreen({ hide: true }),
        "danger",
      ],
      "#": () => [
        sprite("apple"),
        area(),
        anchor("bot"),
        body(),
        offscreen({ hide: true }),
        "apple",
      ],
      ">": () => [
        sprite("ghosty"),
        area(),
        anchor("bot"),
        body(),
        patrol(),
        offscreen({ hide: true }),
        "enemy",
      ],
      "@": () => [
        sprite("portal"),
        area({ scale: 0.5 }),
        anchor("bot"),
        pos(0, -12),
        offscreen({ hide: true }),
        "portal",
      ],
    },
  }

  scene("classic_level1", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
    const level = addLevel(LEVELS[levelId ?? 0], levelConf)
    const player = add([
      sprite("bean"),
      pos(0, 0),
      area(),
      scale(1),
      body(),
      big(),
      anchor("bot"),
    ])

    player.onUpdate(() => {
      camPos(player.pos)
      if (player.pos.y >= FALL_DEATH) {
        go("classic_lose")
      }
    })

    player.onBeforePhysicsResolve((collision) => {
      if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
        collision.preventResolution()
      }
    })

    player.onPhysicsResolve(() => {
      camPos(player.pos)
    })

    player.onCollide("danger", () => {
      go("classic_lose")
      play("hit")
    })

    player.onCollide("portal", () => {
      play("portal")
      if (levelId + 1 < LEVELS.length) {
        go("classic_level1", {
          levelId: levelId + 1,
          coins: coins,
        })
      } else {
        go("classic_win")
      }
    })

    player.onGround((l) => {
      if (l.is("enemy")) {
        player.jump(JUMP_FORCE * 1.5)
        destroy(l)
        addKaboom(player.pos)
        play("powerup")
      }
    })

    player.onCollide("enemy", (e, col) => {
      if (!col.isBottom()) {
        go("classic_lose")
        play("hit")
      }
    })

    let hasApple = false

    player.onHeadbutt((obj) => {
      if (obj.is("prize") && !hasApple) {
        const apple = level.spawn("#", obj.tilePos.sub(0, 1))
        apple.jump()
        hasApple = true
        play("blip")
      }
    })

    player.onCollide("apple", (a) => {
      destroy(a)
      player.biggify(3)
      hasApple = false
      play("powerup")
    })

    let coinPitch = 0

    onUpdate(() => {
      if (coinPitch > 0) {
        coinPitch = Math.max(0, coinPitch - dt() * 100)
      }
    })

    player.onCollide("coin", (c) => {
      destroy(c)
      play("coin", {
        detune: coinPitch,
      })
      coinPitch += 100
      coins += 1
      coinsLabel.text = coins
    })

    const coinsLabel = add([
      text(coins),
      pos(24, 24),
      fixed(),
    ])

    function jump() {
      if (player.isGrounded()) {
        player.jump(JUMP_FORCE)
      }
    }

    onKeyPress("space", jump)

    onKeyDown("left", () => {
      player.move(-MOVE_SPEED, 0)
    })

    onKeyDown("right", () => {
      player.move(MOVE_SPEED, 0)
    })

    onKeyPress("down", () => {
      player.weight = 3
    })

    onKeyRelease("down", () => {
      player.weight = 1
    })

    onGamepadButtonPress("south", jump)

    onGamepadStick("left", (v) => {
      player.move(v.x * MOVE_SPEED, 0)
    })

    onKeyPress("f", () => {
      setFullscreen(!isFullscreen())
    })
  })

  scene("classic_lose", () => {
    add([
      text("You Lose"),
    ])
    onKeyPress(() => go("classic_level1"))
  })

  scene("classic_win", () => {
    add([
      text("You Win"),
    ])
    onKeyPress(() => go("betsol_intro"))
  })
} 