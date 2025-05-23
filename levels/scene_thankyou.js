export function registerFinalScene() {
	scene("thankyou", () => {
		setBackground(0, 0, 0)

		const resumeStats = [
			"Education",
			"- Northeastern University, Boston, MA (MSCS, May 2025)",
			"- Visvesvaraya Technological University, India (BSCS, June 2021)",
			"",
			"Experience",
			"Founding Software Engineer @ Echelon (Sept 2024 – Present)",
			"- Python (Flask), Docker, AWS; 100K+ transactions/day",
			"- React-based merchant portal with 40% faster insights",
			"- AI segmentation boosted retention by 30%",
			"",
			"Software Development Engineer @ BETSOL / REBIT (Mar 2021 – Jan 2024)",
			"- ASP.NET Core, C#, C++; cloud backup & deduplication",
			"- Launched Zmanda Cloud Storage (S3-compatible Wasabi)",
			"- Mentored peers and owned CI/CD pipelines",
			"",
			"Projects",
			"- Shreyas AI: GPT-4 chatbot with FastAPI + LangChain",
			"  Cut support response time by 60% using FAISS memory",
			"- Windows Shell Enhancements: Start menu optimizations",
			"  Built C++/XAML features reducing latency by 40%",
			"",
			"Skills",
			"Languages: Python, Java, C#, C++, SQL, Bash",
			"Frameworks: ASP.NET, Flask, FastAPI, React, Spring Boot",
			"Cloud/DevOps: AWS, Docker, Kubernetes, GitHub Actions",
			"Databases: PostgreSQL, SQL Server, MongoDB, Redis",
			"",
			"Contact",
			"shreyasb63@gmail.com",
			"github.com/Shreyas-Bhaskar",
			"linkedin.com/in/shreyas-bhaskar",
			"",
			"Press SPACE or ESC to return to menu",
		]

		let currentLine = 0
		const displayLines = []
		let rightAlign = false;
		let leftY = 80;
		let rightY = 80;

		loop(0.3, () => {
			if (currentLine < resumeStats.length) {
				const line = resumeStats[currentLine++]
				if (line === "Contact") {
					rightAlign = true;
					rightY = 80;
				}

				displayLines.push(
					add([
						text(line, { size: 21 }),
						rightAlign
							? pos(width() - 80, rightY)
							: pos(80, leftY),
						rightAlign ? anchor("topright") : undefined,
					])
				)

				if (rightAlign) {
					rightY += 30;
				} else {
					leftY += 30;
				}
			}
		})

		onKeyPress("space", () =>  location.reload())
		onKeyPress("escape", () =>  location.reload())
	})
}
