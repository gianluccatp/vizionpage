function initializeVizionPage() {
const dialog = document.querySelector('#quote-dialog');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
document.querySelectorAll('[data-quote]').forEach(button => button.addEventListener('click', () => { dialog.showModal(); nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close(); } });
menuButton.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu'); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));
document.querySelector('#quote-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.target);
  const result = document.querySelector('#quote-result');
  result.value = `Olá, VIZION PAGE! Gostaria de solicitar um orçamento.\n\nNome: ${data.get('name')}\nE-mail: ${data.get('email')}\nProjeto: ${data.get('service')}\n\n${data.get('details')}`;
  result.hidden = false;
  document.querySelector('#copy-request').hidden = false;
  const status = document.querySelector('#form-status');
  status.hidden = false;
  status.textContent = 'Pedido preparado. Revise e envie na conversa do WhatsApp. Você também pode copiar o texto abaixo.';
  window.open('https://wa.me/558291296214?text=' + encodeURIComponent(result.value), '_blank', 'noopener,noreferrer');
  result.focus();
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  const result = document.querySelector('#quote-result');
  try { await navigator.clipboard.writeText(result.value); document.querySelector('#form-status').textContent = 'Pedido copiado. Pronto para compartilhar.'; }
  catch { result.focus(); result.select(); document.querySelector('#form-status').textContent = 'Selecione e copie o texto do pedido.'; }
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), {threshold: .08});
  document.querySelectorAll('.section-heading,.card,.benefit-copy,.product-visual,.project,.process-intro,.steps article,.detail-grid article,.faq-intro,.faq-list,.final-cta').forEach(element => { element.classList.add('reveal'); observer.observe(element); });
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches) {
  document.body.classList.add('motion-on');
  document.querySelectorAll('.cards,.project-grid,.steps,.detail-grid').forEach(group => {
    Array.from(group.children).forEach((item, index) => item.style.setProperty('--delay', `${index * 100}ms`));
  });
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let scrollFrame = 0;
  const updateProgress = () => {
    scrollFrame = 0;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, {passive:true});
  window.addEventListener('resize', updateProgress, {passive:true});
  updateProgress();
  if ('IntersectionObserver' in window) {
    const chartObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('chart-live');
      chartObserver.unobserve(entry.target);
    }), {threshold:.4});
    document.querySelectorAll('.chart').forEach(chart => chartObserver.observe(chart));
  }
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card,.mini-site').forEach(surface => {
      let frame = 0;
      surface.addEventListener('pointermove', event => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const rect = surface.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          surface.style.setProperty('--rx', `${(0.5 - y) * 7}deg`);
          surface.style.setProperty('--ry', `${(x - 0.5) * 9}deg`);
          surface.style.setProperty('--mx', `${x * 100}%`);
          surface.style.setProperty('--my', `${y * 100}%`);
        });
      });
      surface.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        surface.style.setProperty('--rx', '0deg');
        surface.style.setProperty('--ry', '0deg');
      });
    });
  }
  motionPreference.addEventListener('change', event => { if (event.matches) document.body.classList.remove('motion-on'); });
}
}
if (document.documentElement.classList.contains('intro-active') || document.documentElement.classList.contains('sequence-active')) {
  document.addEventListener('vizion:intro-complete', initializeVizionPage, {once:true});
} else {
  initializeVizionPage();
}
