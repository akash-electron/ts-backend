#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

async function init() {
  const targetDir = process.cwd();
  const sourceDir = path.join(__dirname, "../src");

  console.log("🚀 Initializing TypeScript Backend Boilerplate...");

  try {
    // 1. Copy src folder (now includes .gitkeep for empty dirs)
    await fs.copy(sourceDir, path.join(targetDir, "src"));

    // 2. Define other essential files to copy
    const filesToCopy = [
      "tsconfig.json",
      ".env.example",
      "README.md",
      ".gitignore",
    ];

    for (const file of filesToCopy) {
      const filePath = path.join(__dirname, "..", file);
      if (await fs.pathExists(filePath)) {
        await fs.copy(filePath, path.join(targetDir, file));
      }
    }

    // 3. Create a basic package.json for the user if it doesn't exist
    const pkgPath = path.join(targetDir, "package.json");
    if (!(await fs.pathExists(pkgPath))) {
      const pkgTemplate = {
        name: path.basename(targetDir),
        version: "1.0.0",
        main: "dist/index.js",
        scripts: {
          dev: "nodemon --exec ts-node src/server.ts",
          build: "tsc",
          start: "node dist/server.js",
        },
        dependencies: {
          cors: "^2.8.6",
          dotenv: "^17.2.4",
          express: "^5.2.1",
          helmet: "^8.1.0",
          morgan: "^1.10.1",
          winston: "^3.19.0",
          zod: "^4.3.6",
        },
        devDependencies: {
          "@types/cors": "^2.8.19",
          "@types/express": "^5.0.6",
          "@types/morgan": "^1.9.10",
          "@types/node": "^25.2.2",
          nodemon: "^3.1.11",
          "ts-node": "^10.9.2",
          typescript: "^5.9.3",
        },
      };
      await fs.writeJson(pkgPath, pkgTemplate, { spaces: 2 });
      console.log("📝 Created package.json");
    }

    console.log("\n✅ Success! Your boilerplate is ready.");
    console.log("\nNext steps:");
    console.log("1. npm install or pnpm install");
    console.log("2. Rename .env.example to .env");
    console.log("3. npm run dev or pnpm run dev");
  } catch (err) {
    console.error("❌ Error initializing project:", err);
  }
}

init();
