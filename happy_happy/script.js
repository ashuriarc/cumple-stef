// Agregar un efecto bonito en toda la página al cargar. Como ejemplo, un desvanecimiento de corazones(imagen de fondo).

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  body.style.transition = 'background-image 2s ease-in-out';
  body.style.backgroundImage = 'url("https://i.pinimg.com/736x/e8/73/47/e87347aeddaf058d75e59c202517d954.jpg")'; // Asegúrate de tener esta imagen en tu proyecto
  body.style.backgroundSize = 'cover';
});




// Lógica principal del visor de libro

(function(){
  // Variables y referencias
  const pages = Array.from(document.querySelectorAll('.page'));
  const total = pages.length;
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const prog = document.getElementById('prog');
  const indicator = document.getElementById('page-indicator');
  const totalNode = document.getElementById('total-pages');
  const viewer = document.getElementById('viewer');
  const tocBtn = document.getElementById('toc');
  const printBtn = document.getElementById('print');

  totalNode.textContent = total;

  // Detect initial page from hash (#p=1)
  function parseHash(){
    const m = location.hash.match(/p=(\d+)/);
    return m ? Math.max(0, Math.min(total-1, Number(m[1]))) : 0;
  }
  let current = parseHash();

  function showPage(index, pushState = true){
    index = Math.max(0, Math.min(total-1, index));
    pages.forEach(p => p.classList.remove('active'));
    const node = pages[index];
    node.classList.add('active');
    current = index;
    indicator.textContent = 'Página ' + (current+1) + ' / ' + total;
    prog.style.width = ((current+1)/total*100) + '%';
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === total-1);
    // update hash for shareability
    if(pushState){
      location.hash = 'p=' + current;
    }
    // focus for accessibility
    node.setAttribute('tabindex','0');
    node.focus({preventScroll:true});
  }

  // Attach listeners
  prevBtn.addEventListener('click', ()=> showPage(current-1));
  nextBtn.addEventListener('click', ()=> showPage(current+1));

  // Keyboard nav
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft') { showPage(current-1); }
    if(e.key === 'ArrowRight') { showPage(current+1); }
    if(e.key === 'Home') { showPage(0); }
    if(e.key === 'End') { showPage(total-1); }
  });

  // Hash change (back/forward)
  window.addEventListener('hashchange', ()=> {
    const newPage = parseHash();
    if(newPage !== current) showPage(newPage, false);
  });

  // Touch swipe basic support (left/right)
  let startX = null;
  viewer.addEventListener('touchstart', (e)=> {
    startX = e.touches[0].clientX;
  }, {passive:true});
  viewer.addEventListener('touchend', (e)=> {
    if(startX === null) return;
    const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
    const diff = endX - startX;
    if(Math.abs(diff) > 50){
      if(diff < 0) showPage(current+1);
      else showPage(current-1);
    }
    startX = null;
  });

  // TOC (índice) simple: mostrar modal con enlaces (implementación mínima)
  tocBtn.addEventListener('click', ()=> {
    const list = pages.map((p,i) => (i+1) + '. ' + (p.querySelector('h2')?.textContent || 'Capítulo ' + (i+1)));
    const choice = prompt('Índice:\\n\\n' + list.join('\\n') + '\\n\\nEscribe el número del capítulo al que quieras ir:');
    const n = Number(choice);
    if(!isNaN(n) && n >= 1 && n <= total) showPage(n-1);
  });

  // Print / Save
  printBtn.addEventListener('click', ()=> {
    window.print();
  });

  // Init
  showPage(current);

  // Optional: Exponer función para añadir páginas dinámicamente si lo deseas.
  window.book = {
    goTo: showPage,
    current: ()=> current,
    total: total
  };
})();

