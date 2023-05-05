
function updateButtonForm(typeButton) {
    let btnUpdate = document.getElementById('btn-cadastrar');
    console.log('CHEGUEI NA UPDATE BUTTONS')
    if (typeButton === 'update') {
      if (btnUpdate) {
        btnUpdate.id = 'btn-update';
        btnUpdate.textContent = 'Atualizar';
        btnUpdate.classList.remove('is-success');
        btnUpdate.classList.add('is-link');
      }
  
    } else {
      btnUpdate = document.getElementById('btn-update');
      if (btnUpdate) {
        btnUpdate.id = 'btn-cadastrar';
        btnUpdate.textContent = 'Cadastrar';
        btnUpdate.classList.remove('is-link');
        btnUpdate.classList.add('is-success');

        document.querySelector('textarea[name="alerta"]').value = ''
        document.querySelector('input[name="cnpj"]').value = '';
        document.querySelector('input[name="razao"]').value = '';
        document.querySelector('input[name="contato"]').value = '';
        document.querySelector('input[name="telefone"]').value = '';

      }
    }
  
  }

  export default updateButtonForm;