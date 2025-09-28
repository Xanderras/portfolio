#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier-terser');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// ANSI color codes for beautiful console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`${step} ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

async function prepareDistDir() {
  logStep('📁', 'Preparing dist directory...');

  try {
    // Ensure dist directory exists
    await fs.ensureDir(DIST_DIR);

    // Create subdirectories
    const subdirs = ['css', 'js', 'assets/images', 'assets/documents', 'data'];
    for (const subdir of subdirs) {
      await fs.ensureDir(path.join(DIST_DIR, subdir));
    }

    logSuccess('Dist directory structure created');
  } catch (error) {
    logError(`Failed to prepare dist directory: ${error.message}`);
    process.exit(1);
  }
}

async function processHtml() {
  logStep('📄', 'Processing HTML file...');

  try {
    const htmlPath = path.join(ROOT_DIR, 'index.html');
    const htmlContent = await fs.readFile(htmlPath, 'utf8');

    // Replace individual script tags with minified bundle
    let processedHtml = htmlContent;

    // Remove individual script includes
    processedHtml = processedHtml.replace(
      /<script src="js\/managers\/DataManager\.js"><\/script>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<script src="js\/components\/Timeline\.js"><\/script>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<script src="js\/language\.js"><\/script>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<script src="js\/theme\.js"><\/script>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<script src="js\/animations\.js"><\/script>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<script src="js\/main\.js"><\/script>/g,
      '<script src="js/app.min.js"></script>'
    );

    // Replace individual CSS files with minified bundle
    processedHtml = processedHtml.replace(
      /<link rel="stylesheet" href="css\/style\.css" \/>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<link rel="stylesheet" href="css\/animations\.css" \/>\s*/g,
      ''
    );
    processedHtml = processedHtml.replace(
      /<link rel="stylesheet" href="css\/responsive\.css" \/>/g,
      '<link rel="stylesheet" href="css/style.min.css" />'
    );

    // Minify HTML
    const minifiedHtml = await minify(processedHtml, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
    });

    // Write minified HTML to dist
    await fs.writeFile(path.join(DIST_DIR, 'index.html'), minifiedHtml);

    logSuccess('HTML processed and minified');
  } catch (error) {
    logError(`Failed to process HTML: ${error.message}`);
    process.exit(1);
  }
}

async function optimizeExtra() {
  logStep('⚡', 'Running extra optimizations...');

  try {
    // Add cache busting to important files
    const indexPath = path.join(DIST_DIR, 'index.html');
    let html = await fs.readFile(indexPath, 'utf8');

    const timestamp = Date.now();
    html = html.replace('js/app.min.js', `js/app.min.js?v=${timestamp}`);
    html = html.replace('css/style.min.css', `css/style.min.css?v=${timestamp}`);

    await fs.writeFile(indexPath, html);

    // Create a build info file
    const buildInfo = {
      buildDate: new Date().toISOString(),
      version: '1.0.0',
      files: {
        html: 'index.html',
        css: 'css/style.min.css',
        js: 'js/app.min.js',
        data: ['data/experiences.json', 'data/translations.json']
      },
      features: [
        'Component-based architecture',
        'JSON data management',
        'Multilingual support',
        'Dynamic timeline',
        'Minified and optimized'
      ]
    };

    await fs.writeFile(
      path.join(DIST_DIR, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    );

    logSuccess('Extra optimizations completed');
  } catch (error) {
    logWarning(`Some optimizations failed: ${error.message}`);
  }
}

async function showBuildSummary() {
  logStep('📊', 'Build Summary:');

  try {
    const distStats = await getDirectorySize(DIST_DIR);
    log(`\n${colors.bold}🚀 Build Complete!${colors.reset}`, 'green');
    log(`📁 Output directory: ${DIST_DIR}`, 'cyan');
    log(`📦 Total size: ${(distStats / 1024).toFixed(2)} KB`, 'cyan');

    log(`\n${colors.bold}📋 Files created:${colors.reset}`, 'blue');
    log('  • index.html (minified)', 'reset');
    log('  • css/style.min.css (combined & minified)', 'reset');
    log('  • js/app.min.js (combined & minified)', 'reset');
    log('  • data/ (experiences & translations)', 'reset');
    log('  • assets/ (images & documents)', 'reset');
    log('  • build-info.json', 'reset');

    log(`\n${colors.bold}🌐 Ready for deployment!${colors.reset}`, 'green');
    log('Upload the entire "dist" folder to your hosting provider.', 'yellow');

  } catch (error) {
    logWarning('Could not generate build summary');
  }
}

async function getDirectorySize(dirPath) {
  let totalSize = 0;

  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(dirPath, file.name);

      if (file.isDirectory()) {
        totalSize += await getDirectorySize(filePath);
      } else {
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    // Ignore errors for missing directories
  }

  return totalSize;
}

// Main execution
async function main() {
  const command = process.argv[2];

  log(`\n${colors.bold}🔧 Portfolio Build System${colors.reset}`, 'magenta');
  log(`Command: ${command}\n`, 'cyan');

  try {
    switch (command) {
      case 'prepare':
        await prepareDistDir();
        break;

      case 'html':
        await processHtml();
        break;

      case 'optimize':
        await optimizeExtra();
        await showBuildSummary();
        break;

      default:
        logError('Unknown command. Use: prepare, html, or optimize');
        process.exit(1);
    }
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  prepareDistDir,
  processHtml,
  optimizeExtra,
  showBuildSummary
};