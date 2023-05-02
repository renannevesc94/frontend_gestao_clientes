import request from "../libs/request.js"


function clients() {
  let previousUrl, nextUrl, findPreviousUrl, findNextUrl;

  let url = '/clientes'
 
  //INSTANCIAR O MUDELE RESPONSÁVEL GERENCIAR AS CONEXÕES FETCH
  const fetchApi = request();
  //PEGAR O TOKEN SALVO NO LOCALSTRAGE PARA PASSAR NAS REQUISIÇÕES HTTP
  function getToken() {
    const token = localStorage.getItem('token');
    return token;
  }
  fetchApi.setAuth(getToken())

  //ATIVAR E DESATIVAR BUTTONS DE PAGINAÇÃO CASO API NÃO RETORNE NEXT E PREVIOUS PAGES
  function updateButtons(_button, option) {
    const button = document.querySelector(_button);
    button.disabled = option
  }


  async function getAllClients(next, previous) {

    try {
      //let url = '/clientes'
      url = next ? nextUrl : (previous ? previousUrl : url);
      const response = await fetchApi.get(url);
      nextUrl = response.nextUrl;
      previousUrl = response.previousUrl;
      nextUrl === null ? updateButtons('#pageNext', true) : updateButtons('#pageNext', false);
      previousUrl === null ? updateButtons('#pagePreviou', true) : updateButtons('#pagePreviou', false);

      return response;
    } catch (error) {
      return error;
    }

  }

  
  async function findClients(filter, _findNextUrl, _findPreviousUrl) {

    try {
      let findUrl = '/clientes/search?filtro='
      findUrl = _findNextUrl ? findNextUrl : (_findPreviousUrl ? findPreviousUrl : findUrl + filter);
      const response = await fetchApi.get(findUrl);
      findNextUrl = response.nextUrl;
      findPreviousUrl = response.previousUrl;
      findNextUrl === null ? updateButtons('#pageNext', true) : updateButtons('#pageNext', false);
      findPreviousUrl === null ? updateButtons('#pagePreviou', true) : updateButtons('#pagePreviou', false);
      return response;
    } catch (error) {
      return(error);
    }

  }

  async function updateStatus(cnpj, data){
    try {
      const rotaApi = `/clientes/${cnpj}`
      return await fetchApi.patch(rotaApi, data)
    } catch (error) {
      return error
    }
  }

  return { getAllClients, findClients, updateStatus };
}

export default clients





  /* 

    const searchCLients = (next, previous,contentPesquisa) => {
      url = next ? nextUrl : (previous ? previousUrl : url);
      const token = localStorage.getItem('token');
      fetch(rotaApi + '/clientes/search?filtro=' + contentPesquisa, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors'
      })
        .then(async (resposta) => {
          if (!resposta.ok) {
            const dataError = await resposta.json();
            throw new Error(dataError.message);
          }
          return resposta.json();
        })
        .then(dados => {
          nextUrl = dados.nextUrl;
          previousUrl = dados.previousUrl;
          nextUrl === null ? desativarButton('#pageNext') : ativarButton('#pageNext');
          previousUrl === null ? desativarButton('#pagePreviou') : ativarButton('#pagePreviou');
  
          let linhas = '';
  
          dados.results.forEach(dado => {
  
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
          openModalInfo(error.message);
        });
    };
    return {
      getAllClients,
      searchCLients
    };
  }

  function updateStatus() {
    const tabelaClientes = document.querySelector('.tabelaClientes');
    tabelaClientes.addEventListener('click', callbackUpdateStatus)
  }
  
const getClients = funcGetClients();

export {getClients};  */