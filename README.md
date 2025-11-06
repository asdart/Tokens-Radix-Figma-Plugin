# Token Radix - Figma Plugin

A Figma plugin for generating custom Radix UI color palettes directly in Figma.

## Features

- **Generate Radix-style color scales**: Create 12-step color scales (0-11) for accent and gray colors
- **Light/Dark mode support**: Generate palettes optimized for both light and dark themes
- **Real-time preview**: See your color scales update as you adjust colors
- **Interactive color pickers**: Use native color pickers or enter hex values directly
- **Apply colors to selections**: Click any color swatch to apply it to selected objects in Figma
- **Create color swatches**: Generate rectangles in Figma with all palette colors

## Development

### Setup

1. Install dependencies:
```bash
npm install
```

2. Build the plugin:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

### Loading in Figma

1. Open Figma Desktop app
2. Go to `Plugins` → `Development` → `Import plugin from manifest...`
3. Select the `manifest.json` file in this directory
4. The plugin will appear in your plugins menu

### Usage

1. **Choose theme**: Select Light or Dark mode
2. **Set colors**: 
   - **Accent**: Your primary brand color
   - **Gray**: Your neutral/gray color
   - **Background**: The background color for your design
3. **View palettes**: The plugin automatically generates two 12-step scales:
   - **Accent Scale**: Variations of your accent color
   - **Gray Scale**: Variations of your gray color
4. **Apply colors**:
   - Click any color swatch to apply it to selected objects
   - Or click "Apply to Selection" after selecting a swatch
5. **Create swatches**: Click "Create Swatches in Figma" to generate rectangles with all palette colors

## How It Works

The plugin generates Radix UI-style color scales using HSL color space manipulation:

- **Lightness progression**: Each scale follows Radix's defined lightness steps
- **Saturation adjustment**: Saturation is adjusted based on lightness to ensure accessibility
- **Background adaptation**: Colors are slightly adjusted based on your background color

## Project Structure

- `manifest.json` - Plugin configuration and metadata
- `code.ts` - Main plugin code (runs in Figma sandbox)
- `ui.html` - Plugin UI interface with color generation logic
- `tsconfig.json` - TypeScript configuration

## Building

The TypeScript code (`code.ts`) is compiled to JavaScript (`code.js`) which is referenced in the manifest. Make sure to run `npm run build` before testing in Figma.

## Based On

This plugin is inspired by the [Radix Custom Color tool](https://radix-custom-color.vercel.app) by [maxschulmeister](https://github.com/maxschulmeister/radix-custom-color).
