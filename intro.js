(() => {
 const root=document.documentElement, overlay=document.querySelector('#vizion-intro');
 const video=document.querySelector('#intro-video'), image=document.querySelector('#intro-animation');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,closing=false,fallback=false,timer,safety;
 const cleanup=()=>{if(finished)return;finished=true;clearTimeout(timer);clearTimeout(safety);video.pause();video.removeAttribute('src');video.load();overlay.remove();root.classList.remove('intro-active');document.querySelectorAll('main,footer').forEach(el=>el.inert=false);reduced.removeEventListener('change',motionChanged);document.dispatchEvent(new Event('vizion:intro-complete'));};
 const finish=()=>{if(finished||closing)return;closing=true;overlay.classList.add('leaving');timer=setTimeout(cleanup,350);};
 const motionChanged=e=>{if(e.matches)cleanup();};
 if(!root.classList.contains('intro-active')||reduced.matches){cleanup();return;}
 reduced.addEventListener('change',motionChanged);
 const lock=()=>{if(!finished)document.querySelectorAll('main,footer').forEach(el=>el.inert=true);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lock,{once:true});else lock();
 const useFallback=()=>{
   if(fallback||finished||closing)return;fallback=true;clearTimeout(safety);video.pause();
   image.onload=()=>{if(finished)return;video.hidden=true;image.hidden=false;clearTimeout(safety);timer=setTimeout(finish,5583);};
   image.onerror=finish;safety=setTimeout(finish,15000);image.src=image.dataset.src;
 };
 video.muted=true;video.defaultMuted=true;video.volume=0;video.playsInline=true;video.controls=false;
 video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
 video.defaultPlaybackRate=.75;video.playbackRate=.75;
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=.75;},{once:true});
 video.addEventListener('ended',()=>{if(!fallback)finish();},{once:true});
 video.addEventListener('error',useFallback,{once:true});
 video.addEventListener('playing',()=>{clearTimeout(safety);},{once:true});
 const play=()=>{if(finished||fallback)return;const promise=video.play();if(promise)promise.catch(useFallback);};
 video.addEventListener('canplay',play,{once:true});video.src=video.dataset.src;
 safety=setTimeout(useFallback,12000);play();
})();
