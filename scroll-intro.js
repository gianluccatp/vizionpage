(() => {
  const root = document.documentElement;
  const section = document.querySelector('#scroll-intro');
  const stage = section.querySelector('.scroll-intro-stage');
  const canvas = section.querySelector('canvas');
  const context = canvas.getContext('2d', {alpha:false});
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) return; // The supplied first frame is the static fallback.
  const frames = Array(120);
  const pending = new Map();
  let target = 1, drawn = -1, raf = 0, range = 1, width = 0, height = 0;
  let disposed = false, handingOff = false, revealed = false, fadeTimer;
  const load = index => {
    if (pending.has(index)) return pending.get(index);
    const promise = new Promise(resolve => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = async () => {
        try { await image.decode(); } catch {}
        if (!disposed) { frames[index] = image; if (index === target) schedule(); }
        resolve(image);
      };
      image.onerror = () => resolve(null);
      image.src = `frames/frame-${String(index + 1).padStart(4,'0')}.webp`;
    });
    pending.set(index,promise);
    return promise;
  };
  const draw = index => {
    const image = frames[index];
    if (!image || !context) return false;
    const scale = Math.max(width/image.naturalWidth,height/image.naturalHeight);
    const w = image.naturalWidth*scale, h = image.naturalHeight*scale;
    context.drawImage(image,(width-w)/2,(height-h)/2,w,h);
    canvas.classList.add('ready');
    drawn = index;
    canvas.dataset.frame = String(index + 1);
    return true;
  };
  const resize = () => {
    if(disposed || handingOff) return;
    const bounds = stage.getBoundingClientRect();
    const dpr = devicePixelRatio || 1;
    width = Math.round(bounds.width*dpr); height = Math.round(bounds.height*dpr);
    canvas.width=width;canvas.height=height;
    range=Math.max(1,section.offsetHeight-bounds.height);
    drawn=-1;schedule();
  };
  const render = () => {
    raf=0;
    if(disposed || handingOff) return;
    const progress = Math.max(0,Math.min(1,window.scrollY/range));
    target=Math.max(1,Math.min(119,Math.floor(progress*119)));
    section.classList.toggle("started",window.scrollY>24);
    if (target!==drawn) draw(target); // Keep the previous decoded image until this exact frame is ready.
    if (!frames[target]) load(target);
    if(progress>=1 && drawn===119) requestAnimationFrame(complete);
  };
  function schedule(){if(!raf&&!disposed&&!handingOff)raf=requestAnimationFrame(render);}
  const revealVideo = () => {
    if(revealed) return;
    revealed=true;
    section.classList.add('leaving');
    const remove = () => {
      section.remove();
      root.classList.remove('sequence-active');
      dispose();
    };
    section.addEventListener('transitionend',event=>{if(event.target===section && event.propertyName==='opacity')remove();},{once:true});
    fadeTimer=setTimeout(remove,350);
  };
  const videoReady = () => {
    const video=document.querySelector('#intro-video');
    // Wait for an actual presented video frame, rather than merely loaded metadata.
    if(video && 'requestVideoFrameCallback' in video)video.requestVideoFrameCallback(revealVideo);
    else requestAnimationFrame(()=>requestAnimationFrame(revealVideo));
  };
  const introDone = () => { if(!revealed){section.remove();root.classList.remove('sequence-active');dispose();} };
  function complete(){
    if(disposed || handingOff || drawn!==119 || window.scrollY<range) return;
    handingOff=true;
    section.classList.add('handoff');
    root.classList.add('intro-active');
    window.scrollTo({top:0,left:0,behavior:'instant'});
    document.addEventListener('vizion:video-playing',videoReady,{once:true});
    document.addEventListener('vizion:intro-complete',introDone,{once:true});
    document.dispatchEvent(new Event('vizion:sequence-complete'));
  }
  const motionChanged = event => {
    if(!event.matches || handingOff || disposed) return;
    draw(1); root.classList.remove('sequence-active');root.classList.add('sequence-static');
    window.scrollTo({top:0,left:0,behavior:'instant'});
    dispose();document.dispatchEvent(new Event('vizion:sequence-complete'));
  };
  function dispose(){
    if(disposed)return;
    disposed=true;cancelAnimationFrame(raf);clearTimeout(fadeTimer);
    window.removeEventListener('scroll',schedule);window.removeEventListener('resize',resize);
    window.removeEventListener('orientationchange',resize);window.removeEventListener('pagehide',pageHide);
    preference.removeEventListener('change',motionChanged);
    document.removeEventListener('vizion:video-playing',videoReady);
    document.removeEventListener('vizion:intro-complete',introDone);
    frames.fill(null);pending.clear();
  }
  const pageHide = event => { if(!event.persisted)dispose(); };
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',resize,{passive:true});
  window.addEventListener('orientationchange',resize,{passive:true});window.addEventListener('pagehide',pageHide);
  preference.addEventListener('change',motionChanged);
  resize();
  // Bounded concurrent preload: each supplied URL is requested only once.
  let next=0;
  const worker = async () => {while(next<120 && !disposed){const index=next++;await load(index);}};
  Promise.all(Array.from({length:6},worker));
})();
