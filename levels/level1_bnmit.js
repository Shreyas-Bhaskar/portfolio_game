export function registerLevel1(gameState, levels, SPEED) {
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
  setGravity(3200)

  const JUMP_FORCE = 1320
  const MOVE_SPEED = SPEED
  const FALL_DEATH = 2400

  const LEVELS = [
    {
      title: "Year 1: Discovery",
      map: [
        "                                   ",
        "    $       $       $       $     ",
        "                                   ",
        "   ===     ===     ===     ===    ",
        "                                   ",
        "      $   $   $   $   $   $    @   ",
        "=====     =====     =====     == ",
      ],
      intro: "In 2017, Shreyas stepped into Computer Science with wide-eyed curiosity.",
      outro: "Completed Year 1 with 16 credits and a lot of learning!",
    },
    {
      title: "Year 2: Climb & Learn",
      map: [
        "              $                    ",
        "             ===                   ",
        "      $                             ",
        "     ===     $     $     $         ",
        "            ===   ===   ===        ",
        "  $     $                       @    ",
        "====   ====   ====   ====     ====",
      ],
      intro: "In 2018, Shreyas tackled OOP, DBMS, and started building small systems.",
      outro: "Level 2 clear! Knowledge stacks higher now 📚",
    },
    {
      title: "Year 3: The Tech Jungle",
      map: [
        "   $   $   $   $   $   $   $   $   ",
        "==================================",
        "                                   ",
        "     $   $   $   $   $   $   $     ",
        "                                 @  ",
        "==================================",
        "                                  ",
      ],
      intro: "In 2019, Shreyas got hands-on with research, full-stack projects, and ML.",
      outro: "Survived the tech jungle. Projects now speak for themselves 💻",
    },
    {
      title: "Year 4: Leap of Faith",
      map: [
        "      $        $         $        ",
        "                                   ",
        "     ===     ===     ===     ===  ",
        "                                   ",
        "   $     $       $         $      ",
        "                                @  ",
        "====    ====    ====    ====   ==",
      ],
      intro: "In 2020, Shreyas built capstones, prepared for interviews, and took bold steps.",
      outro: "Graduated with a Bachelor's in CS and confidence! 🎓",
    }
  ]
  

  let currentLevel = 0
  let coinsCollected = 0

  // Intro scene
  scene("level1_intro", () => {
    console.log("Intro scene triggered for level:", currentLevel);
    const data = LEVELS[currentLevel]
    add([
      text(data.intro, { size: 28, width: width() - 80 }),
      pos(center().add(0, -40)),
      anchor("center"),
    ])
    add([
      text("Click to begin next Year", { size: 24 }),
      pos(center().add(0, 120)),
      anchor("center"),
    ])
    
    let clicked = false;
    onClick(() => {
      if (!clicked) {
        clicked = true;
        go("level1_play");
      }
    })
  })

  // Play scene
  scene("level1_play", () => {
    const data = LEVELS[currentLevel]
    const level = addLevel(data.map, {
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
        "$": () => [
          sprite("coin"),
          area(),
          pos(0, -9),
          anchor("bot"),
          offscreen({ hide: true }),
          "coin",
        ],
        "@": () => [
          sprite("portal"),
          area({ scale: 0.5 }),
          anchor("bot"),
          pos(0, -12),
          offscreen({ hide: true }),
          "portal",
        ],
      }
    }  
    )
// define player object
const player = add([
  sprite("bean"),
  pos(0, 0),
  area(),
  scale(1),
  // makes it fall to gravity and jumpable
  body(),
  // the custom component we defined above
  big(),
  anchor("bot"),
])

player.onUpdate(() => {
  // center camera to player
  camPos(player.pos)
  // check fall death
  if (player.pos.y >= FALL_DEATH) {
    go("level1_play")
  }
})
    // one‑way platform: only block when falling
    player.onBeforePhysicsResolve((collision) => {
      if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
        collision.preventResolution()
      }
    })
  
    player.onPhysicsResolve(() => {
      // Set the viewport center to player.pos
      camPos(player.pos)
    })

    onKeyDown("left", () => player.move(-MOVE_SPEED, 0))
    onKeyDown("right", () => player.move(MOVE_SPEED, 0))

    function jump() {
      console.log("Jump called. Grounded?", player.isGrounded())
      if (player.isGrounded()) {
        player.jump(JUMP_FORCE)
      }
    }
    onKeyPress("space", jump)

    player.onUpdate(() => {
      camPos(player.pos)
      if (player.pos.y > FALL_DEATH) {
        go("level1_play")
      }
    })

    player.onCollide("coin", (coin) => {
      destroy(coin)
      coinsCollected++
    })

    let clicked = false;
    player.onCollide("portal", () => {
      if (!clicked) {
        clicked = true;
        go("level1_outro");
      }
    })

    add([
      text(data.title, { size: 32 }),
      pos(24, 24),
      fixed(),
    ])

    add([
      text(() => `Credits: ${coinsCollected}`, { size: 24 }),
      pos(24, 64),
      fixed(),
    ])
  })

  // Outro scene
  scene("level1_outro", () => {
    const data = LEVELS[currentLevel]
    add([
      text(data.outro, { size: 28, width: width() - 80 }),
      pos(center().add(0, -40)),
      anchor("center"),
    ]) 
    add([
      text("Click for next year", { size: 24 }),
      pos(center().add(0, 120)),
      anchor("center"),
    ])
    
    let clicked = false;
    onClick(() => {
      if (!clicked) {
        clicked = true;
        console.log("Outro onClick: currentLevel before increment:", currentLevel);
        currentLevel++;
        console.log("Outro onClick: currentLevel after increment:", currentLevel);
        if (currentLevel < LEVELS.length) {
          go("level1_intro");
        } else {
          go("level1_thankyou");
        }
      }
    })
  })

  // Thank you scene
  scene("level1_thankyou", () => {
    add([
      text("🎓 Shreyas completed 4 years of Engineering!!", {
        size: 32,
        width: width() - 100
      }),
      pos(center()),
      anchor("center"),
    ])
    add([
      text("Click to continue", { size: 20 }),
      pos(center().add(0, 120)),
      anchor("center"),
    ])
    
    let clicked = false;
    onClick(() => {
      if (!clicked) {
        clicked = true;
        currentLevel = 0;
        coinsCollected = 0;
        go("betsol_intro");
      }
    })
  })

  // Register a 'level1' scene for the menu to start level 1
  scene("level1", () => {
    currentLevel = 0
    coinsCollected = 0
    go("level1_play")
  })
}
