# Development Environment Setup & Usage

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

This will:

- Start a live server at `http://localhost:3000`
- Automatically open your browser
- Watch for file changes and auto-reload
- Show file change notifications in console

## 📋 Available Scripts

### Development

- `npm run dev` - Start development server with live reload
- `npm start` - Alias for npm run dev
- `npm run serve` - Start live server only
- `npm run watch` - Watch for file changes only

### Code Quality

- `npm run lint` - Run ESLint and Stylelint
- `npm run lint-js` - Lint JavaScript files only
- `npm run lint-css` - Lint CSS files only
- `npm run format` - Format all files with Prettier

### Build & Optimization

- `npm run build` - Build production version
- `npm run minify` - Minify CSS and JavaScript
- `npm run minify-css` - Minify CSS files only
- `npm run minify-js` - Minify JavaScript files only
- `npm run optimize` - Optimize images

### Deployment

- `npm run deploy` - Deploy to GitHub Pages

## 🔧 Development Features

### Live Reload

- **Automatic browser refresh** when you save any file
- **Hot reloading** for CSS changes (no page refresh needed)
- **File watching** for HTML, CSS, JavaScript, and assets
- **Change notifications** in console

### Code Quality Tools

- **ESLint** for JavaScript linting
- **Stylelint** for CSS linting
- **Prettier** for code formatting
- **Pre-configured rules** for consistent code style

### Build Tools

- **CSS minification** with CleanCSS
- **JavaScript minification** with UglifyJS
- **Image optimization** with imagemin
- **Production builds** ready for deployment

## 🌐 Development Server

**URL**: `http://localhost:3000`

**Features**:

- Live reload on file changes
- Mobile device testing support
- HTTPS support (if needed)
- Custom middleware support
- Detailed logging

## 📁 File Structure During Development

```
Portfolio/
├── node_modules/          # Dependencies (auto-generated)
├── dist/                  # Production build (auto-generated)
├── css/                   # Source stylesheets
├── js/                    # Source JavaScript
├── assets/               # Images, documents, icons
├── package.json          # Project configuration
├── .eslintrc.json        # ESLint configuration
├── .stylelintrc.json     # Stylelint configuration
├── .prettierrc           # Prettier configuration
├── .gitignore           # Git ignore rules
└── dev.config.js        # Development configuration
```

## 🔄 Workflow

### Typical Development Session

1. **Start the dev server**:

   ```bash
   npm run dev
   ```

2. **Make changes** to any file:
   - Edit HTML in `index.html`
   - Modify styles in `css/` folder
   - Update JavaScript in `js/` folder
   - Add images to `assets/images/`

3. **See changes immediately**:
   - Browser auto-refreshes
   - Console shows which file changed
   - No manual refresh needed

4. **Before committing**:

   ```bash
   npm run lint    # Check code quality
   npm run format  # Format code consistently
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 🔍 Debugging

### Console Output

The development server provides detailed console output:

- File change notifications
- Server status and port
- Error messages and warnings
- Performance metrics

### Browser DevTools

- Source maps available for debugging
- Live CSS editing
- JavaScript debugging
- Network monitoring

## 🎯 Tips for Efficient Development

### Hot Tips

- **Keep DevTools open** to see errors immediately
- **Use multiple viewports** to test responsiveness
- **Save frequently** - changes are reflected instantly
- **Check console regularly** for warnings and errors

### Performance Testing

- **Monitor file sizes** during development
- **Test on slow connections** using DevTools
- **Optimize images** before adding to assets
- **Use browser caching** for faster reloads

### Mobile Testing

- **Use DevTools device emulation**
- **Test on real devices** using network IP
- **Check touch interactions**
- **Verify mobile navigation**

## 🚨 Troubleshooting

### Common Issues

**Port already in use**:

```bash
# Kill process using port 3000
npx kill-port 3000
# Or use different port
npm run serve -- --port=3001
```

**Files not watching**:

```bash
# Restart the development server
Ctrl+C
npm run dev
```

**Node modules issues**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Linting errors**:

```bash
# Auto-fix common issues
npm run lint -- --fix
npm run format
```

## 🔒 Production Deployment

Before deploying:

1. **Run build process**:

   ```bash
   npm run build
   ```

2. **Test production build**:

   ```bash
   cd dist
   npx http-server
   ```

3. **Deploy** (choose one):
   - GitHub Pages: `npm run deploy`
   - Netlify: Drag `dist` folder to netlify.com
   - Vercel: Connect GitHub repository

## 📞 Support

If you encounter issues:

1. Check the console for error messages
2. Verify all files are in correct locations
3. Restart the development server
4. Clear browser cache
5. Check Node.js and npm versions

**Requirements**:

- Node.js >= 14.0.0
- npm >= 6.0.0
