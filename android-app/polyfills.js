

// Polyfill FormData if missing to prevent crash on startup
// This is needed because some react-native versions or specific environments
// might not have FormData available globally before it's needed by some libraries.
if (!global.FormData) {
  console.log('Polyfilling FormData');
  global.FormData = class FormData {
    constructor() {
      this._parts = [];
    }
    
    append(key, value) {
      this._parts.push([key, value]);
    }
    
    getParts() {
      return this._parts;
    }
  };
}
