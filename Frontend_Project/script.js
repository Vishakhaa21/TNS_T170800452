const menuBtn=document.querySelector('.menu-btn'), mobileMenu=document.querySelector('.mobile-menu');
menuBtn.addEventListener('click',()=>{const open=document.body.classList.toggle('menu-open');menuBtn.setAttribute('aria-expanded',open);document.body.style.overflow=open?'hidden':'';});
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>{document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');document.body.style.overflow='';}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal,.skill-card,.project,.bring-card,.love-grid article,.achievement-list article,.cert-wrap,.about-layout,.about-close').forEach(el=>observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}}));
const tabs=document.querySelectorAll('.cert-tab'), panels=document.querySelectorAll('.cert-panel');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));panels.forEach(p=>p.classList.remove('active'));tab.classList.add('active');document.getElementById(tab.dataset.cert).classList.add('active');}));
const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');window.addEventListener('pointermove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px';ring.style.left=e.clientX+'px';ring.style.top=e.clientY+'px'});
document.querySelectorAll('a,button,.skill-card,.project').forEach(el=>{el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'))});
document.querySelectorAll('.project').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<850)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1200px) rotateY(${x*2.5}deg) rotateX(${-y*2.5}deg) translateY(-5px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});


/* ===== Enhanced scroll + text motion ===== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress');

  // Turn major content blocks into cinematic scroll reveals.
  const revealTargets = [
    ...document.querySelectorAll('.section-top,.about-heading,.about-layout,.about-close,.love-section,.skills-intro,.skill-orbit,.work-intro,.project,.achievement-title,.achievement-grid,.cert-wrap,.connect-grid,.contact-hook,footer')
  ];
  revealTargets.forEach((el, i) => {
    if (!el.classList.contains('motion-reveal')) el.classList.add('motion-reveal');
    if (i % 5 === 1) el.classList.add('from-left');
    if (i % 5 === 3) el.classList.add('from-right');
  });

  // Stagger children inside groups.
  document.querySelectorAll('.love-grid,.achievement-list,.skill-orbit,.about-copy,.bring,.contact-details').forEach(group => {
    [...group.children].forEach((child, i) => {
      child.classList.add('stagger-item');
      child.style.setProperty('--delay', `${Math.min(i * 90, 540)}ms`);
    });
  });

  if (!reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Keep observing so the effect can replay when scrolling back into view.
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.motion-reveal,.stagger-item').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.motion-reveal,.stagger-item').forEach(el => el.classList.add('is-visible'));
  }

  // Elegant reading progress at the top of the page.
  const updateProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Gentle parallax on the hero image without hijacking normal scrolling.
  const visual = document.querySelector('.hero-visual');
  if (visual && !reduceMotion) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, window.innerHeight);
      visual.style.setProperty('--hero-parallax', `${y * -0.035}px`);
      visual.style.transform = `translateY(calc(var(--hero-parallax, 0px)))`;
    }, { passive: true });
  }
})();


/* ===== Later-section ambient depth ===== */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const sections = document.querySelectorAll('section:not(.hero)');
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    sections.forEach(section => {
      const r = section.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const offset = (center - vh / 2) / vh;
      section.style.setProperty('--section-depth', `${Math.max(-18, Math.min(18, offset * -12))}px`);
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();
