(() => {
 const root=document.documentElement,overlay=document.querySelector('#vizion-intro'),video=document.querySelector('#intro-video');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let finished=false,closing=false,started=false,startY=null;
 const hint=document.createElement('div');hint.className='video-swipe-hint';hint.innerHTML='<span>Arraste para cima</span><span aria-hidden="true">↑</span>';overlay.appendChild(hint);
 const cleanup=()=>{if(finished)return;finished=true;video.pause();overlay.remove();root.classList.remove('intro-active');document.querySelectorAll('main,footer').forEach(el=>el.inert=false);document.removeEventListener('touchstart',touchStart);document.removeEventListener('touchend',touchEnd);document.removeEventListener('wheel',wheel);document.removeEventListener('keydown',key);reduced.removeEventListener('change',motion);document.dispatchEvent(new Event('vizion:intro-complete'));};
 const finish=()=>{if(finished||closing)return;closing=true;overlay.classList.add('leaving');setTimeout(cleanup,350);};
 const motion=e=>{if(e.matches)cleanup();};
 if(!root.classList.contains('intro-active')||reduced.matches){cleanup();return;}
 reduced.addEventListener('change',motion);
 const lock=()=>{if(!finished)document.querySelectorAll('main,footer').forEach(el=>el.inert=true);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lock,{once:true});else lock();
 const start=()=>{if(started||finished)return;video.muted=true;video.volume=0;const promise=video.play();if(promise)promise.catch(()=>{started=false;hint.hidden=false;hint.querySelector('span').textContent='Arraste para cima para iniciar';});};
 function touchStart(e){startY=e.changedTouches[0]?.clientY;}
 function touchEnd(e){const end=e.changedTouches[0]?.clientY;if(startY!==null&&end!==undefined&&startY-end>25)start();startY=null;}
 function wheel(e){if(e.deltaY>10)start();}
 function key(e){if(['ArrowUp','ArrowDown',' ','Enter'].includes(e.key)){e.preventDefault();start();}}
 document.addEventListener('touchstart',touchStart,{passive:true});document.addEventListener('touchend',touchEnd,{passive:true});
 document.addEventListener('wheel',wheel,{passive:true});document.addEventListener('keydown',key);
 video.removeAttribute('autoplay');video.controls=false;video.muted=true;video.defaultMuted=true;video.playsInline=true;video.volume=0;
 video.defaultPlaybackRate=.75;video.playbackRate=.75;
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=.75;},{once:true});
 video.addEventListener('playing',()=>{started=true;hint.hidden=true;},{once:true});
 video.addEventListener('ended',finish,{once:true});
 video.addEventListener('error',()=>{hint.querySelector('span').textContent='Não foi possível carregar a abertura. Arraste para entrar.';video.play=()=>{finish();return Promise.resolve();};},{once:true});
 video.src=video.dataset.src;video.preload='auto';video.load();
})();
