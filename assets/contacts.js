(() => {
  'use strict';
  document.querySelectorAll('[data-copy-phone]').forEach(button => {
    button.addEventListener('click', async () => {
      const box = button.closest('[data-copy-box]');
      const status = box.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText('+380957332967');
        status.textContent = button.dataset.copied;
      } catch {
        const field = box.querySelector('input');
        field.hidden = false;
        field.focus();
        field.select();
        status.textContent = button.dataset.manual;
      }
    });
  });
})();
