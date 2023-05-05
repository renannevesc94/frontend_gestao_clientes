import clients from "./services/Clients.js";
import modal from "./utils/Modal.js"
import updateButton from './utils/updateButtons.js'
const Client = clients();
const Modal = modal();

const modalInfo = document.getElementById('modalInfo');
const modalForm = document.getElementById('modal-form')

document.addEventListener('DOMContentLoaded', () => {
  listenBtnPages();
  funcGetClients();
  Modal.listenModal();
  Modal.listenCloseModal();

});

function listenBtnPages() {
  const btnNext = document.querySelector('#pageNext');
  const btnPrevious = document.querySelector('#pagePreviou');
  const btnSearch = document.querySelector('.btnSearch');

  btnSearch.addEventListener('click', () => funcGetClients(false, false,));
  btnNext.addEventListener('click', () => funcGetClients(true, false,));
  btnPrevious.addEventListener('click', () => funcGetClients(false, true));
}

function updateStatus() {
  const tabelaClientes = document.querySelector('.tabelaClientes');
  tabelaClientes.addEventListener('click', callbackUpdateStatus);
}

function callbackUpdateStatus(event) {
  if (event.target.classList.contains('btn-delete')) {
    const dataCnpj = event.target.dataset.cnpj;
    deleteCliente(dataCnpj)
  }
  else if (event.target.classList.contains('btn-update')) {
    const dataSituacao = event.target.dataset.situacao
    const dataCnpj = event.target.dataset.cnpj
    if (dataSituacao === 'Liberado') {
      bloquearCliente(dataCnpj, { status: 'Bloqueado' })
    } else {
      bloquearCliente(dataCnpj, { status: 'Liberado' })
    }
  }
  else if (event.target.classList.contains('btn-edit')) {
    const dataCnpj = event.target.dataset.cnpj;
    editClient(dataCnpj)
  }
};

async function bloquearCliente(cnpj, bodyRequest) {
  await Client.updateStatus(cnpj, bodyRequest)
    .then(response => {
      Modal.openModalInfo(modalInfo, response.message);
      funcGetClients();
    })
    .catch(error => {
      Modal.openModalInfo(modalInfo, error.message);
    });
}

async function deleteCliente(cnpj) {
  Client.deleteCLient(cnpj)
    .then(response => {
      Modal.openModalInfo(modalInfo, response.message);
      funcGetClients();
    })
    .catch(error => {
      Modal.openModalInfo(modalInfo, error.message);
      funcGetClients();
    })
}


function cliFilter() {
  const filter = document.getElementsByName('filterCli');
  for (let i = 0; i < filter.length; i++) {
    if (filter[i].checked) {
      return filter[i].value
    }
  }
}

async function funcGetClients(next, previous) {
  const contentPesquisa = document.querySelector('.inptPesquisa').value
  const filterCli = cliFilter();
  if (contentPesquisa.trim() === '' && filterCli == '') {
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
              <td> <button class="button btn-update is-warning is-small has-text-weight-bold" data-situacao="${dado.situacao}" data-cnpj="${dado.cnpj}" >
                       <i class="fas fa-ban fa-lg btn-update" data-situacao="${dado.situacao}" data-cnpj="${dado.cnpj}" ></i>
                  </button>
                  <button class="button btn-edit is-primary is-small has-text-weight-bold" data-cnpj="${dado.cnpj}">
                    <i class="btn-edit  fas fa-user-edit fa-lg" data-cnpj="${dado.cnpj}"></i>
                  </button>
                  <button class="button is-danger is-small btn-delete has-text-weight-bold" data-cnpj="${dado.cnpj}">
                        <i class="fas fa-trash fa-lg btn-delete"data-cnpj="${dado.cnpj}"></i>
                  </button>
              </td>
            </tr>
          `;
        });
        tabelaClientes.innerHTML = linhas;
        updateStatus();
      })
      .catch(error => {
        Modal.openModalInfo(modalInfo, error.message)
      })
  } else
    findClients(contentPesquisa, next, previous, filterCli)

}
async function findClients(contentPesquisa, next, previous, filterCli) {
  await Client.findClients(contentPesquisa, next, previous, filterCli)
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
      <td> <button class="button btn-update is-warning is-small has-text-weight-bold" data-situacao="${dado.situacao}" data-cnpj="${dado.cnpj}" >
               <i class="fas fa-ban fa-lg btn-update" data-situacao="${dado.situacao}" data-cnpj="${dado.cnpj}" ></i>
          </button>
          <button class="button is-primary  is-small btn-edit has-text-weight-bold" data-cnpj="${dado.cnpj}">
            <i class="btn-edit fas fa-user-edit fa-lg" data-cnpj="${dado.cnpj}"></i>
          </button>
          <button class="button is-danger is-small btn-delete has-text-weight-bold" data-cnpj="${dado.cnpj}">
                <i class="fas fa-trash fa-lg btn-delete"data-cnpj="${dado.cnpj}"></i>
          </button>
      </td>
    </tr>
      `;
      });
      tabelaClientes.innerHTML = linhas;
      updateStatus();
    })
    .catch(error => {
      Modal.openModalInfo(modalInfo, error.message)
    })
}

async function editClient(filter) {
  try {
    const response = await Client.getCliByCnpj(filter);
    const { alerta, cnpj, razao, telefone, contato, situacao} = response.cliente
    Modal.openModal(modalForm)
    document.querySelector('textarea[name="alerta"]').value = alerta;
    document.querySelector('input[name="cnpj"]').value = cnpj;
    document.querySelector('input[name="razao"]').value = razao;
    document.querySelector('input[name="contato"]').value = contato;
    document.querySelector('input[name="telefone"]').value = telefone;
    document.querySelector('input[name="telefone"]').value = telefone;
    document.querySelector(`input[name="situacao"][value="${situacao}"]`).checked = true;
    updateButton('update');
  } catch (error) {
    Modal.openModalInfo(modalInfo, error.message)
  }
}


async function insetClient(){
  try {
    const formulario = document.querySelector('#formCadastro');
    const dadosFormulario = new FormData(formulario);
    const bodyRequest = {};
    dadosFormulario.forEach((valor, chave) => {
      bodyRequest[chave] = valor
    })
    const response = await Client.insertClient(bodyRequest)
    Modal.openModalInfo(modalInfo, response.message)
    
  } catch (error) {

    Modal.openModalInfo(modalInfo, error)
  }
}

async function updateClient(){
  try {
    const formulario = document.querySelector('#formCadastro');
    const dadosFormulario = new FormData(formulario);
    const bodyRequest = {};
    dadosFormulario.forEach((valor, chave) => {
      bodyRequest[chave] = valor
    })
    const response = await Client.updateClient(bodyRequest)
    Modal.openModalInfo(modalInfo, response.message)
    
  } catch (error) {
    Modal.openModalInfo(modalInfo, error.message)
  }
 

}

const btnSubmit = document.querySelector('#btn-cadastrar')
btnSubmit.addEventListener('click', async (event) => {
  event.preventDefault();
  const updateOrInsert = event.target.id;
  if(updateOrInsert === 'btn-update'){
    updateClient()
  } else {
    insetClient();
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


const btnClosePage = document.querySelector('#btnClosePage');
btnClosePage.addEventListener('click', (event) => {
  localStorage.clear();
  window.location.href = "index.html"
})
