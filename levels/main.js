import kaboom from "https://unpkg.com/kaboom@3000.0.0-beta.3/dist/kaboom.mjs";
import { registerLevel1 } from "./level1_bnmit.js";
import { registerLevel2 } from "./level2_betsol.js";
import { registerLevel3 } from "./level3_masters.js";
import { registerFinalScene } from "./scene_thankyou.js";

// Initialize Kaboom
kaboom({
  background: [30, 30, 40],
});

// Game state
export const gameState = {
  skills: 0,
  currentLevel: 1,
  unlockedLevels: 1,
};

// Level config
export const levels = [
  {
    type: "level1",
    title: "Bachelors in Computer Science (BNMIT)",
    description: "Collect skills and reach the graduation portal",
    map: [
      " @ o o o o o > ",
      "===============",
    ],
    skills: [
      "DBMS Basics",
      "Algorithm Basics",
      "AI Basics",
      "Data Structures",
      "Web Development",
      "Software Engineering"
    ]
  },
  {
    type: "level2",
    title: "BETSOL: Chunk Deduplication Engineer",
    description: "A platform runner through real-world backend work"
  },
  {
    type: "level3",
    title: "Masters in Computer Science (Northeastern)",
    description: "Navigate through your Master's journey",
    concepts: [
      'Advanced DBMS',
      'Program Design',
      'Advanced Algorithms',
      'Compiler Design',
      'Lambda Calculus',
      'React',
      'NLP',
      'Unsupervised ML',
      'Advanced ML',
      'Sleepless nights',
      'Midterm Chaos',
      'Finals Week',
      'Imposter Syndrome',
      'Paper Presentation',
      'Interview Season'
    ]
  }
];

// Shared constant
export const SPEED = 480;

// Load assets
loadSprite("bean", "/sprites/bean.png");
loadSprite("coin", "/sprites/coin.png");
loadSprite("spike", "/sprites/spike.png");
loadSprite("grass", "/sprites/grass.png");
loadSprite("portal", "/sprites/portal.png");
loadSprite("mark", "/sprites/mark.png");
// Additional sprites from classic_level1.js
loadSprite("steel", "/sprites/steel.png");
loadSprite("bag", "/sprites/bag.png");
loadSprite("prize", "/sprites/egg.png");
loadSprite("apple", "/sprites/apple.png");
loadSprite("ghosty", "/sprites/ghosty.png");


// Register scenes from level files
registerLevel1(gameState, levels, SPEED);
registerLevel2();
registerLevel3(gameState, levels, SPEED);
registerFinalScene();

// Menu scene
scene("menu", () => {
  add([
    text("Portfolio Platformer", { size: 64 }),
    pos(center().add(0, -100)),
    anchor("center"),
  ]);

  add([
    text("Start Game", { size: 32 }),
    pos(center().add(0, 50)),
    anchor("center"),
    area(),
    "startBtn"
  ]);

  // Add Shreyas Bhaskar's details
  add([
    text("Made with <3 by Shreyas Bhaskar", { size: 24, align: "center" }),
    pos(center().add(0, 120)),
    anchor("center"),
  ]);
  add([
    text("shreyasb63@gmail.com", { size: 20, align: "center" }),
    pos(center().add(0, 155)),
    anchor("center"),
  ]);
  add([
    text("linkedin.com/in/shreyas-bhaskar", { size: 20, align: "center" }),
    pos(center().add(0, 185)),
    anchor("center"),
  ]);


  onClick("startBtn", () => {
    go("level1_intro");
  });

  onKeyPress("escape", () => go("menu"));
});

// Level 1 should go to betsol_intro (level2)
// Level 2 (betsol) should go to level3
// Level 3 should go to thankyou

// Start from menu
go("menu");