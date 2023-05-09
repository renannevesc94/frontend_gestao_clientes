
function updateButtonForm(typeButton) {
    let btnUpdate = document.getElementById('btn-cadastrar');
    let btnCancelar = document.getElementById('btnCancelar');
    if (typeButton === 'update') {
      if (btnUpdate) {
        btnUpdate.id = 'btn-update';
        btnUpdate.textContent = 'Atualizar';
        btnUpdate.classList.remove('is-success');
        btnUpdate.classList.add('is-link');
        btnCancelar.textContent = 'Fechar'
      }
  
    } else {
      btnUpdate = document.getElementById('btn-update');
      if (btnUpdate) {
        btnUpdate.id = 'btn-cadastrar';
        btnUpdate.textContent = 'Cadastrar';
        btnUpdate.classList.remove('is-link');
        btnUpdate.classList.add('is-success');
        btnCancelar.textContent = 'Cancelar'

        document.querySelector('textarea[name="alerta"]').value = ''
        document.querySelector('input[name="cnpj"]').value = '';
        document.querySelector('input[name="razao"]').value = '';
        document.querySelector('input[name="contato"]').value = '';
        document.querySelector('input[name="telefone"]').value = '';

      }
    }
  
  }

  export default updateButtonForm;