//MODULE RESPONSÁVEIS POR INTERMEDIAR AS MANIPULAÇÕES REFERENTES AOS CLIENES
import request from "./fetchApi.js"

function clients() {
  const fetchApi = request();
  let previousUrl, nextUrl, findPreviousUrl, findNextUrl;

  //FUNCTION PARA PEGAR O TOKEN SALVO NO LOCALSTORAGE NO MOMENTO DO LOGIN
  function getToken() {
    const token = localStorage.getItem('token');
    return token;
  }

  //Passa para a factory que gerencia as conexões fetch o Token que está no loalstorage e persiste ele 
  //em uma clusure para as próximas solicitações.
  fetchApi.setAuth(getToken())

  //ATIVAR E DESATIVAR BUTTONS DE PAGINAÇÃO CASO API NÃO RETORNE NEXT E PREVIOUS PAGES
  function updateButtons(_button, option) {
    const button = document.querySelector(_button);
    button.disabled = option
  }

  async function insertClient(data) {
    try {
      const rotaApi = '/clientes/'
      const body = JSON.stringify(data);
      return await fetchApi.post(rotaApi, body)
    } catch (error) {
      return error
    }
  }

  async function getCliByCnpj(filter) {
    const rotaApi = `/clientes/${filter}`
    return fetchApi.get(rotaApi)

  }

  async function getAllClients(next, previous) {
    try {
      let url = '/clientes'
      url = next ? nextUrl : (previous ? previousUrl : url);
      const response = await fetchApi.get(url);
      nextUrl = response.nextUrl;
      previousUrl = response.previousUrl;
      nextUrl === null ? updateButtons('#pageNext', true) : updateButtons('#pageNext', false);
      previousUrl === null ? updateButtons('#pagePreviou', true) : updateButtons('#pagePreviou', false);
      return response;
    } catch (error) {
      throw error;
    }

  }

  async function findClients(filter, _findNextUrl, _findPreviousUrl, filterCli) {

    try {
      let findUrl = '/clientes/search?filtro='
      findUrl = _findNextUrl ? findNextUrl : (_findPreviousUrl ? findPreviousUrl : `${findUrl}${filter}&status=${filterCli}`);
      const response = await fetchApi.get(findUrl, filterCli);
      findNextUrl = response.nextUrl;
      findPreviousUrl = response.previousUrl;
      findNextUrl === null ? updateButtons('#pageNext', true) : updateButtons('#pageNext', false);
      findPreviousUrl === null ? updateButtons('#pagePreviou', true) : updateButtons('#pagePreviou', false);
      return response;
    } catch (error) {
      throw error
    }

  }

  async function updateClient(bodyRequest){
    try {
      const rotaApi = '/clientes/'+bodyRequest.cnpj
      const body = JSON.stringify(bodyRequest);
      return await fetchApi.put(rotaApi, body)
    } catch (error) {
      return error
    }
  }
  
  async function updateStatus(cnpj, data) {
    try {
      const rotaApi = `/clientes/${cnpj}`
      return await fetchApi.patch(rotaApi, data)
    } catch (error) {
      return error
    }
  }

  async function deleteCLient(cnpj) {
    try {
      const rotaApi = `/clientes/${cnpj}`
      return await fetchApi.deleteClient(rotaApi)
    } catch (error) {
      return error
    }
  }

  return {
    getAllClients,
    findClients,
    updateStatus, 
    deleteCLient, 
    insertClient, 
    getCliByCnpj, 
    updateClient 
  };
}

export default clients
