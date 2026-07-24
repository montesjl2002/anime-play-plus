// from_window_vars.js — v1.0.0
// Busca URLs en variables globales conocidas de window (players HLS modernos).
// Añade variables aquí cuando aparezcan nuevos players sin publicar APK.
(function() {
  try {
    const urls = [];

    // Variables de cadena directa
    const strVars = [
      'streamUrl','videoUrl','mediaUrl','sourceUrl','videoSrc',
      'hlsUrl','hls_url','masterUrl','master_url','manifestUrl',
      'manifest_url','stream_url','playerSrc','video_url','file',
    ];
    for (const name of strVars) {
      try {
        const v = window[name];
        if (v && typeof v === 'string' && v.startsWith('http') && v.length < 1000) urls.push(v);
      } catch (_) {}
    }

    // jwplayer API
    try {
      if (typeof jwplayer === 'function') {
        const p = jwplayer();
        if (p && p.getPlaylist) {
          const pl = p.getPlaylist();
          if (pl && pl[0] && pl[0].file) urls.push(pl[0].file);
        }
      }
    } catch (_) {}

    // setupConfig / playerConfig / jwConfig como objetos
    const objVars = ['setupConfig','playerConfig','jwConfig','playerSetup','videoConfig'];
    for (const name of objVars) {
      try {
        const val = window[name];
        if (!val) continue;
        const str = typeof val === 'string' ? val : JSON.stringify(val);
        const m = str.match(/https?:\/\/[^"'\s]{10,500}\.m3u8[^"'\s]{0,200}/g);
        if (m) m.forEach(u => urls.push(u));
      } catch (_) {}
    }

    // Videojs
    try {
      if (typeof videojs !== 'undefined') {
        const players = videojs.getAllPlayers ? videojs.getAllPlayers() : [];
        for (const p of players) {
          try {
            const src = p.currentSrc ? p.currentSrc() : null;
            if (src && !src.startsWith('blob:')) urls.push(src);
          } catch (_) {}
        }
      }
    } catch (_) {}

    return JSON.stringify({ success: urls.length > 0, urls: urls.slice(0, 5) });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
})();
