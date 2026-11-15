/* ============================================================
   PREMIUM DIALOG + TOAST — BLUE THEME
   JavaScript đã gắn sự kiện cho button mở dialog
   
   HTML cần có:
   <button id="openBtn">✨ Mở Dialog</button>
   
   <div class="dialog-overlay" id="dialogOverlay">
     <div class="dialog">
       <div class="dialog-header">
         <div class="dialog-icon" id="dialogIcon">✨</div>
         <h2 class="dialog-title" id="dialogTitle">Tiêu đề</h2>
       </div>
       <div class="dialog-body">
         <p class="dialog-message" id="dialogMessage">Mô tả</p>
       </div>
       <div class="dialog-footer">
         <button type="button" class="dialog-btn dialog-btn-cancel" id="dialogCancelBtn">Hủy</button>
         <button type="button" class="dialog-btn dialog-btn-confirm" id="dialogConfirmBtn">Đồng ý</button>
       </div>
     </div>
   </div>
   
   API:
   - showToast('Nội dung', 'success' | 'error' | 'info', 3000)
   - openDialog({ icon, title, message, onConfirm, onCancel })
   - closeDialog()
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     PHẦN 1: TOAST SYSTEM
     ============================================================ */

  let toastTimer = null;

  window.showToast = function (message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Reset toast cũ
    container.innerHTML = '';
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }

    // Tạo toast mới
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => {
        toast.remove();
        toastTimer = null;
      }, 400);
    }, duration);

    toast.addEventListener('click', () => {
      clearTimeout(toastTimer);
      toastTimer = null;
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    });
  };

  /* ============================================================
     PHẦN 2: DIALOG SYSTEM
     ============================================================ */

  let onConfirmCallback = null;
  let onCancelCallback = null;

  function getEls() {
    return {
      overlay: document.getElementById('dialogOverlay'),
      icon: document.getElementById('dialogIcon'),
      title: document.getElementById('dialogTitle'),
      message: document.getElementById('dialogMessage'),
      confirmBtn: document.getElementById('dialogConfirmBtn'),
      cancelBtn: document.getElementById('dialogCancelBtn')
    };
  }

  window.openDialog = function (options = {}) {
    const els = getEls();
    if (!els.overlay) {
      console.warn('[Dialog] Không tìm thấy #dialogOverlay');
      return;
    }

    if (options.icon && els.icon) els.icon.textContent = options.icon;
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

  /* ============================================================
     PHẦN 3: KHỞI TẠO SỰ KIỆN
     ============================================================ */

  document.addEventListener('DOMContentLoaded', () => {
    const els = getEls();
    if (!els.overlay) return;

    // Nút Đồng ý trong dialog
    if (els.confirmBtn) {
      els.confirmBtn.addEventListener('click', () => {
        const cb = onConfirmCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      });
    }

    // Nút Hủy trong dialog
    if (els.cancelBtn) {
      els.cancelBtn.addEventListener('click', () => {
        const cb = onCancelCallback;
        closeDialog();
        if (typeof cb === 'function') cb();
      });
    }

    // Click vùng tối → Hủy
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

    /* ============================================================
       ✅ GẮN SỰ KIỆN CHO BUTTON MỞ DIALOG
       ============================================================ */
    const openBtn = document.getElementById('openBtn');

    if (openBtn) {
      openBtn.addEventListener('click', () => {
        openDialog({
          icon: '✨',
          title: 'Chào mừng!',
          message: 'Bạn có muốn tiếp tục không?',
          onConfirm: () => {
            showToast('Đã đồng ý! Chào mừng bạn 🎉', 'success');
          },
          onCancel: () => {
            showToast('Đã hủy thao tác', 'error');
          }
        });
      });
    }
  });

})();