import kaboom from "https://unpkg.com/kaboom@3000.0.0-beta.3/dist/kaboom.mjs";
import { registerLevel1 } from "./level1_bnmit.js";
import { registerLevel3 } from "./level3_masters.js";
import { registerClassicLevel1 } from './levels/classic_level1.js';

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

// Register scenes from level files
registerLevel1(gameState, levels, SPEED);
registerLevel3(gameState, levels, SPEED);
registerClassicLevel1();

// Menu scene
scene("menu", () => {
  add([
    text("Portfolio Platformer", { size: 64 }),
    pos(center().add(0, -100)),
    anchor("center"),
  ]);

  for (let i = 0; i < levels.length; i++) {
    add([
      text(`Level ${i + 1}: ${levels[i].title}`, { size: 32 }),
      pos(center().add(0, 50 + i * 80)),
      anchor("center"),
      area(),
      "levelBtn",
      { levelIdx: i },
    ]);
  }

  onClick("levelBtn", (btn) => {
    startLevel(btn.levelIdx);
  });

  add([
    text("Total Skills: " + gameState.skills, { size: 32 }),
    pos(center().add(0, 300)),
    anchor("center"),
  ]);

  onKeyPress("escape", () => go("menu"));
});

// Start selected level
export function startLevel(levelIdx) {
  const level = levels[levelIdx];
  if (level.type === "level1") {
    go("level1");
  } else if (level.type === "level3") {
    go("level3");
  }
}

// Level complete screen
scene("levelComplete", () => {
  add([
    text("🎓 Shreyas graduated with a Master's degree in 2025 after two years of effort!", {
      size: 32,
      width: width() - 100,
    }),
    pos(center()),
    anchor("center"),
  ]);

  add([
    text("Press SPACE for menu", { size: 48 }),
    pos(center().add(0, 200)),
    anchor("center"),
  ]);

  onKeyPress("space", () => go("menu"));
  onKeyPress("escape", () => go("menu"));
});

// Start from menu
go("menu"); 