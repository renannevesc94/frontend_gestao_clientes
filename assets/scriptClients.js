import clients from "./modules/Clients.js";

const rotaApi = 'http://192.168.1.64:3000'
const Client = clients();


function listenBtnPages() {
  const btnNext = document.querySelector('#pageNext');
  const btnPrevious = document.querySelector('#pagePreviou');
  const btnSearch = document.querySelector('.btnSearch')
  btnSearch.addEventListener('click', () => funcGetClients(false, false,));
  btnNext.addEventListener('click', () => funcGetClients(true, false,));
  btnPrevious.addEventListener('click', () => funcGetClients(false, true));
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
    if (dataSituacao === 'Liberado') {
      bloquearCliente(dataCnpj, { status: 'Bloqueado' })
    } else {
      bloquearCliente(dataCnpj, { status: 'Liberado' })
    }
  }
};

async function bloquearCliente(cnpj, bodyRequest) {
  await Client.updateStatus(cnpj, bodyRequest)
    .then(response => {
      openModalInfo(response.message);
      funcGetClients();
    })
    .catch(error => {
      openModalInfo(error.message);
    });
}

async function deleteCliente(cnpj) {
  Client.deleteCLient(cnpj)
    .then(response => {
      openModalInfo(response.message)
      funcGetClients();
    })
    .catch(erro => {
      openModalInfo(erro.message)
    })
}

function openModalInfo(message) {
  function openModal($el) {
    $el.classList.add('is-active');
  }
  const modal = document.querySelector('#modalInfo');
  const conteudoModal = document.querySelector('#conteudoModal');
  conteudoModal.textContent = message

  openModal(modal);
}
async function funcGetClients(next, previous) {
  const contentPesquisa = document.querySelector('.inptPesquisa').value
  if (contentPesquisa.trim() === '') {
    await Client.getAllClients(next, previous)
      .then(response => {
        let linhas = '';
        response.results.forEach(dado => {

          linhas += `
            <tr>
              <td>${dado.cnpj}</td>
              <td class="has-text-left">${dado.razao}</td>
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
        updateStatus();
      })
      .catch(error => {
        openModalInfo(error.message)
      })
  } else {
    await Client.findClients(contentPesquisa, next, previous)
      .then(response => {
        let linhas = '';
        response.results.forEach(dado => {

          linhas += `
            <tr>
              <td>${dado.cnpj}</td>
              <td class="has-text-left">${dado.razao}</td>
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
        updateStatus();
      })
      .catch(error => {
        openModalInfo(error.message)
      })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  listenBtnPages()
  funcGetClients()
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
  (document.querySelectorAll('.modal-background, .okCloseModal, .modal-close, .modal-card-head .delete, .modal-card-foot .button, #closeModal') || []).forEach(($close) => {
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

  Client.insertClente(bodyRequest)
  .then(response => {
    openModalInfo(response.message)
  })
  .catch(error => {
    openModalInfo(error.message)
  })
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


const btnClosePage = document.querySelector('#btnClosePage');
btnClosePage.addEventListener('click', (event) => {
  localStorage.clear();
  window.location.href = "index.html"
})
