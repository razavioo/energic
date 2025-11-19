# Silo Level Monitor

A professional, real-time silo level monitoring system with interactive visualization. This application provides a comprehensive dashboard for monitoring bulk material levels in industrial silos with both analog and digital indicators.

## Features

- **Real-time Level Monitoring**: Live visualization of silo fill levels with smooth animations
- **Analog & Digital Indicators**: Dual display system with both analog bar indicator and digital readout
- **Interactive Controls**: Adjustable silo parameters including width, material curvature, and volume
- **Sensor Simulation**: Built-in simulation mode for testing and demonstration
- **Professional UI**: Modern, clean interface with gradient backgrounds and smooth transitions
- **Responsive Design**: Works seamlessly across different screen sizes

## Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **SVG Graphics**: High-quality vector graphics for silo visualization

## Development

This project was developed using:
- **Cursor IDE**: Advanced AI-powered code editor
- **Google's Latest AI Models**: State-of-the-art artificial intelligence models for code generation and assistance

The development process leveraged cutting-edge AI tools to create a professional, production-ready application with clean code architecture and modern best practices.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/razavioo/energic.git

# Navigate to the project directory
cd energic

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Deployment

This project is configured for automatic deployment to GitHub Pages. The deployment workflow is triggered on every push to the `main` branch.

### Manual Deployment

1. Build the project: `npm run build`
2. The `dist` folder contains the static files ready for deployment
3. Configure GitHub Pages to serve from the `dist` directory or use the GitHub Actions workflow

### GitHub Pages

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
- Builds the project on every push to `main`
- Deploys to GitHub Pages
- Updates the live site automatically

## Project Structure

```
energic/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment workflow
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Project dependencies and scripts
└── README.md            # This file
```

## Configuration

The application includes a centralized configuration object (`CONFIG`) that manages:
- Silo dimensions and positioning
- Level offsets and thresholds
- Color schemes
- Animation parameters

## Usage

1. **Adjust Silo Width**: Use the width slider to change the silo's visual width
2. **Material Curvature**: Control the material surface curvature with the curve slider
3. **Volume Settings**: Set the total silo capacity in cubic meters
4. **Level Control**: Manually adjust the fill level or enable simulation mode
5. **Simulation**: Toggle automatic level simulation for demonstration purposes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for use and modification.

## Contributing

Contributions, issues, and feature requests are welcome!

## Author

Developed with assistance from Cursor IDE and Google's latest AI models.

---

**Live Demo**: [View on GitHub Pages](https://razavioo.github.io/energic/)

