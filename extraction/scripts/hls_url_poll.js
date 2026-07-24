// hls_url_poll.js — v1.0.0
// Recupera las URLs .m3u8 capturadas por hls_interceptor_setup.js.
// Se llama periódicamente (polling) hasta encontrar una URL válida.
(function() {
  try {
    const seen  = new Set();
    const valid = [];

    const _cdnVariant = /^(https?:\/\/.+\/stream\/[^\/]+\/[^\/]+\/\d+\/[^\/]+\/)([^\/]+\.m3u8)$/i;
    function _toMaster(u) {
      const m = _cdnVariant.exec(u);
      if (!m) return u;
      const file = m[2];
      if (file.includes('-') || (file.includes('_') && file !== 'index.m3u8')) {
        return m[1] + 'index.m3u8';
      }
      return u;
    }

    function addUrl(u) {
      const clean = (u || '').trim();
      if (clean.startsWith('http') && clean.toLowerCase().includes('.m3u8') && !seen.has(clean)) {
        const master = _toMaster(clean);
        if (!seen.has(master)) { seen.add(master); valid.unshift(master); }
        if (!seen.has(clean))  { seen.add(clean);  valid.push(clean); }
      }
    }

    // 1) Master playlists capturadas por el interceptor
    (window.__hlsMaster || []).forEach(addUrl);

    // 2) Variants como fallback
    if (valid.length === 0) (window.__hlsVariants || []).forEach(addUrl);

    // 3) Fallback DOM — ignora blob:
    if (valid.length === 0) {
      document.querySelectorAll('video, video source').forEach(el => {
        const src = el.src || el.getAttribute('src') || '';
        if (!src.startsWith('blob:')) addUrl(src);
      });
    }

    // 4) Variables globales de players HLS
    if (valid.length === 0) {
      const hlsVars = [
        'hlsUrl','hls_url','masterUrl','master_url',
        'manifestUrl','manifest_url','streamUrl','stream_url',
        'jwConfig','playerConfig','setupConfig','playerSrc',
        'videoConfig','playerSetup','file','source',
      ];
      for (const name of hlsVars) {
        try {
          const val = window[name];
          if (!val) continue;
          const str    = typeof val === 'string' ? val : JSON.stringify(val);
          const matches = str.match(/https?:\/\/[^"'\s]{10,500}\.m3u8[^"'\s]{0,200}/g);
          if (matches) matches.forEach(addUrl);
        } catch (_) {}
        if (valid.length >= 5) break;
      }
    }

    // 5) Atributos data-* del DOM
    if (valid.length === 0) {
      try {
        document.querySelectorAll('[data-src],[data-url],[data-file],[data-stream],[data-hls]')
          .forEach(el => {
            for (const attr of ['data-src','data-url','data-file','data-stream','data-hls']) {
              const v = el.getAttribute(attr);
              if (v && v.includes('.m3u8')) addUrl(v);
            }
          });
      } catch (_) {}
    }

    return JSON.stringify({ success: valid.length > 0, urls: valid.slice(0, 5) });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
})();
