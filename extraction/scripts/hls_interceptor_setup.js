// hls_interceptor_setup.js — v1.0.0
// Intercepta XHR, fetch y Blob para capturar URLs .m3u8 antes que el player.
// Se inyecta UNA sola vez al crear el WebView.
(function() {
  if (window.__hlsInterceptorReady) return;
  window.__hlsInterceptorReady = true;
  window.__hlsMaster   = [];
  window.__hlsVariants = [];

  function _classify(url) {
    if (!url) return;
    const s = url.toString();
    if (!s.startsWith('http')) return;
    const lower = s.toLowerCase();
    if (!lower.includes('.m3u8')) return;

    const isVariant = /index-f\d|chunklist|seg-\d|-v\d-a\d/i.test(s);
    if (isVariant) {
      if (!window.__hlsVariants.includes(s)) window.__hlsVariants.push(s);
    } else {
      if (!window.__hlsMaster.includes(s)) window.__hlsMaster.push(s);
    }
  }

  // ── XHR ────────────────────────────────────────────────────────────
  const _OrigXHR = window.XMLHttpRequest;
  function _HLSXHR() {
    const xhr = new _OrigXHR();
    const _origOpen = xhr.open.bind(xhr);
    xhr.open = function(method, url) {
      try { _classify((url || '').toString()); } catch (_) {}
      return _origOpen.apply(xhr, arguments);
    };
    return xhr;
  }
  try {
    Object.setPrototypeOf(_HLSXHR, _OrigXHR);
    _HLSXHR.prototype = _OrigXHR.prototype;
    window.XMLHttpRequest = _HLSXHR;
  } catch (_) {}

  // ── fetch ───────────────────────────────────────────────────────────
  if (typeof window.fetch === 'function') {
    const _origFetch = window.fetch;
    window.fetch = function(input, init) {
      try {
        const u = (typeof input === 'string' ? input
                   : (input && input.url) ? input.url : '').toString();
        _classify(u);
      } catch (_) {}
      return _origFetch.apply(this, arguments);
    };
  }

  // ── Blob tracking ───────────────────────────────────────────────────
  if (typeof URL.createObjectURL === 'function') {
    const _origCOU = URL.createObjectURL;
    URL.createObjectURL = function(obj) {
      window.__hlsBlobActive = true;
      return _origCOU.call(URL, obj);
    };
  }

  // ── MediaSource: detecta SourceBuffer HLS ───────────────────────────
  try {
    const _OrigMS = window.MediaSource;
    if (_OrigMS) {
      const _origAddSB = _OrigMS.prototype.addSourceBuffer;
      _OrigMS.prototype.addSourceBuffer = function(mimeType) {
        if (mimeType && mimeType.toLowerCase().includes('mp2t')) {
          window.__hlsBlobActive = true;
        }
        return _origAddSB.apply(this, arguments);
      };
    }
  } catch (_) {}

  // ── HLS.js: parchear después de que la lib cargue ───────────────────
  function _patchHlsJs() {
    try {
      if (typeof Hls === 'undefined') return;
      if (Hls.__hlsPatched) return;
      Hls.__hlsPatched = true;
      const _origLoad = Hls.prototype.loadSource;
      if (_origLoad) {
        Hls.prototype.loadSource = function(url) {
          _classify(url);
          return _origLoad.apply(this, arguments);
        };
      }
    } catch (_) {}
  }

  _patchHlsJs();
  const _obs = new MutationObserver(() => _patchHlsJs());
  _obs.observe(document.documentElement, { childList: true, subtree: true });
})();
