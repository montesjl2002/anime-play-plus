// from_scripts.js — v1.0.0
// Busca URLs dentro del contenido de las primeras etiquetas <script>.
(function() {
  try {
    const scripts = document.querySelectorAll('script[src], script:not([src])');
    const urls = [];
    const maxScripts = Math.min(scripts.length, 10);
    for (let i = 0; i < maxScripts; i++) {
      const script = scripts[i];
      if (!script.src && script.textContent) {
        const len = script.textContent.length;
        if (len > 15000) continue;
        const text = script.textContent.substring(0, 8000);
        const patterns = [
          /streamtape\.com\/get_video\?[^"\s<>]{1,200}/g,
          /tapepops\.com[^"\s<>]{1,200}/g,
          /https?:\/\/[a-z0-9]+\.(cloudatacdn|ds2play|ds2video|dood(?:cdn|api|stream))[^"\s<>]{20,300}/gi,
          /https?:\/\/[^"\s<>]+\?token=[a-z0-9]+&(?:amp;)?expiry=[0-9]{13}/gi,
          /"(https?:\/\/[^"]{1,250}\.(mp4|m3u8|webm)[^"]{0,100})"/g,
          // Patrón CDN /stream/
          /"(https?:\/\/[^"]+\/stream\/[A-Za-z0-9+/=_-]{8,60}\/[a-z0-9]{8,60}\/\d{8,11}\/[^"]+\.m3u8)"/g,
          // HLS genérico en strings dobles
          /"(https?:\/\/[^"]{10,500}\.m3u8(?:\?[^"]{0,200})?)"/g,
          // HLS en strings simples
          /'(https?:\/\/[^']{10,500}\.m3u8(?:\?[^']{0,200})?)'/g,
        ];
        for (let p of patterns) {
          const m = text.match(p);
          if (m) {
            urls.push(...m.slice(0, 2).map(s => s.replace(/['"]/g, '')));
            if (urls.length >= 5) break;
          }
        }
        if (urls.length >= 5) break;
      }
      if (script.src && (script.src.includes('video') || script.src.includes('stream'))) {
        urls.push(script.src);
      }
    }
    return JSON.stringify({ success: urls.length > 0, urls: urls.slice(0, 5) });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
})();
