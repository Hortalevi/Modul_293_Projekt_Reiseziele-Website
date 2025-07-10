const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const cpx = require("cpx");

const inputDir = path.join(__dirname, "src");
const outputDir = path.join(__dirname, "dist");

// Clear old dist folder
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// Minify HTML files
const htmlFiles = fs.readdirSync(inputDir).filter((f) => f.endsWith(".html"));
htmlFiles.forEach(async (file) => {
  const srcPath = path.join(inputDir, file);
  const destPath = path.join(outputDir, file);
  const content = fs.readFileSync(srcPath, "utf8");
  const result = await minify(content, {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
  });
  fs.writeFileSync(destPath, result);
});

// Minify CSS using clean-css
const cssInputPath = path.join(inputDir, "styles.css");
const cssOutputPath = path.join(outputDir, "styles.css");

if (fs.existsSync(cssInputPath)) {
  const cssContent = fs.readFileSync(cssInputPath, "utf8");
  const minifiedCSS = new CleanCSS().minify(cssContent);
  fs.writeFileSync(cssOutputPath, minifiedCSS.styles);
}

// Copy images
cpx.copy("src/bilder/**/*.*", path.join(outputDir, "bilder"), (err) => {
  if (err) console.error("Image copy failed:", err);
});

// Copy videos (e.g. mp4 files)
cpx.copy("src/**/*.mp4", path.join(outputDir), (err) => {
  if (err) console.error("Video copy failed:", err);
});

// Copy subtitles (e.g. vtt files)
cpx.copy("src/**/*.vtt", path.join(outputDir), (err) => {
  if (err) console.error("Subtitle copy failed:", err);
});
