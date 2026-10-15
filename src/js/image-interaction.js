document.querySelectorAll('img').forEach(image => { image.draggable = false; });

// Delegation also covers images inserted later by galleries or React demos.
document.addEventListener('dragstart', event => {
  if (event.target.closest('img, picture, svg') ||
      (event.target.matches('a') && event.target.querySelector('img, picture, svg'))) {
    event.preventDefault();
  }
}, true);
