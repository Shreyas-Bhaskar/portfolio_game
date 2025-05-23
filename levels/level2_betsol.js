export function registerLevel2() {
	const FLOOR_HEIGHT = 48
	const JUMP_FORCE = 800
	const SPEED = 480

	scene("betsol_intro", () => {
		add([
			rect(width() - 100, height() - 100, { radius: 12 }),
			pos(50, 50),
			color(0, 0, 0),
			opacity(0.7),
			z(10),
		]);

		add([
			text(`After graduating with a Bachelor's degree, Shreyas joined Rebit…

Engineered backend magic for Rebit, a leading consumer‑data backup solution,
where I designed and optimized microservices, crushed API response times,
and guided junior engineers through complex feature builds.

I was the driving force behind ZCS (Zmanda Cloud Storage), a Wasabi‑powered S3 solution,
crafting an efficient and scalable storage system that redefined product speed and security.

click to begin…`,
				{ size: 20, width: width() - 140 }
			),
			pos(70, 70),
			z(20),
		]);

		onClick(() => go("level2"));
	});

	scene("level2", () => {
		const LEVEL_WIDTH = 3000; // Bugs will fall across the whole map
		const terminalMessages = [
			"[AI] Scanning data nodes...",
			"[AI] Dedup pass 1 complete",
			"[AI] Resolving metadata conflicts...",
			"[AI] Compressing restore logs...",
			"[AI] WMI handshake accepted",
			"[AI] Archive checksum verified ✅",
			"[AI] Syncing final commit..."
		]

		let aiLogIndex = 0
		const aiTerminal = add([
			text(" ", { size: 16, width: 300 }),
			pos(width() - 320, 24),
			z(100),
			fixed(),
			color(0, 255, 180),
		])

		loop(1.8, () => {
			aiTerminal.text = terminalMessages[aiLogIndex % terminalMessages.length]
			aiLogIndex++
		})

		setGravity(2400)

		const player = add([
			sprite("bean"),
			pos(80, height() - 200),
			area(),
			body(),
			z(10)
		])

		const commandSequence = ["w", "m", "i"]
		let inputProgress = 0

		const logs = [
			"> Initiating deduplication pass...",
			"> Chunk indexing complete.",
			"> WMI ping acknowledged.",
			"> Backup node detected.",
			"> Log file compressed.",
			"> Restore point created.",
			"> Stability Restored ✅"
		]
		let logIndex = 0

		const terminalLog = add([
			text("WMI Terminal Ready", { size: 20 }),
			pos(24, 24),
			z(100),
			fixed(),
			color(0, 255, 180),
		])

		loop(0.2, () => {
			add([
				rect(width(), 1),
				pos(0, rand(0, height())),
				color(50, 50, 70),
				move(LEFT, SPEED * 0.4),
				offscreen({ destroy: true }),
				z(0),
			])
		})

		const platforms = [
			{ pos: vec2(100, height() - 100), label: "Chunk #001" },
			{ pos: vec2(250, height() - 200), label: "Corrupted Index" },
			{ pos: vec2(420, height() - 170), label: "Dedup Chunk" },
			{ pos: vec2(600, height() - 240), label: "Delta Snapshot" },
			{ pos: vec2(750, height() - 150), label: "WMI Queue" },
			{ pos: vec2(920, height() - 220), label: "Backup Node A" },
			{ pos: vec2(1100, height() - 190), label: "Chunk Reorder" },
			{ pos: vec2(1280, height() - 260), label: "Compression Block" },
			{ pos: vec2(1450, height() - 230), label: "Metadata Segment" },
			{ pos: vec2(1600, height() - 280), label: "Restore Point" },
			{ pos: vec2(1800, height() - 200), label: "Final Commit" },
			{ pos: vec2(2000, height() - 250), label: "Pizza Check" },
			{ pos: vec2(2150, height() - 200), label: "Goldfly Update" },
			{ pos: vec2(2300, height() - 300), label: "Spike Watch" },
			{ pos: vec2(2450, height() - 230), label: "Egg Protocol" },
			{ pos: vec2(2600, height() - 260), label: "Ghosty Threat" },
			{ pos: vec2(2750, height() - 210), label: "Victory Gateway" },
			{ pos: vec2(2900, height() - 320), label: "Success Node" }
		]

		for (const chunk of platforms) {
			add([
				rect(120, 32),
				pos(chunk.pos),
				area(),
				body({ isStatic: true }),
				color(100 + randi(100), 150 + randi(100), 255),
				z(5),
				"platform"
			])

			loop(0.1, () => {
				add([
					circle(4),
					pos(chunk.pos.add(vec2(rand(10, 110), rand(-10, 42)))),
					color(0, 255, 255),
					opacity(0.3),
					lifespan(0.6, { fade: 0.2 }),
					z(4)
				])
			})

			add([
				text(chunk.label, { size: 16 }),
				pos(chunk.pos.x + 60, chunk.pos.y + 42),
				anchor("center"),
				color(255, 255, 255),
				z(6)
			])
		}

		const goal = add([
			text("✅ BACKUP SUCCESSFUL", { size: 32 }),
			pos(2900 + 60, height() - 380),
			anchor("center"),
			color(0, 255, 0),
			area(),
			z(50),
			"goal"
		])

		onKeyDown("left", () => {
			player.move(-240, 0)
		})
		onKeyDown("right", () => {
			player.move(240, 0)
		})
		onKeyPress("space", () => {
			if (player.isGrounded()) player.jump(JUMP_FORCE)
		})

		onKeyPress((key) => {
			if (key === "space") return;
			if (key === commandSequence[inputProgress]) {
				inputProgress++
				terminalLog.text = logs[Math.min(logIndex++, logs.length - 1)]
				shake(6)
				if (inputProgress === commandSequence.length) {
					addKaboom(player.pos)
					player.color = rgb(50, 255, 100)
					terminalLog.text = logs[logs.length - 1]
					loop(0.05, () => {
						add([
							rect(6, 6),
							pos(player.pos.x + rand(-30, 30), player.pos.y + rand(-30, 30)),
							color(rand(200, 255), rand(100, 255), rand(100, 255)),
							move(vec2(rand(-1, 1), rand(-1, 1)).unit(), rand(100, 200)),
							lifespan(1),
							z(20),
						])
					})
				}
			} else if (["w", "m", "i"].includes(key)) {
				terminalLog.text = "> Invalid Command"
				inputProgress = 0
			}
		})

		player.onCollide("goal", () => {
			go("win2")
		})

		onUpdate(() => {
			camPos(player.pos)
			if (player.pos.y > height() + 100) {
				go("level2")
			}

			// Robust overlap check for bugs
			function isAABBOverlap(a, b) {
				return (
					a.pos.x < b.pos.x + (b.width || 24) &&
					a.pos.x + (a.width || 32) > b.pos.x &&
					a.pos.y < b.pos.y + (b.height || 24) &&
					a.pos.y + (a.height || 32) > b.pos.y
				);
			}
			get("bugHazard").forEach((bug) => {
				if (isAABBOverlap(player, bug)) {
					go("level2");
				}
			});
		})

		// --- Enhanced Animated Background Effects: Floating Data Packets ---
		loop(0.25, () => {
			const isHorizontal = Math.random() > 0.5;
			const colorChoices = [
				color(0, 255, 255),
				color(255, 0, 255),
				color(0, 255, 180),
				color(100, 200, 255),
				color(255, 255, 100),
			];
			add([
				circle(rand(6, 18)),
				pos(rand(0, width()), rand(0, height())),
				colorChoices[Math.floor(rand(0, colorChoices.length))],
				opacity(rand(0.12, 0.22)),
				isHorizontal ? move(RIGHT, rand(10, 40)) : move(UP, rand(20, 60)),
				lifespan(rand(2, 4)),
				z(1),
			])
		})

		// --- Additional Moving Platform (Vertical) ---
		const movingPlatformV = add([
			rect(120, 32),
			pos(1400, height() - 400),
			area(),
			body({ isStatic: true }),
			color(100, 255, 200),
			z(5),
			"movingPlatformV"
		]);
		let vDir = 1;
		movingPlatformV.onUpdate(() => {
			if (movingPlatformV.pos.y > height() - 150) vDir = -1;
			if (movingPlatformV.pos.y < height() - 500) vDir = 1;
			movingPlatformV.move(0, vDir * 80);
		});

		// --- Additional Falling Platform ---
		const fallingPlatform2 = add([
			rect(120, 32),
			pos(2000, height() - 250),
			area(),
			body({ isStatic: true }),
			color(255, 180, 100),
			z(5),
			"fallingPlatform2"
		]);
		fallingPlatform2.solid = true;
		fallingPlatform2.fallTriggered = false;
		player.onCollide(fallingPlatform2, () => {
			if (!fallingPlatform2.fallTriggered) {
				fallingPlatform2.fallTriggered = true;
				wait(0.5, () => {
					fallingPlatform2.use(body({ isStatic: false }));
					fallingPlatform2.jump(-200);
				});
			}
		});

		// --- Randomly Falling Bugs (frequent, random, all over map) ---
		function spawnBug() {
			const bug = add([
				rect(rand(16, 32), rand(16, 32)),
				pos(rand(0, LEVEL_WIDTH - 32), -30),
				color(rand(200,255), rand(50,120), rand(50,120)),
				area(),
				move(DOWN, rand(180, 420)),
				z(12),
				"bugHazard"
			]);
			bug.onUpdate(() => {
				if (bug.pos.y > height() + 30) destroy(bug);
			});
			// Schedule the next bug with a random delay
			wait(rand(0.12, 0.35), spawnBug);
		}
		spawnBug();
	})

	scene("win2", () => {
		add([
			rect(width() - 100, height() - 100, { radius: 12 }),
			pos(50, 50),
			color(0, 0, 0),
			opacity(0.7),
			z(10),
		])

		add([
			text("🎓 Completed Level 2: BETSOL\nRestored data with chunk deduplication efficiency!", {
				size: 28,
				width: width() - 140,
			}),
			pos(70, 70),
			z(20),
		])

		add([
			text("click anywhere to continue", { size: 24 }),
			pos(center().add(0, 180)),
			anchor("center"),
		])

		onClick(() => go("betsol_outro"))
	})

	scene("betsol_outro", () => {
		add([
			rect(width() - 100, height() - 100, { radius: 12 }),
			pos(50, 50),
			color(0, 0, 0),
			opacity(0.7),
			z(10),
		])

		add([
			text("In 2023, Shreyas began pursuing his Master's degree in Computer Science\nto dive deeper into algorithms, systems, and AI.\n\nClick anywhere to continue to the next level.", {
				size: 20,
				width: width() - 140,
			}),
			pos(70, 70),
			z(20),
		])

		onClick(() => go("level3"))
	})
}
