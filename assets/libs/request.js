function CreateFetch(headers = {}) {
    const baseRota = 'http://192.168.1.64:3000' //Aqui vem a URL padrão da API
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
        console.group(optionsFetch)
        return await fetch(baseRota + rota, optionsFetch)
            .then(async (response) => {
                if (!response.ok) {
                    const dataError = await response.json()
                    throw new Error(dataError.message);
                }
                return response.json()
                
            })
    }

    function get(rota, options) {
      return requestApi(rota, { ...options, method: 'GET' })
    }

    function post(rota, data, options) {
        const body = JSON.stringify(data)
        return requestApi(rota, { ...options, method: 'POST', body: body })
    }

    function patch(rota, data, options){
        const body = JSON.stringify(data);
        console.log(rota)
        return requestApi(rota, {...options, method: 'PATCH', body: body})
    }

    return { get, post, setAuth, patch}
}

export default CreateFetch;

/* 
fetch(rotaApi + url, {
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

        fetch(baseRota + rota, {
            requestOptions,
            headers: headers
        })

 */