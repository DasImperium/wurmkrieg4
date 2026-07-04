/**
 * Wurm Krieg 3 - Helper Functions
 * 
 * This file contains utility functions used throughout the application.
 * 
 * @author DasImperium
 * @version 1.0.0
 */

/**
 * Format a number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Format a currency value
 * @param {number} value - The currency value
 * @param {string} symbol - The currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, symbol = '🍎') => {
  return `${symbol} ${formatNumber(value)}`;
};

/**
 * Format a percentage value
 * @param {number} value - The value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Clamp a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export const lerp = (start, end, t) => {
  return start + (end - start) * t;
};

/**
 * Check if a point is within a rectangle
 * @param {number} x - X coordinate of point
 * @param {number} y - Y coordinate of point
 * @param {Object} rect - Rectangle object with x, y, width, height
 * @returns {boolean} True if point is within rectangle
 */
export const pointInRect = (x, y, rect) => {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
};

/**
 * Calculate distance between two points
 * @param {number} x1 - X coordinate of first point
 * @param {number} y1 - Y coordinate of first point
 * @param {number} x2 - X coordinate of second point
 * @param {number} y2 - Y coordinate of second point
 * @returns {number} Distance between points
 */
export const distance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Format time in seconds to a readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format time in milliseconds to a readable string
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
export const formatTimeMs = (ms) => {
  return formatTime(Math.floor(ms / 1000));
};

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get a random float between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random float
 */
export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Get a random element from an array
 * @param {Array} array - Array to select from
 * @returns {*} Random element
 */
export const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Check if two rectangles overlap
 * @param {Object} rect1 - First rectangle (x, y, width, height)
 * @param {Object} rect2 - Second rectangle (x, y, width, height)
 * @returns {boolean} True if rectangles overlap
 */
export const rectsOverlap = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

/**
 * Convert HSL to RGB
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {Object} RGB object with r, g, b properties (0-255)
 */
export const hslToRgb = (h, s, l) => {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1/3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1/3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Convert RGB to hex color string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color string
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Generate a random color
 * @returns {string} Random hex color string
 */
export const randomColor = () => {
  return rgbToHex(
    randomInt(0, 255),
    randomInt(0, 255),
    randomInt(0, 255)
  );
};

export default {
  formatNumber,
  formatCurrency,
  formatPercentage,
  generateId,
  clamp,
  lerp,
  pointInRect,
  distance,
  formatTime,
  formatTimeMs,
  randomInt,
  randomFloat,
  shuffleArray,
  randomElement,
  rectsOverlap,
  hslToRgb,
  rgbToHex,
  randomColor,
};
