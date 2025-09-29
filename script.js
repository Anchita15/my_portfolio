/* ===== Helpers ===== */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];
const toastEl = $('#toast');
function showToast(message, t=2500){
  if(!toastEl) return;
  toastEl.textContent = message;
  toastEl.style.display = 'block';
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(()=>toastEl.style.display='none', t);
}

/* ===== Theme toggle ===== */
const THEME_KEY='site-theme';
const htmlEl=document.documentElement;
const themeBtn=$('#themeBtn'), themeBtnMobile=$('#themeBtnMobile');
const themeIcon=$('#themeIcon'), themeIconMobile=$('#themeIconMobile');
const sunSVG='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1M12 20v1M4.2 4.2l.7.7M18.1 18.1l.7.7M1 12h1M22 12h1M4.2 19.8l.7-.7M18.1 5.9l.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z"/>';
const moonSVG='<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
function setTheme(mode){ htmlEl.classList.toggle('dark', mode==='dark'); if(themeIcon) themeIcon.innerHTML = mode==='dark'?sunSVG:moonSVG; if(themeIconMobile) themeIconMobile.innerHTML = mode==='dark'?sunSVG:moonSVG; }
(function initTheme(){ const saved=localStorage.getItem(THEME_KEY); if(saved==='light'||saved==='dark'){ setTheme(saved); } else { const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches; setTheme(prefersDark?'dark':'light'); }})();
function toggleTheme(){ const dark=htmlEl.classList.contains('dark'); const next=dark?'light':'dark'; localStorage.setItem(THEME_KEY,next); setTheme(next); showToast(`Switched to ${next} mode`);}
themeBtn?.addEventListener('click', toggleTheme);
themeBtnMobile?.addEventListener('click', toggleTheme);

/* ===== Mobile menu ===== */
$('#mobileToggle')?.addEventListener('click', ()=> $('#mobilePanel').classList.toggle('hidden'));

/* ===== Hero parallax (subtle) ===== */
(function heroParallax(){
  const avatar = $('#heroAvatar'); if(!avatar) return;
  let range = 9;
  function handle(e){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = avatar.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const dx = (e.clientX - cx) / rect.width;
    avatar.style.transform = `translate3d(${dx*range}px, ${dx*0.2}px, 0) rotate(${dx*1.6}deg)`;
  }
  window.addEventListener('mousemove', handle);
  window.addEventListener('mouseleave', ()=> avatar.style.transform='');
})();

/* ===== Projects ===== */
const projects = [
  {
    id:'proj-hpp',
    title:'House Price Prediction System',
    desc:'Regression pipeline with feature engineering, XGBoost baseline, and a Streamlit UI for interactive predictions.',
    tech:['Python','Pandas','XGBoost','Streamlit','CI/CD'],
    img:'images/house-price-demo.png', // optional screenshot
    demo:'#',
    code:'https://github.com/Anchita15'
  },
  {
    id:'proj-pneumo',
    title:'Pneumonia Detection System',
    desc:'PneumonXNet — CNN for chest X-rays with preprocessing, eval dashboard, and inference API.',
    tech:['TensorFlow','Keras','OpenCV','Python','Docker'],
    img:'images/pneumonia-demo.png',
    demo:'#',
    code:'https://github.com/Anchita15'
  },
  {
    id:'proj-anomaly',
    title:'Anomaly Detection System',
    desc:'Unsupervised anomalies with autoencoders & Isolation Forest; real-time scoring via FastAPI.',
    tech:['PyTorch','scikit-learn','FastAPI','Python','Docker'],
    img:'images/anomaly-demo.png',
    demo:'#',
    code:'https://github.com/Anchita15'
  }
];
const grid = $('#projectsGrid');

function projectCard(p){
  const card = document.createElement('article');
  card.className='card-hover p-4 reveal';
  card.innerHTML = `
    <div class="h-40 rounded-md bg-slate-50 dark:bg-slate-900/40 flex items-center justify-center text-slate-400 dark:text-slate-300 overflow-hidden">
      ${p.img ? `<img src="${p.img}" alt="${p.title} screenshot" class="object-cover w-full h-full" loading="lazy">` : '<span class="text-sm text-muted">Screenshot</span>'}
    </div>
    <h3 class="mt-3 font-semibold high-contrast">${p.title}</h3>
    <p class="mt-2 text-sm text-muted">${p.desc}</p>
    <div class="mt-3 flex flex-wrap gap-2">${p.tech.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    <div class="mt-4 flex gap-2">
      <button class="px-3 py-1 border rounded-md proj-view">View</button>
      <a class="px-3 py-1 rounded-md bg-indigo-600 text-white" href="${p.code}" target="_blank" rel="noopener">Code</a>
    </div>
  `;
  card.querySelector('.proj-view')?.addEventListener('click', ()=>openProjectModal(p.id));
  card.tabIndex=0; card.setAttribute('role','button');
  card.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openProjectModal(p.id); }});
  return card;
}
function renderProjects(){ if(!grid) return; grid.innerHTML=''; projects.forEach(p=>grid.appendChild(projectCard(p))); setupRevealObserver(); }
renderProjects();

/* ===== Modal ===== */
const modal=$('#projectModal'), mTitle=$('#modalTitle'), mDesc=$('#modalDesc'), mTech=$('#modalTech'), mDemo=$('#modalDemo'), mCode=$('#modalCode');
$('#modalClose')?.addEventListener('click', closeProjectModal);
$('#modalBackdrop')?.addEventListener('click', closeProjectModal);
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal && modal.style.display==='flex') closeProjectModal(); });

function openProjectModal(id){
  const p = projects.find(x=>x.id===id); if(!p) return;
  mTitle.textContent=p.title; mDesc.textContent=p.desc;
  mTech.innerHTML = p.tech.map(t=>`<span class="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-sm mr-1">${t}</span>`).join('');
  mDemo.href=p.demo || '#'; mCode.href=p.code || '#';
  modal.style.display='flex'; modal.removeAttribute('aria-hidden');
  document.body.style.overflow='hidden';
}
function closeProjectModal(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

/* ===== Publications ===== */
const pubs = [
  {
    id:'pub1',
    title:'PneumonXNet - A Deep Learning Model for Pneumonia Detection',
    authors:'Harshit Aditya, Anchita Ramani, Nilesh Kumar, Kasturi Singh, Vandana Bhattacharjee',
    venue:'SPARC 2024 · IEEE',
    doi:'10.1109/SPARC61891.2024.10829021',
    bib:`@inproceedings{aditya2024pneumonxnet,
  title={PneumonXNet - A Deep Learning Model for Pneumonia Detection},
  author={Aditya, Harshit and Ramani, Anchita and Kumar, Nilesh and Singh, Kasturi and Bhattacharjee, Vandana},
  booktitle={2024 International Conference on Signal Processing and Advance Research in Computing (SPARC)},
  year={2024},
  publisher={IEEE},
  doi={10.1109/SPARC61891.2024.10829021}
}`
  },
  {
    id:'pub2',
    title:'DDConvNet: A Deep Learning Approach for Driver Drowsiness Detection',
    authors:'Nilesh Kumar, Kasturi Singh, Anchita Ramani, Harshit Aditya, Vandana Bhattacharjee, Sayantani Roy',
    venue:'AIP Conference Proceedings (2025)',
    doi:'10.1063/5.0248451',
    bib:`@article{kumar2025ddconvnet,
  title={DDConvNet: A Deep Learning Approach for Driver Drowsiness Detection},
  author={Kumar, Nilesh and Singh, Kasturi and Ramani, Anchita and Aditya, Harshit and Bhattacharjee, Vandana and Roy, Sayantani},
  journal={AIP Conference Proceedings},
  volume={3253},
  pages={030025},
  year={2025},
  doi={10.1063/5.0248451}
}`
  }
];
const pubList = $('#publicationsList');
function esc(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
function pubItem(p){
  const el = document.createElement('article');
  el.className='card-hover p-4 reveal';
  el.innerHTML = `
    <h3 class="font-semibold high-contrast">${p.title}</h3>
    <p class="mt-1 text-sm text-muted">${p.authors}
      <span class="inline-block ml-2 text-xs px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200">${p.venue}</span>
    </p>
    <p class="mt-2 text-sm text-muted">DOI: <a class="link" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">${p.doi}</a></p>
    <div class="mt-3">
      <div class="flex items-center gap-2">
        <button class="copy-bib inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm" data-id="${p.id}">Copy BibTeX</button>
        <button class="toggle-bib inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm" data-id="${p.id}" aria-expanded="false">Show BibTeX</button>
        <span id="copied-${p.id}" class="ml-2 text-sm text-green-600 dark:text-green-200 hidden">Copied ✓</span>
      </div>
      <div id="bib-${p.id}" class="mt-3 hidden"><pre class="bib">${esc(p.bib)}</pre></div>
    </div>`;
  el.querySelector('.copy-bib').addEventListener('click', ()=>copyBib(p.id));
  el.querySelector('.toggle-bib').addEventListener('click', (e)=>toggleBib(p.id, e.currentTarget));
  return el;
}
function renderPubs(){ if(!pubList) return; pubList.innerHTML=''; pubs.forEach(p=>pubList.appendChild(pubItem(p))); setupRevealObserver(); }
renderPubs();

async function copyBib(id){
  const p=pubs.find(x=>x.id===id); if(!p) return;
  try{ await navigator.clipboard.writeText(p.bib); const c=$(`#copied-${id}`); c.classList.remove('hidden'); setTimeout(()=>c.classList.add('hidden'),1600); showToast('BibTeX copied'); }
  catch{ showToast('Copy failed — select text manually'); }
}
function toggleBib(id,btn){ const b=$(`#bib-${id}`); const show=b.classList.contains('hidden'); b.classList.toggle('hidden',!show); btn.setAttribute('aria-expanded', String(show)); btn.textContent = show? 'Hide BibTeX':'Show BibTeX'; }

/* ===== Reveal on scroll ===== */
function setupRevealObserver(){
  const reveals = $$('.reveal');
  if(!('IntersectionObserver' in window)){ reveals.forEach(r=>r.classList.add('show')); return; }
  const obs = new IntersectionObserver((entries,o)=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('show'); o.unobserve(en.target); } }); }, {threshold:0.12});
  reveals.forEach(r=>obs.observe(r));
}
setupRevealObserver();

/* ===== Contact (Formspree wired to your ID) ===== */
const contactForm=$('#contactForm'), submitBtn=$('#submitBtn'), note=$('#contactNote');
function setNote(msg, kind='info'){ note.textContent=msg; note.classList.remove('success','error'); if(kind==='success') note.classList.add('success'); if(kind==='error') note.classList.add('error'); }

async function handleContactSubmit(e){
  e.preventDefault();
  const name=$('#name').value.trim(), email=$('#email').value.trim(), message=$('#message').value.trim();
  if(!name||!email||!message){ setNote('Please fill all fields.','error'); showToast('Please fill all fields.'); return; }
  submitBtn.disabled=true; submitBtn.style.opacity='.7';
  try{
    const res=await fetch('https://formspree.io/f/mayajgde', {
      method:'POST', headers:{'Accept':'application/json','Content-Type':'application/json'},
      body: JSON.stringify({ name, email, message, _subject:'New portfolio message' })
    });
    if(res.ok){ setNote('Message sent — thank you!','success'); showToast('Message sent'); contactForm.reset(); }
    else { let d=null; try{ d=await res.json(); }catch{}; setNote(d?.error||'Send failed. Check Formspree.', 'error'); showToast('Send failed'); }
  }catch(err){ console.error(err); setNote('Network error. Try again or email me directly.','error'); showToast('Network error'); }
  finally{ submitBtn.disabled=false; submitBtn.style.opacity=''; }
}
contactForm?.addEventListener('submit', handleContactSubmit);

/* ===== Footer year ===== */
$('#year').textContent = new Date().getFullYear();
