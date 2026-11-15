/* ============================================================
   DIALOG + TOAST SYSTEM — JS
   
   HTML cần có:
   <div class="dialog-overlay" id="dialogOverlay">
     <div class="dialog">
       <h2 class="dialog-title" id="dialogTitle">Tiêu đề</h2>
       <p class="dialog-message" id="dialogMessage">Nội dung</p>
       <div class="dialog-actions">
         <button type="button" class="dialog-btn dialog-btn-cancel" id="dialogCancelBtn">Hủy</button>
         <button type="button" class="dialog-btn dialog-btn-confirm" id="dialogConfirmBtn">Đồng ý</button>
       </div>
     </div>
   </div>
   
   API:
   - showToast('Nội dung', 'success' | 'error' | 'info', 3000)
   - openDialog({ title, message, onConfirm, onCancel })
   - closeDialog()
   ============================================================ */

/* ============================================================
   PHẦN 1: TOAST SYSTEM
   ============================================================ */

let toastTimer = null;

function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  container.innerHTML = '';
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
      toastTimer = null;
    }, 300);
  }, duration);

  toast.addEventListener('click', () => {
    clearTimeout(toastTimer);
    toastTimer = null;
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  });
}

/* ============================================================
   PHẦN 2: DIALOG SYSTEM
   ============================================================ */

(function () {
  "use strict";

  let onConfirmCallback = null;
  let onCancelCallback = null;

  function getEls() {
    return {
      overlay: document.getElementById('dialogOverlay'),
      title: document.getElementById('dialogTitle'),
      message: document.getElementById('dialogMessage'),
      confirmBtn: document.getElementById('dialogConfirmBtn'),
      cancelBtn: document.getElementById('dialogCancelBtn')
    };
  }

  window.openDialog = function (options = {}) {
    const els = getEls();
    if (!els.overlay) {
      console.warn('Không tìm thấy #dialogOverlay');
      return;
    }

    if (options.title && els.title) els.title.textContent = options.title;
    if (options.message && els.message) els.message.textContent = options.message;

    onConfirmCallback = options.onConfirm || null;
    onCancelCallback = options.onCancel || null;

    els.overlay.classList.add('show');
    document.body.classList.add('modal-open');
  };

  window.closeDialog = function () {
    const els = getEls();
    if (!els.overlay) return;
    els.overlay.classList.remove('show');
    document.body.classList.remove('modal-open');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const els = getEls();
    if (!els.overlay) return;

    // Nút Đồng ý
    if (els.confirmBtn) {
      els.confirmBtn.addEventListener('click', () => {
        const cb = onConfirmCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      });
    }

    // Nút Hủy
    if (els.cancelBtn) {
      els.cancelBtn.addEventListener('click', () => {
        const cb = onCancelCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      });
    }

    // Click nền → Hủy
    els.overlay.addEventListener('click', (e) => {
      if (e.target === els.overlay) {
        const cb = onCancelCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      }
    });

    // ESC → Hủy
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && els.overlay.classList.contains('show')) {
        const cb = onCancelCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      }
    });
  });
})();