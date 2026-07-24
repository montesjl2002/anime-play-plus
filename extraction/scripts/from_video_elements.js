// from_video_elements.js — v1.0.0
// Extrae src/currentSrc de todos los elementos <video> y <source>.
// Retorna JSON: { success: bool, urls: string[] }
(function() {
  try {
    const videos   = document.querySelectorAll('video');
    const urls     = [];
    const maxVideos = Math.min(videos.length, 10);
    for (let i = 0; i < maxVideos; i++) {
      const video = videos[i];
      if (video.src && video.src.length > 20 && !video.src.startsWith('blob:'))
        urls.push(video.src);
      if (video.currentSrc && video.currentSrc.length > 20 && !video.currentSrc.startsWith('blob:'))
        urls.push(video.currentSrc);
      const sources = video.querySelectorAll('source');
      for (let j = 0; j < Math.min(sources.length, 5); j++) {
        const s = sources[j];
        if (s.src && s.src.length > 20 && !s.src.startsWith('blob:')) urls.push(s.src);
      }
      for (let attr of ['data-src','data-url','data-video','data-hls','data-stream']) {
        const val = video.getAttribute(attr);
        if (val && val.length > 20 && val.startsWith('http')) urls.push(val);
      }
      if (urls.length > 0) break;
    }
    return JSON.stringify({ success: urls.length > 0, urls: urls.slice(0, 3) });
  } catch (e) {
    return JSON.stringify({ success: false, error: e.toString() });
  }
})();
