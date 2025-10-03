/**
 * Deployment Configuration for InfinityFree FTP
 *
 * This file contains the deployment settings for your portfolio.
 * For security, FTP credentials should be stored in environment variables.
 */

module.exports = {
  // FTP Server Configuration
  ftp: {
    // InfinityFree FTP settings (replace with your actual details)
    host: 'ftpupload.net', // Your InfinityFree FTP hostname
    port: 21,
    user: '', // Leave empty - will be read from environment variables
    password: '', // Leave empty - will be read from environment variables
    secure: false, // InfinityFree typically uses standard FTP
    remoteDir: '/htdocs', // InfinityFree's public HTML directory
  },

  // Local Build Configuration
  local: {
    buildDir: 'dist', // Directory containing built files
    excludePatterns: [
      // Development files
      '.DS_Store',
      'Thumbs.db',
      '.env',
      '.env.local',
      '.env.example',

      // Version control
      '.git',
      '.gitignore',

      // Documentation
      'README.md',
      'BUILD.md',
      'dev-start.md',
      'setup.md',

      // Node.js
      'node_modules',
      'package.json',
      'package-lock.json',

      // Build scripts
      'scripts',
      'deploy.config.js',
      '.github',

      // IDE files
      '.vscode',
      '.idea',
      '*.log',

      // Temporary files
      /^\..*/, // Hidden files
      /.*\.tmp$/, // Temporary files
      /.*\.bak$/, // Backup files
    ],
  },

  // Deployment Options
  options: {
    // Remove files from remote that don't exist locally
    deleteRemoteFiles: false,

    // Backup remote files before deployment
    backupRemoteFiles: false,

    // Parallel uploads (be careful with free hosting limits)
    maxConcurrentUploads: 3,

    // Retry failed uploads
    retryAttempts: 2,

    // Timeout for each file upload (in milliseconds)
    uploadTimeout: 30000,
  },

  // File type specific settings
  fileTypes: {
    // Files to transfer in binary mode
    binary: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.zip', '.ico'],

    // Files to transfer in ASCII mode
    text: ['.html', '.css', '.js', '.json', '.txt', '.md'],
  },

  // InfinityFree specific optimizations
  infinityFree: {
    // InfinityFree has file upload limits
    maxFileSize: 10 * 1024 * 1024, // 10MB limit per file

    // Recommended directory structure for InfinityFree
    directories: {
      public: '/htdocs',        // Main public directory
      assets: '/htdocs/assets', // Static assets
      css: '/htdocs/css',       // Stylesheets
      js: '/htdocs/js',         // JavaScript files
      data: '/htdocs/data',     // Data files
    },

    // Files that must be in root directory
    rootFiles: [
      'index.html',
      'favicon.ico',
      '.htaccess', // If you have Apache configurations
    ],
  },
};