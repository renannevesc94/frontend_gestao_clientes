const rotaApi = 'http://127.0.0.1:3000'

async function getClientes() {
  const token = localStorage.getItem('token');
  console.log(token)
  const tabelaClientes = document.querySelector('#tabelaClientes');
  tabelaClientes.removeEventListener('click', updateStatus)
  fetch(rotaApi + '/clientes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    mode: 'cors'
  })
    .then(async resposta => {
      if (!resposta.ok) {
        const dataError = await resposta.json();
        throw new Error(dataError.message)
      }
      return resposta.json();
    })

    .then(dados => {
      let linhas = '';

      dados.forEach(dado => {

        linhas += `
            <tr>
              <td>${dado.cnpj}</td>
              <td>${dado.razao}</td>
              <td>${dado.telefone}</td>
              <td>${dado.contato}</td>
              <td class="situacao has-text-weight-bold has-text-white">${dado.situacao}</td>
              <td> <button class="button is-primary is-small has-text-weight-bold btn-update" data-situacao="${dado.situacao}" data-cnpj="${dado.cnpj}" >Editar</button>
                   <button class="button is-danger is-small btn-delete has-text-weight-bold" data-cnpj="${dado.cnpj}">Excluir</button>
              </td>
            </tr>
          `;
      });
      tabelaClientes.innerHTML = linhas;
      updateStatus()
    })
    .catch(error => {
      alert(error.message)
    })
}


function updateStatus() {
  const tabelaClientes = document.querySelector('.tabelaClientes');
  tabelaClientes.addEventListener('click', callbackUpdateStatus)

}

function callbackUpdateStatus(event) {
  if (event.target.classList.contains('btn-delete')) {
    const dataCnpj = event.target.dataset.cnpj;
    deleteCliente(dataCnpj)
  } else if (event.target.classList.contains('btn-update')) {
    const dataSituacao = event.target.dataset.situacao
    const dataCnpj = event.target.dataset.cnpj
    console.log(dataSituacao)
    if (dataSituacao === 'Liberado') {
      bloquearCliente(dataCnpj, { situacao: 'Bloqueado' })
    } else {
      bloquearCliente(dataCnpj, { situacao: 'Liberado' })
    }
  }
};



async function bloquearCliente(cnpj, bodyRequest) {
  const token = localStorage.getItem('token')
  console.log(token)
  fetch(rotaApi + '/clientes/' + cnpj, {
    method: 'PUT',
    mode: 'cors',
    headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}` 
       },
    body: JSON.stringify(bodyRequest)
  })
    .then(async response => {
      const resposta = await response.json()
      alert(resposta.message)
      getClientes();
    })
    .catch(error => {
      alert(error.message)
    })
}

async function deleteCliente(cnpj) {

  fetch(rotaApi + '/clientes/' + cnpj, {
    method: 'DELETE',
    mode: 'cors'
  })
    .then(async resposta => {
      resposta = await resposta.json();
      alert(resposta.message)
      getClientes();
    })


    .catch(erro => {
      alert(erro.message)
    })
}
document.addEventListener('DOMContentLoaded', () => {
  getClientes()
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button, #closeModal') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

document.querySelector('#formCadastro').addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = localStorage.getItem('token')
  const modal = document.getElementById('modal-js-example');
  function closeModal($el) {
    $el.classList.remove('is-active');
  }
  const formulario = document.querySelector('#formCadastro');
  const dadosFormulario = new FormData(formulario);
  const bodyRequest = {};

  dadosFormulario.forEach((valor, chave) => {
    bodyRequest[chave] = valor
  })

  try {
    const resposta = await fetch(rotaApi + '/clientes/', {
      method: 'POST',
      mode: 'cors',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
        },
      body: JSON.stringify(bodyRequest)
    })
    if (!resposta.ok) {
      const dataErro = await resposta.json();
      throw new Error(dataErro.message)
    } else {
      const dadosResposta = await resposta.json()
      alert(dadosResposta.message);
      closeModal(modal);
      getClientes();
    }

  } catch (erro) {
   alert(erro)
  }
})


// Seleciona o elemento que contém a tabela de clientes
const tabelaClientes = document.querySelector('#tabelaClientes');

// Cria um novo observador
const observer = new MutationObserver((mutations) => {
  // Para cada mutação detectada
  mutations.forEach((mutation) => {
    // Verifica se a mudança ocorreu em um elemento filho da tabela
    if (mutation.target === tabelaClientes && mutation.type === 'childList') {
      // Para cada nó adicionado
      mutation.addedNodes.forEach((node) => {
        // Verifica se é uma linha da tabela
        if (node.nodeName === 'TR') {
          // Para cada célula da linha
          node.childNodes.forEach((cell) => {
            // Verifica se o conteúdo da célula foi alterado
            if (cell.textContent === 'Bloqueado') {
              // Atualiza o estilo da célula
              cell.style.backgroundColor = 'red';
            } else if (cell.textContent === 'Liberado') {
              cell.style.backgroundColor = 'green';
            }
          });
        }
      });
    }
  });
});

// Define as configurações do observador
const config = {
  childList: true, // Observa mudanças nos filhos do elemento alvo
  subtree: true, // Observa mudanças nos filhos dos filhos do elemento alvo
};

// Adiciona o observador ao elemento da tabela
observer.observe(tabelaClientes, config);


