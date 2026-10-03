(() => {
  const root=document.documentElement;
  const overlay=document.querySelector('#vizion-intro');
  const image=document.querySelector('#intro-animation');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let finished=false, timer, safety;
  const finish=()=>{if(finished)return;finished=true;clearTimeout(timer);clearTimeout(safety);
    overlay.remove();root.classList.remove('intro-active');
    document.querySelectorAll('main,footer').forEach(el=>el.inert=false);
    reduced.removeEventListener('change',motionChanged);
    document.dispatchEvent(new Event('vizion:intro-complete'));
  };
  const motionChanged=e=>{if(e.matches)finish();};
  if(!root.classList.contains('intro-active')||reduced.matches){finish();return;}
  reduced.addEventListener('change',motionChanged);
  const lock=()=>{if(!finished)document.querySelectorAll('main,footer').forEach(el=>el.inert=true);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',lock,{once:true});else lock();
  image.addEventListener('load',()=>{
    clearTimeout(safety);
    timer=setTimeout(()=>{overlay.classList.add('leaving');timer=setTimeout(finish,350);},5333);
  },{once:true});
  image.addEventListener('error',finish,{once:true});
  safety=setTimeout(finish,15000);
  image.src=image.dataset.src;
})();
