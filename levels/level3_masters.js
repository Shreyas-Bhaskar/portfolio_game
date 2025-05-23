export function registerLevel3(gameState, levels, SPEED) {
  scene("level3", () => {
    const levelDef = levels[2];
    setGravity(2400);
    setBackground(30, 30, 40);
    const FLOOR_HEIGHT = 48;
    const JUMP_FORCE = 1000;
    const LEVEL_WIDTH = 2000;

    // --- Animated Floating Knowledge Orbs ---
    loop(0.3, () => {
      add([
        circle(rand(8, 18)),
        pos(rand(0, LEVEL_WIDTH), rand(0, height())),
        color(rand(100,255), rand(100,255), 255),
        opacity(rand(0.10, 0.22)),
        move(UP, rand(10, 40)),
        lifespan(rand(2, 4)),
        z(1),
      ])
    })

    // --- Randomly Falling Exam Papers (Hazards) ---
 

    // --- Moving Platform (Horizontal) ---
    const movingPlatform = add([
      rect(120, 32),
      pos(600, height() - 200),
      area(),
      body({ isStatic: true }),
      color(255, 200, 50),
      z(5),
      "movingPlatform"
    ]);
    let direction = 1;
    movingPlatform.onUpdate(() => {
      if (movingPlatform.pos.x > 900) direction = -1;
      if (movingPlatform.pos.x < 400) direction = 1;
      movingPlatform.move(direction * 120, 0);
    });

    // --- Bouncing Distraction Balls ---
   

    // --- Bonus Orbs ---
    function spawnBonus() {
      const orb = add([
        circle(14),
        pos(rand(0, LEVEL_WIDTH), rand(0, height() - 100)),
        color(0, 255, 180),
        area(),
        z(15),
        "bonusOrb"
      ]);
      wait(rand(6, 12), () => {
        if (orb.exists()) destroy(orb);
        spawnBonus();
      });
    }
    spawnBonus();

    const player = add([
      sprite("bean"),
      pos(80, 40),
      area(),
      body(),
    ]);

    // --- Collisions for Hazards and Bonus ---
    player.onCollide("examHazard", () => {
      go("level3");
    });
    player.onCollide("distraction", () => {
      go("level3");
    });
    player.onCollide("bonusOrb", (orb) => {
      destroy(orb);
      addKaboom(player.pos);
      add([
        text("+ Focus!", { size: 32 }),
        pos(player.pos.x, player.pos.y - 40),
        color(0,255,180),
        anchor("center"),
        lifespan(1, { fade: 0.5 }),
        z(100)
      ]);
    });

    add([
      rect(width(), FLOOR_HEIGHT),
      outline(4),
      pos(0, height()),
      anchor("botleft"),
      area(),
      body({ isStatic: true }),
      color(132, 101, 236),
    ]);

    function jump() {
      if (player.isGrounded()) {
        player.jump(JUMP_FORCE);
      }
    }

    onKeyPress("space", jump);
    onClick(jump);

    let conceptIndex = 0;

    function spawnConcept() {
      if (conceptIndex >= levelDef.concepts.length) {
        go("thankyou");
        return;
      }

      const label = levelDef.concepts[conceptIndex++];
      const boxWidth = rand(80, 90);
      const boxHeight = rand(62, 100);
      const boxColor = rgb(rand(100, 255), rand(100, 255), rand(100, 255));

      const obstacle = add([
        rect(boxWidth, boxHeight),
        pos(width(), height() - FLOOR_HEIGHT),
        anchor("botleft"),
        area(),
        color(boxColor),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "concept",
      ]);

      add([
        text(label, {
          size: 20,
          font: "sink",
          transform: (idx, ch) => ({
            color: rgb(58, 255, 8),
            opacity: 0.98,
            angle: wave(6, 12, time() * 6 + idx),
          }),
        }),
        pos(obstacle.pos.x + boxWidth / 2, obstacle.pos.y - boxHeight - 10),
        anchor("center"),
        z(100),
        move(LEFT, SPEED),
      ]);

      wait(1.2, spawnConcept);
    }

    spawnConcept();

    player.onCollide("concept", () => {
      go("level3");
    });
  });
}