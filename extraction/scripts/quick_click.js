// quick_click.js — v1.0.0
// Simula clic en el primer botón/elemento de reproducción encontrado.
// Agrega selectores aquí cuando aparezcan nuevos players.
try {
  var selectors = [
    'video',
    'button[data-plyr="play"]',
    '.plyr__control--overlaid',
    '.play-overlay',
    '.video-player',
    '[class*="play"]',
    '[id*="play"]',
  ];
  for (var i = 0; i < selectors.length; i++) {
    var el = document.querySelector(selectors[i]);
    if (el) {
      el.click();
      el.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      el.dispatchEvent(new MouseEvent('mouseup',   {bubbles: true}));
      break;
    }
  }
  var video = document.querySelector('video');
  if (video && video.play) { video.play().catch(() => {}); }
} catch (e) {}
