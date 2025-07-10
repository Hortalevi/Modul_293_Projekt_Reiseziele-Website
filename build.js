const fs = require("fs");
const path = require("path");
const { minify } = require("html-minifier-terser");
const cssminify = require("css-minify");
const cpx = require("cpx");

const inputDir = path.join(__dirname, "src");
const outputDir = path.join(__dirname, "dist");

// Make sure dist exists
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

// HTML Minification
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

// CSS Minification
cssminify.minify({
  src: path.join(inputDir, "styles.css"),
  dest: outputDir,
});

// Copy images
cpx.copy("src/bilder/**/*.*", path.join(outputDir, "bilder"), (err) => {
  if (err) console.error("Image copy failed:", err);
});
