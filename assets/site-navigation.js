'use strict';
document.querySelectorAll('.sadage-navigation').forEach(menu => {
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
      event.stopPropagation();
    }
  });
});
