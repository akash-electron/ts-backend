#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

async function init() {
  const args = process.argv.slice(2);
  const targetDir = args[0]
    ? path.resolve(process.cwd(), args[0])
    : process.cwd();
  const sourceDir = path.join(__dirname, "../src");

  console.log("🚀 Initializing TypeScript Backend Boilerplate...");

  try {
    // Ensure target directory exists
    await fs.ensureDir(targetDir);

    // 1. Copy src folder
    if (await fs.pathExists(sourceDir)) {
      await fs.copy(sourceDir, path.join(targetDir, "src"));
      console.log("📂 Copied source files");
    } else {
      console.warn("⚠️ Warning: Source directory not found at", sourceDir);
    }

    // 2. Define other essential files to copy
    const filesToCopy = [
      "tsconfig.json",
      ".env.example",
      "README.md",
      ".gitignore",
    ];

    for (const file of filesToCopy) {
      let filePath = path.join(__dirname, "..", file);

      // Handle the .gitignore vs .npmignore renaming issue
      if (file === ".gitignore" && !(await fs.pathExists(filePath))) {
        filePath = path.join(__dirname, "..", ".npmignore");
      }
      if (await fs.pathExists(filePath)) {
        await fs.copy(filePath, path.join(targetDir, file));
        console.log(`📄 Copied ${file}`);
      }
    }

    // 3. Handle package.json (Merge or Create)
    const pkgPath = path.join(targetDir, "package.json");
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

    if (await fs.pathExists(pkgPath)) {
      const existingPkg = await fs.readJson(pkgPath);
      const mergedPkg = {
        ...existingPkg,
        scripts: { ...existingPkg.scripts, ...pkgTemplate.scripts },
        dependencies: {
          ...existingPkg.dependencies,
          ...pkgTemplate.dependencies,
        },
        devDependencies: {
          ...existingPkg.devDependencies,
          ...pkgTemplate.devDependencies,
        },
      };
      await fs.writeJson(pkgPath, mergedPkg, { spaces: 2 });
      console.log(
        "📝 Updated existing package.json with boilerplate scripts and deps",
      );
    } else {
      await fs.writeJson(pkgPath, pkgTemplate, { spaces: 2 });
      console.log("📝 Created package.json");
    }

    console.log("\n✅ Success! Your boilerplate is ready.");
    console.log("\nNext steps:");
    console.log(`1. cd ${path.relative(process.cwd(), targetDir) || "."}`);
    console.log("2. npm install (if you haven't already)");
    console.log("3. Rename .env.example to .env");
    console.log("4. npm run dev");
  } catch (err) {
    console.error("❌ Error initializing project:", err);
  }
}

init();
