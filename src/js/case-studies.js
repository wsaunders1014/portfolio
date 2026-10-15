const picker = document.querySelector('.film-picker');
const image = document.querySelector('#dreamworks-artwork');
const caption = document.querySelector('#dreamworks-caption');
const films = {
  bilby: {
    src: 'img/dreamworks-bilby.jpg',
    alt: 'Bilby and a fluffy baby bird on a rock against a blue sky; original campaign artwork.',
    caption: 'Bilby — a little courage, a little company.'
  },
  'bird-karma': {
    src: 'img/dreamworks-bird-karma.jpg',
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
    image.src = film.src;
    image.alt = film.alt;
    caption.textContent = film.caption;
    picker.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
}
