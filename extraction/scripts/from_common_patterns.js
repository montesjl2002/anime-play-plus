// from_common_patterns.js — v1.0.0
// Busca URLs mediante regex sobre el HTML (head + primeros 30k del body).
// Añade patrones regex aquí cuando aparezcan nuevos CDNs sin publicar APK.
(function() {
  try {
    const head      = document.head  ? document.head.innerHTML                        : '';
    const bodyStart = document.body  ? document.body.innerHTML.substring(0, 30000)    : '';
    const text = head + bodyStart;
    const patterns = [
      /streamtape\.com\/get_video\?[^"\s<>]{1,200}/g,
      /tapepops\.com[^"\s<>]{1,200}/g,
      /https?:\/\/[a-z0-9]+\.(cloudatacdn|ds2play|ds2video|dood(?:cdn|api|stream))[^"\s<>]{20,300}/gi,
      /https?:\/\/[^"\s<>]+\?token=[a-z0-9]+&(?:amp;)?expiry=[0-9]{13}/gi,
      /https?:\/\/[a-zA-Z0-9.-]+[^"\s<>]{0,100}\.(mp4|m3u8|webm)[^"\s<>]{0,100}/g,
      // Patrón CDN /stream/
      /https?:\/\/[^"\s<>\/]+\/stream\/[A-Za-z0-9+/=_-]{8,60}\/[a-z0-9]{8,60}\/\d{8,11}\/[^"\s<>\/]+\/[^"\s<>]+\.m3u8/g,
      // HLS genérico con token/expiry
      /https?:\/\/[^"\s<>]{10,500}\.m3u8(?:\?[^"\s<>]{0,200})?/g,
    ];
    const urls = [];
    for (let p of patterns) {
      const m = text.match(p);
      if (m) { urls.push(...m.slice(0, 3)); if (urls.length >= 5) break; }
    }
    return JSON.stringify({ success: urls.length > 0, urls: urls.slice(0, 5) });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
})();
