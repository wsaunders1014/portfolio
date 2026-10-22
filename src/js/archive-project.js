const back = document.querySelector('[data-portfolio-return]');
const mobilePortfolio = new URLSearchParams(location.search).get('portfolio') === 'mobile';
back.href = `../../${mobilePortfolio ? 'mobile-flight.html' : 'index.html'}#more-projects`;
const stage = document.querySelector('.archive-stage');
const iframe = stage.querySelector('iframe');
const narrow = matchMedia('(max-width: 800px)');
if (iframe.dataset.mobileSrc) {
  const chooseLayout = () => { iframe.src = narrow.matches ? iframe.dataset.mobileSrc : iframe.dataset.desktopSrc; };
  chooseLayout();
  narrow.addEventListener('change', chooseLayout);
}
function fitArchive() {
  if (!stage.dataset.fixedWidth) return;
  const width = Number(stage.dataset.fixedWidth);
  const height = Number(stage.dataset.fixedHeight);
    const availableHeight = Math.max(280, innerHeight - stage.getBoundingClientRect().top - 24);
    const scale = Math.min(stage.clientWidth / width, availableHeight / height, 1);
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.position = 'absolute';
    iframe.style.left = `${(stage.clientWidth - width * scale) / 2}px`;
    iframe.style.transform = `scale(${scale})`;
    stage.style.height = `${height * scale}px`;
}
if (stage.dataset.fixedWidth) {
  new ResizeObserver(fitArchive).observe(stage);
  window.addEventListener('resize', fitArchive);
  fitArchive();
}
for (const button of document.querySelectorAll('[data-demo-src]')) {
  button.addEventListener('click', () => {
    iframe.src = button.dataset.demoSrc;
    iframe.title = button.textContent;
    if (button.dataset.frameWidth) {
      stage.dataset.fixedWidth = button.dataset.frameWidth;
      stage.dataset.fixedHeight = button.dataset.frameHeight;
      fitArchive();
    }
    for (const item of document.querySelectorAll('[data-demo-src]')) item.setAttribute('aria-pressed', String(item === button));
  });
}
const selector = document.querySelector('#archive-demo');
if (selector) {
  const options = Array.from(selector.options);
  function showPage(option) {
    selector.value = option.value;
    iframe.src = option.value;
    iframe.title = `${option.parentElement.label} / ${option.textContent}`;
    stage.dataset.fixedWidth = option.dataset.frameWidth;
    stage.dataset.fixedHeight = option.dataset.frameHeight;
    fitArchive();
  }
  function restorePage() {
    // Only known gallery entries can become iframe URLs.
    const option = options.find(item => `#${item.dataset.page}` === location.hash);
    showPage(option || options[0]);
  }
  selector.addEventListener('change', () => {
    const option = selector.selectedOptions[0];
    if (location.hash === `#${option.dataset.page}`) return;
    location.hash = option.dataset.page;
  });
  window.addEventListener('hashchange', restorePage);
  restorePage();
}
