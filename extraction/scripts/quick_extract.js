// quick_extract.js — v1.0.0
// Extracción rápida: elemento video y IDs específicos de Streamtape/Doodstream.
// Retorna string vacío si no encuentra nada (se usa con evaluateJavascript que
// espera un valor de retorno directo, NO un JSON).
(function() {
  try {
    var video = document.querySelector('video');
    if (video) {
      if (video.src && video.src.length > 20 && !video.src.startsWith('blob:')) return video.src;
      if (video.currentSrc && video.currentSrc.length > 20 && !video.currentSrc.startsWith('blob:')) return video.currentSrc;
    }
    var elements = ['botlink', 'ideoolink', 'robotlink'];
    for (var i = 0; i < elements.length; i++) {
      var el = document.getElementById(elements[i]);
      if (el && el.textContent && el.textContent.trim().length > 10) {
        var text = el.textContent.trim();
        if (text.includes('tapepops') || text.includes('get_video')) return text;
      }
    }
    return '';
  } catch (e) { return ''; }
})();
