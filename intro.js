function startVizionIntro() {
  const root = document.documentElement;
  const overlay = document.querySelector('#vizion-intro');
  const video = document.querySelector('#intro-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finished = false;
  let closing = false;
  let startupTimer;
  let stallTimer;
  let exitTimer;
  let lastTime = -1;
  let awaitingGesture = false;
  let touchHint;
  const retryPlayback = () => {if(awaitingGesture)play();};
  const setPageInert = value => document.querySelectorAll('main, footer').forEach(element => { element.inert = value; });
  const cleanup = () => {
    if (finished) return;
    finished = true;
    clearTimeout(startupTimer);
    clearInterval(stallTimer);
    clearTimeout(exitTimer);
    document.removeEventListener("touchstart",retryPlayback);
    document.removeEventListener("touchend",retryPlayback);
    document.removeEventListener("pointerup",retryPlayback);
    document.removeEventListener("keydown",retryPlayback);
    touchHint?.remove();
    root.classList.remove('intro-active');
    setPageInert(false);
    video.pause();
    video.removeAttribute('src');
    video.load();
    overlay.remove();
    reducedMotion.removeEventListener('change', onMotionChange);
    document.dispatchEvent(new Event('vizion:intro-complete'));
  };
  const finish = (immediate = false) => {
    if (finished || closing) return;
    closing = true;
    clearTimeout(startupTimer);
    clearInterval(stallTimer);
    if (immediate || reducedMotion.matches) { cleanup(); return; }
    // Keep the decoded final frame over the already rendered page during the fade.
    overlay.classList.add('leaving');
    overlay.addEventListener('transitionend', event => { if (event.target === overlay && event.propertyName === 'opacity') cleanup(); });
    exitTimer = setTimeout(cleanup, 350);
  };
  function onMotionChange(event) { if (event.matches) cleanup(); }
  if (!root.classList.contains('intro-active') || reducedMotion.matches) { cleanup(); return; }
  reducedMotion.addEventListener('change', onMotionChange);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded', () => { if (!finished) setPageInert(true); }, {once:true});
  else setPageInert(true);
  video.setAttribute("autoplay","");video.setAttribute("muted","");video.setAttribute("playsinline","");video.setAttribute("webkit-playsinline","");video.controls=false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.defaultPlaybackRate = 0.75;
  video.playbackRate = 0.75;
  video.addEventListener('loadedmetadata', () => { video.playbackRate = 0.75; }, {once:true});
  video.addEventListener('ended', () => finish(), {once:true});
  video.addEventListener('error', () => finish(true), {once:true});
  video.addEventListener('playing', () => {
    awaitingGesture=false;touchHint?.remove();
    document.dispatchEvent(new Event('vizion:video-playing'));
    clearTimeout(startupTimer);
    if (stallTimer) return;
    let stalledFor = 0;
    stallTimer = setInterval(() => {
      if (document.hidden) { stalledFor = 0; return; }
      if (video.currentTime === lastTime) stalledFor += 1;
      else stalledFor = 0;
      lastTime = video.currentTime;
      if (stalledFor >= 5) finish(true);
    }, 1000);
  });
  // No request at all for reduced-motion visitors; no persistent session flag.
  if(!video.getAttribute("src"))video.src = video.dataset.src;
  const play = () => {
    if (finished || closing) return;
    const attempt = video.play();
    if (attempt) attempt.catch(error => {
      if(error.name!=="NotAllowedError"){finish(true);return;}
      awaitingGesture=true;clearTimeout(startupTimer);
      
      document.addEventListener("touchstart",retryPlayback,{passive:true});
      document.addEventListener("touchend",retryPlayback,{passive:true});
      document.addEventListener("pointerup",retryPlayback);
      document.addEventListener("keydown",retryPlayback);
      document.dispatchEvent(new Event("vizion:video-playing"));
    });
  };
  video.addEventListener('canplay', play, {once:true});
  video.addEventListener('loadeddata', play, {once:true});
  startupTimer = setTimeout(() => {if(!awaitingGesture)finish(true);}, 12000);
  play();
}
startVizionIntro();
