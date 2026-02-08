# Dominion Card Browser

[![Deploy to GitHub Pages](https://github.com/dennisgermany/dominion/actions/workflows/deploy.yml/badge.svg)](https://github.com/dennisgermany/dominion/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live%20site-green)](https://dennisgermany.github.io/dominion/)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite)](https://vitejs.dev/)

A modern, interactive web application for browsing and filtering Dominion card game cards. Built with React and Vite, featuring multi-language support, advanced filtering, and a responsive design.

The application uses `dominion.json` as its data basis, containing all card and edition information.

## ⚠️ Disclaimer

This is a **fan-made project** and is not affiliated with, endorsed by, or associated with the creators or publishers of Dominion. I do not own the rights to Dominion or any of its content. Dominion is a trademark of its respective owners. This application is created for educational and personal use only.

## 🌐 Live Demo

**Browse the application live at: [https://dennisgermany.github.io/dominion/](https://dennisgermany.github.io/dominion/)**

## Features

- 🔍 **Search & Filter**: Search cards by name and filter by edition, card type, and image availability
- 🌍 **Multi-language Support**: Switch between English and German
- 📱 **Responsive Design**: Mobile-friendly interface with collapsible filter menu
- 🎨 **Customizable Display**: Adjust card size and toggle image display
- 📊 **Sorting Options**: Sort cards by name, price, type, or edition (ascending/descending)
- 🖼️ **Custom Image Upload**: Upload your own card images via folder upload in settings
- 🔒 **Optional Password Protection**: Secure access with configurable password authentication
- ⚡ **Fast & Efficient**: Optimized performance with React hooks and memoization

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dominion
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Configuration

### Password Protection

Password protection can be enabled/disabled via environment variables:

1. Create a `.env` file in the root directory:
```env
VITE_REQUIRE_PASSWORD=true
```

2. Set your password in `src/config/auth.js`:
```javascript
export const PASSWORD = 'your-password-here'
```

When `VITE_REQUIRE_PASSWORD` is set to `'true'`, users will be prompted for a password before accessing the application. The authentication state is stored in localStorage.

### Custom Card Images

The application loads card images from two sources:
1. **Default images**: From the `/cards/` folder (e.g., `/cards/{cardId}.jpg`)
2. **Uploaded images**: From IndexedDB (browser storage)

You can upload your own card images to replace the default images. Uploaded images are stored in the browser's IndexedDB and persist across sessions.

**How to upload:**
1. Open the Settings overlay (click the ⚙️ button in the header)
2. Scroll to the "Image Upload" section
3. Click "Upload folder of images" and select a folder containing your card images
4. Images will be automatically matched to cards based on their filenames

**Filename Requirements:**
- **Image filenames must match the card ID** from `dominion.json`
- Card IDs are UUIDs, so images must be named with the full UUID (e.g., `d07e4264-98c8-4677-9492-b743f814eff9.jpg`)
- Supported image formats: JPG, JPEG, PNG, GIF, WebP, BMP

**Image Loading Priority:**
1. First, the app checks IndexedDB for an uploaded image matching the card ID
2. If not found in IndexedDB, it falls back to the default image from `/cards/{cardId}.jpg`
3. Uploaded images in IndexedDB take priority over default images

**Additional Information:**
- Images are stored locally in your browser using IndexedDB
- You can clear all uploaded images using the "Clear uploaded images" button
- The upload count shows how many images you have stored

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally

## Project Structure

```
dominion/
├── src/
│   ├── components/          # React components
│   │   ├── Card.jsx         # Individual card display component
│   │   ├── CardGrid.jsx     # Grid layout for cards
│   │   ├── EditionFilter.jsx
│   │   ├── FilterStats.jsx
│   │   ├── ImageFilter.jsx
│   │   ├── LanguagePicker.jsx
│   │   ├── Login.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SettingsOverlay.jsx
│   │   ├── SortControl.jsx
│   │   └── TypeFilter.jsx
│   ├── config/
│   │   └── auth.js          # Authentication configuration
│   ├── constants/
│   │   └── editionColors.js # Edition color mappings
│   ├── contexts/
│   │   └── LanguageContext.jsx # Language context provider
│   ├── utils/
│   │   └── imageStorage.js  # IndexedDB image storage utilities
│   ├── styles/
│   │   └── App.css          # Main application styles
│   ├── App.jsx              # Main application component
│   └── main.jsx             # Application entry point
├── dominion.json            # Card and edition data
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies
```

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and development server
- **CSS3** - Styling with CSS custom properties

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. The build is configured with a relative base path (`base: './'`), making it suitable for deployment to any subdirectory.

## Development

The application uses:
- React Hooks (useState, useEffect, useMemo, useCallback) for state management
- Context API for language management
- LocalStorage for persisting settings and authentication state
- IndexedDB for storing uploaded card images
- Responsive CSS with mobile-first design principles

## Data Format

Card and edition data is stored in `dominion.json`. The structure includes:
- Cards with properties: id, name (en/de), type, price, etc.
- Editions with properties: id, name (en/de), card_ids array

## License

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Everyone is welcome to improve the data basis (`dominion.json`) via merge requests. Whether it's adding missing cards, correcting information, or improving translations, your contributions help make this project better for everyone.
