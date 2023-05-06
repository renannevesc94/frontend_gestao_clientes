function CreateFetch(headers = {}) {
    const baseRota = 'https://api-gestao-clientes.onrender.com' //Aqui vem a URL padrão da API
    headers = { 'Content-Type': 'application/json' }

    function setAuth(token) {
        headers.Authorization = `Bearer ${token}`
    }

    //FUNÇÃO PRIVADA QUE VAI EXECUTAR O REQUEST COM OS PARAMETROS PASSADOS
    async function requestApi(rota, options = {}) {
        //Criação de um objeto que contam todas as options da consulta na fetch
        const optionsFetch = {
            headers: { ...headers, ...options.header },
            ...options,
            mode: 'cors'
        }
        const response = await fetch(baseRota + rota, optionsFetch);
        if (!response.ok) {
            const dataError = await response.json();
            throw new Error(dataError.message)
        }
        return response.json()
    }

    function get(rota, options, filter) {
        return requestApi(rota, { ...options, method: 'GET' })
    }

    function post(rota, body) {
        return requestApi(rota, { method: 'POST', body: body })
    }

    function put(rota, body) {
        return requestApi(rota, { method: 'PUT', body: body })
    }

    function patch(rota, data) {
        const body = JSON.stringify(data);
        return requestApi(rota, { method: 'PATCH', body: body })
    }

    function deleteClient(rota) {
        return requestApi(rota, { method: 'DELETE' })
    }

    return { get, post, setAuth, patch, deleteClient, put}
}

export default CreateFetch;
