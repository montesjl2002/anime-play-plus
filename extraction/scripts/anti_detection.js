// anti_detection.js — v1.0.0
// Enmascara propiedades del navigator para evitar detección de WebView.
// Actualiza este archivo en GitHub para ajustar sin publicar APK.
Object.defineProperty(navigator, 'webdriver', { get: () => false });
Object.defineProperty(navigator, 'plugins',   { get: () => [1, 2, 3, 4, 5] });
Object.defineProperty(navigator, 'languages', { get: () => ['es-ES', 'es', 'en'] });
window.chrome = { runtime: {} };
Object.defineProperty(screen, 'width',  { get: () => 1920 });
Object.defineProperty(screen, 'height', { get: () => 1080 });
