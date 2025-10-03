#!/usr/bin/env node

/**
 * FTP Deployment Script for InfinityFree
 * Builds the project and uploads files via FTP
 */

const ftp = require('basic-ftp');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

class FTPDeployer {
  constructor() {
    this.client = new ftp.Client();
    this.config = this.loadConfig();
    this.deploymentStats = {
      startTime: new Date(),
      uploadedFiles: 0,
      skippedFiles: 0,
      errors: 0,
    };
  }

  loadConfig() {
    const deployConfig = require('../deploy.config.js');

    return {
      host: process.env.FTP_HOST || deployConfig.ftp.host,
      port: process.env.FTP_PORT || deployConfig.ftp.port || 21,
      user: process.env.FTP_USER || deployConfig.ftp.user,
      password: process.env.FTP_PASSWORD || deployConfig.ftp.password,
      secure: process.env.FTP_SECURE === 'true' || deployConfig.ftp.secure || false,
      remoteDir: process.env.FTP_REMOTE_DIR || deployConfig.ftp.remoteDir || '/htdocs',
      localDir: deployConfig.local.buildDir || 'dist',
      excludePatterns: deployConfig.local.excludePatterns || [],
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };

    const prefix = {
      info: 'ℹ',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    console.log(
      `${colors[type]}[${timestamp}] ${prefix[type]} ${message}${colors.reset}`
    );
  }

  shouldExcludeFile(filePath) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(this.config.localDir, filePath);

    return this.config.excludePatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return fileName.includes(pattern) || relativePath.includes(pattern);
      }
      if (pattern instanceof RegExp) {
        return pattern.test(relativePath);
      }
      return false;
    });
  }

  async buildProject() {
    try {
      this.log('🔨 Building project for production...');
      execSync('npm run build:prod', { stdio: 'inherit' });
      this.log('Build completed successfully!', 'success');
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async connectToFTP() {
    try {
      this.log(`🔗 Connecting to FTP server: ${this.config.host}:${this.config.port}`);

      await this.client.access({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        secure: this.config.secure,
      });

      this.log('Connected to FTP server successfully!', 'success');

      // Set binary mode for better file transfer
      await this.client.sendIgnoringError('TYPE I');

    } catch (error) {
      this.log(`FTP connection failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async ensureRemoteDirectory() {
    try {
      this.log(`📁 Ensuring remote directory exists: ${this.config.remoteDir}`);
      await this.client.ensureDir(this.config.remoteDir);
      await this.client.cd(this.config.remoteDir);
      this.log('Remote directory ready', 'success');
    } catch (error) {
      this.log(`Failed to prepare remote directory: ${error.message}`, 'error');
      throw error;
    }
  }

  async uploadFile(localPath, remotePath) {
    try {
      const stats = await fs.stat(localPath);
      const fileSize = (stats.size / 1024).toFixed(2);

      this.log(`📤 Uploading: ${path.basename(localPath)} (${fileSize} KB)`);

      // Ensure parent directory exists before uploading
      const remoteDir = path.posix.dirname(remotePath);
      if (remoteDir !== '.') {
        await this.client.ensureDir(remoteDir);
      }

      await this.client.uploadFrom(localPath, remotePath);
      this.deploymentStats.uploadedFiles++;

    } catch (error) {
      this.log(`Failed to upload ${localPath}: ${error.message}`, 'error');
      this.deploymentStats.errors++;
      throw error;
    }
  }

  async uploadDirectory(localDir, remoteDir = '.') {
    const items = await fs.readdir(localDir, { withFileTypes: true });

    for (const item of items) {
      const localPath = path.join(localDir, item.name);
      const remotePath = path.posix.join(remoteDir, item.name);

      if (this.shouldExcludeFile(localPath)) {
        this.log(`⏭️ Skipping: ${item.name}`, 'warning');
        this.deploymentStats.skippedFiles++;
        continue;
      }

      if (item.isDirectory()) {
        try {
          await this.client.ensureDir(remotePath);
          await this.uploadDirectory(localPath, remotePath);
        } catch (error) {
          this.log(`Failed to process directory ${item.name}: ${error.message}`, 'error');
          this.deploymentStats.errors++;
        }
      } else {
        try {
          await this.uploadFile(localPath, remotePath);
        } catch (error) {
          // Error already logged in uploadFile, just continue
          continue;
        }
      }
    }
  }

  async deploy() {
    try {
      this.log('🚀 Starting FTP deployment to InfinityFree...', 'info');

      // Step 1: Build the project
      await this.buildProject();

      // Step 2: Check if build directory exists
      if (!await fs.pathExists(this.config.localDir)) {
        throw new Error(`Build directory '${this.config.localDir}' does not exist`);
      }

      // Step 3: Connect to FTP
      await this.connectToFTP();

      // Step 4: Ensure remote directory
      await this.ensureRemoteDirectory();

      // Step 5: Upload files
      this.log('📤 Starting file upload...');
      await this.uploadDirectory(this.config.localDir);

      // Step 6: Show deployment summary
      this.showDeploymentSummary();

      this.log('🎉 Deployment completed successfully!', 'success');

    } catch (error) {
      this.log(`💥 Deployment failed: ${error.message}`, 'error');
      process.exit(1);
    } finally {
      this.client.close();
    }
  }

  showDeploymentSummary() {
    const duration = ((new Date() - this.deploymentStats.startTime) / 1000).toFixed(2);

    this.log('\n📊 Deployment Summary:', 'info');
    this.log(`   ✅ Files uploaded: ${this.deploymentStats.uploadedFiles}`);
    this.log(`   ⏭️ Files skipped: ${this.deploymentStats.skippedFiles}`);
    this.log(`   ❌ Errors: ${this.deploymentStats.errors}`);
    this.log(`   ⏱️ Duration: ${duration}s`);

    if (this.deploymentStats.errors > 0) {
      this.log(`\n⚠️ Deployment completed with ${this.deploymentStats.errors} errors`, 'warning');
    }
  }

  static async run() {
    const deployer = new FTPDeployer();
    await deployer.deploy();
  }
}

// Run deployment if called directly
if (require.main === module) {
  FTPDeployer.run().catch(error => {
    console.error('💥 Deployment script failed:', error.message);
    process.exit(1);
  });
}

module.exports = FTPDeployer;