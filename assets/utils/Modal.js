import updateButton from './updateButtons.js'

function Modal() {
    function openModal(modal) {
      modal.classList.add('is-active');
    }
    function closeModal(modal) {
      modal.classList.remove('is-active');
    }
  
    function listenModal() {
      document.querySelectorAll('.js-modal').forEach(event => {
        const targetModal = event.dataset.modal
        const modal = document.getElementById(targetModal)
  
        event.addEventListener('click', () => {
          openModal(modal);
        })
      })
    }
  
    function listenCloseModal() {
      (document.querySelectorAll('.modal-background, .modal-form,.close-modal ,.okCloseModal, .modal-close, .modal-card-head .delete, .modal-card-foot .button, #closeModal') || []).forEach((event) => {
        const modalClose = event.closest('.modal');
        event.addEventListener('click', () => {
          if(modalClose.id === 'modal-form'){
            updateButton('')
          }
          closeModal(modalClose);
        });
      })
    }

    function openModalInfo(modal, message) {
      const conteudoModal = document.querySelector('#conteudoModal');
      conteudoModal.textContent = message
      openModal(modal);
    }
    return { openModal, closeModal, listenModal, listenCloseModal, openModalInfo }
  }

  export default Modal;












  /*  // Functions to open and close a modal

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      modalForm.closeModal($modal);
    });
  }

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;
    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  }); */