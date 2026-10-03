(() => {
 const root=document.documentElement,overlay=document.querySelector('#vizion-intro'),video=document.querySelector('#intro-video');
 const desktop=matchMedia("(min-width:900px)");
 const backdrop=document.createElement("canvas");backdrop.className="intro-backdrop";overlay.prepend(backdrop);
 const context=backdrop.getContext("2d",{alpha:false});let backdropFrame=0;
 const paintBackdrop=()=>{if(finished||video.paused||video.ended||!desktop.matches)return;const w=Math.round(innerWidth*.5),h=Math.round(innerHeight*.5);if(backdrop.width!==w||backdrop.height!==h){backdrop.width=w;backdrop.height=h;}if(video.readyState>=2&&context){const scale=Math.max(w/video.videoWidth,h/video.videoHeight);const dw=video.videoWidth*scale,dh=video.videoHeight*scale;context.drawImage(video,(w-dw)/2,(h-dh)/2,dw,dh);}backdropFrame=requestAnimationFrame(paintBackdrop);};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,closing=false,started=false,starting=false,startY=null,pointerY=null,loadFailed=false,fallback=false,playTimer=0,fallbackTimer=0;
 const hint=overlay.querySelector('.video-swipe-hint');
 const cleanup=()=>{if(finished)return;finished=true;clearTimeout(playTimer);clearTimeout(fallbackTimer);cancelAnimationFrame(backdropFrame);video.pause();overlay.remove();root.classList.remove('intro-active','intro-revealing');document.querySelectorAll('main,footer').forEach(el=>el.inert=false);overlay.removeEventListener('pointerdown',pointerDown);overlay.removeEventListener('pointerup',pointerUp);document.removeEventListener('touchmove',touchMove);document.removeEventListener('touchstart',touchStart);document.removeEventListener('touchend',touchEnd);document.removeEventListener('wheel',wheel);document.removeEventListener('keydown',key);reduced.removeEventListener('change',motion);document.dispatchEvent(new Event('vizion:intro-complete'));};
 const finish=()=>{if(finished||closing)return;closing=true;root.classList.add('intro-revealing');overlay.classList.add('leaving');setTimeout(cleanup,350);};
 const motion=e=>{if(e.matches)cleanup();};
 if(!root.classList.contains('intro-active')||reduced.matches){cleanup();return;}
 reduced.addEventListener('change',motion);
 const lock=()=>{if(!finished)document.querySelectorAll('main,footer').forEach(el=>el.inert=true);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lock,{once:true});else lock();
 const showFallback=()=>{if(finished||closing||fallback||started)return;fallback=true;clearTimeout(playTimer);video.pause();const image=document.createElement('img');image.alt='';image.className='intro-video-fallback';image.style.cssText='position:relative;z-index:1';image.onload=()=>{if(finished)return;video.hidden=true;video.style.display='none';hint.hidden=true;fallbackTimer=setTimeout(finish,5400);};image.onerror=finish;image.src='assets/vizion-intro-lite.webp';overlay.insertBefore(image,hint);};
 const start=()=>{if(started||finished||fallback||starting)return;starting=true;hint.querySelector('span').textContent='Carregando abertura…';if(loadFailed){showFallback();return;}video.muted=true;video.defaultMuted=true;video.playsInline=true;try{const promise=video.play();if(promise)promise.catch(showFallback);playTimer=setTimeout(()=>{if(video.paused||video.currentTime===0)showFallback();},1800);}catch{showFallback();}};
 function touchStart(e){startY=e.changedTouches[0]?.clientY;start();}
 function touchMove(e){const y=e.touches[0]?.clientY;if(startY!==null&&startY-y>12)start();}
 function pointerDown(e){pointerY=e.clientY;if(e.pointerType==="touch"||e.pointerType==="pen")start();}
 function pointerUp(e){if(pointerY!==null&&pointerY-e.clientY>25)start();pointerY=null;}
 function touchEnd(e){const end=e.changedTouches[0]?.clientY;if(!started)start();startY=null;}
 function wheel(e){if(e.deltaY>10)start();}
 function key(e){if(['ArrowUp','ArrowDown',' ','Enter'].includes(e.key)){e.preventDefault();start();}}
 overlay.addEventListener('pointerdown',pointerDown);overlay.addEventListener('pointerup',pointerUp);
 document.addEventListener('touchmove',touchMove,{passive:false});document.addEventListener('touchstart',touchStart,{passive:true});document.addEventListener('touchend',touchEnd,{passive:true});
 document.addEventListener('wheel',wheel,{passive:true});document.addEventListener('keydown',key);
 video.removeAttribute('autoplay');video.controls=false;video.muted=true;video.defaultMuted=true;video.playsInline=true;
 video.defaultPlaybackRate=.75;video.playbackRate=.75;
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=.75;},{once:true});
 video.addEventListener('playing',()=>{if(fallback||finished){video.pause();return;}clearTimeout(playTimer);started=true;starting=false;hint.hidden=true;cancelAnimationFrame(backdropFrame);paintBackdrop();},{once:true});
 video.addEventListener('ended',finish,{once:true});
 video.addEventListener('error',()=>{hint.querySelector('span').textContent='Não foi possível carregar a abertura. Arraste para entrar.';loadFailed=true;},{once:true});
 video.src=video.dataset.src;video.preload='auto';video.load();
})();
