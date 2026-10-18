const picker = document.querySelector('.film-picker');
const image = document.querySelector('#dreamworks-artwork');
const caption = document.querySelector('#dreamworks-caption');
const films = {
  bilby: {
    src: 'img/dreamworks-bilby-640.webp',
    srcset: 'img/dreamworks-bilby-320.webp 320w, img/dreamworks-bilby-640.webp 640w, img/dreamworks-bilby-1080.webp 1080w',
    alt: 'Bilby and a fluffy baby bird on a rock against a blue sky; original campaign artwork.',
    caption: 'Bilby — a little courage, a little company.'
  },
  'bird-karma': {
    src: 'img/dreamworks-bird-karma-640.webp',
    srcset: 'img/dreamworks-bird-karma-320.webp 320w, img/dreamworks-bird-karma-640.webp 640w, img/dreamworks-bird-karma-1080.webp 1080w',
    alt: 'Bird Karma’s long-beaked bird watching a leaping orange fish; original campaign artwork.',
    caption: 'Bird Karma — a bird, a fish, and a little temptation.'
  }
};
if (picker && image && caption) {
  picker.hidden = false;
  document.querySelector('.dreamworks-fallback').hidden = true;
  picker.addEventListener('click', event => {
    const button = event.target.closest('[data-film]');
    const film = button && films[button.dataset.film];
    if (!film) return;
    image.srcset = film.srcset;
    image.src = film.src;
    image.alt = film.alt;
    caption.textContent = film.caption;
    picker.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
}
