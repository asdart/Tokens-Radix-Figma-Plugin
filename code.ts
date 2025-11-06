// This file runs in the Figma plugin sandbox environment
// It cannot access the DOM, but can communicate with the UI via postMessage

figma.showUI(__html__, { 
  width: 500, 
  height: 800
});

// Handler for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'resize') {
    const { width, height } = msg;
    // Enforce minimum and maximum sizes
    const minWidth = 400;
    const minHeight = 600;
    const maxWidth = 1200;
    const maxHeight = 1600;
    
    const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, width));
    const constrainedHeight = Math.max(minHeight, Math.min(maxHeight, height));
    
    figma.ui.resize(constrainedWidth, constrainedHeight);
    return;
  }
  if (msg.type === 'generate-palette') {
    // The palette generation happens in the UI for better performance
    // This handler just receives the palette data
    figma.notify('Palette generated successfully!');
  }
  
  if (msg.type === 'create-style') {
    const { colorName, colorValue, scaleIndex } = msg;
    
    try {
      const color = parseColor(colorValue);
      
      // Create a paint style
      const paintStyle = figma.createPaintStyle();
      paintStyle.name = `${colorName}${scaleIndex !== undefined ? ` ${scaleIndex}` : ''}`;
      paintStyle.paints = [{ type: 'SOLID', color: color }];
      
      figma.notify(`Created style: ${paintStyle.name}`);
      
      // Return success
      figma.ui.postMessage({
        type: 'style-created',
        styleName: paintStyle.name
      });
    } catch (e) {
      figma.notify('Failed to create style');
      figma.ui.postMessage({
        type: 'style-error',
        error: String(e)
      });
    }
  }
  
  if (msg.type === 'apply-color') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a node first');
      return;
    }
    
    const color = parseColor(msg.colorValue);
    
    for (const node of selection) {
      if ('fills' in node) {
        node.fills = [{ type: 'SOLID', color: color }];
      }
    }
    
    figma.notify(`Applied color: ${msg.colorName}`);
  }
  
  if (msg.type === 'apply-to-selection') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a node first');
      return;
    }
    
    const color = parseColor(msg.colorValue);
    
    for (const node of selection) {
      if ('fills' in node) {
        node.fills = [{ type: 'SOLID', color: color }];
      }
    }
    
    figma.notify(`Applied ${msg.colorName}`);
  }
  
  if (msg.type === 'create-rectangles') {
    const { palette, colorName } = msg;
    
    // Create rectangles for each color in the palette
    const rects: SceneNode[] = [];
    const gap = 60;
    const startX = figma.viewport.center.x - (palette.length * gap) / 2;
    
    for (let i = 0; i < palette.length; i++) {
      const rect = figma.createRectangle();
      const color = parseColor(palette[i]);
      
      rect.name = `${colorName} ${i}`;
      rect.fills = [{ type: 'SOLID', color: color }];
      rect.x = startX + i * gap;
      rect.y = figma.viewport.center.y;
      rect.resize(50, 50);
      
      figma.currentPage.appendChild(rect);
      rects.push(rect);
    }
    
    figma.currentPage.selection = rects;
    figma.viewport.scrollAndZoomIntoView(rects);
    figma.notify(`Created ${palette.length} color swatches`);
  }
  
  if (msg.type === 'export-json') {
    const { data } = msg;
    const jsonString = JSON.stringify(data, null, 2);
    
    // Generate filename with timestamp
    const timestamp = Date.now();
    const theme = data.appearance || 'light';
    const filename = `radix-colors-${theme}-${timestamp}.json`;
    
    // Send the JSON string back to UI for download
    figma.ui.postMessage({
      type: 'download-json',
      json: jsonString,
      filename: filename
    });
    
    figma.notify('JSON export ready');
    return;
  }
  
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};

function parseColor(colorString: string): RGB {
  // Parse hex color
  if (colorString.startsWith('#')) {
    const hex = colorString.slice(1);
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    return { r, g, b };
  }
  
  // Parse rgb/rgba format
  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]) / 255,
      g: parseInt(rgbMatch[2]) / 255,
      b: parseInt(rgbMatch[3]) / 255
    };
  }
  
  // Default to black if parsing fails
  return { r: 0, g: 0, b: 0 };
}
