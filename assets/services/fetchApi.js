function CreateFetch(headers = {}) {
    const baseRota = 'https://api-gestao-clientes.onrender.com' //Aqui vem a URL padrão da API
    headers = {...headers,'Content-Type': 'application/json' }

    //Aqui é uma clousure para manter o token durante as requisições
    function setAuth(token) {
        headers.Authorization = `Bearer ${token}`
    }

    //FUNÇÃO PRIVADA QUE VAI EXECUTAR O REQUEST COM OS PARAMETROS PASSADOS
    async function requestApi(rota, options = {}) {
    /*Aqui é criado o objeto que contem as configurações da requisição inclusive o body quando existe 
    o 'Spred Opretor* permite fazer a junção dos parametros fizxos e os recebidos por parametros 
    tanto na instanciação da função e chamada do método */
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

    //Functions que intermediam as requisições a API

    function get(rota, options) {
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
