import fetchWrapper from "./libs/fetchApi.js";
const apiFetch = fetchWrapper({})

//CLASSE PARA CRIAÇAO DE USUÁRIO COM MÉTODO PARA VALIDAR SENHA
class Usuario {
    constructor(usuario, senha) {
        this.usuario = usuario;
        this.senha = senha;
    }
    static validaSenha(senha) {
        const regexSenha = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
        return regexSenha.test(senha);
    }

    static validaEmail(email) {
        const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return regexEmail.test(email);
    }
}


//IIFE PARA FAZER A VALIDAÇAO DA SENHA E INFORMAÇAO DO E-MAIL
(function () {
    const inptSenha = document.querySelector('#inptPassword');
    const inptEmail = document.querySelector('#inptEmail');


    // FACTORY FUNCTION PARA ADICIONAR NO DOM INFORMAÇÃO DA SENHA
    function infoSenha() {
        return {
            addInfoSenha: function () {
                const classDiv = document.querySelector('.chkInfo');
                const divExiste = document.querySelector('.infoSenha');
                if (!divExiste) {
                    const novaDiv = document.createElement('div');
                    novaDiv.classList.add('infoSenha')
                    novaDiv.innerHTML = '<p>Mínimo de 8 caracteres (letras e números)</p>';
                    classDiv.insertAdjacentHTML("beforebegin", novaDiv.outerHTML);
                    inptSenha.style.border = '2px solid red';
                }
            },
            removeInfoSenha: function () {
                const divExiste = document.querySelector('.infoSenha');
                inptSenha.style.border = 'none';
                divExiste.remove();
            }
        }
    }
    //INSTANCIANDO OS MÉTODOS DA FACTORY
    const funcInfoSenha = infoSenha();

    //FUNCTION PARA CAPTURAR O INPUT DA SENHA E CHAMAR O MÉTODO DE VALIDAÇAO NA CLASSE Usuario
    function validPassword() {
        let valorSenha = '';
        inptSenha.addEventListener('input', () => {
            valorSenha = inptSenha.value;
            if (Usuario.validaSenha(valorSenha)) {
                funcInfoSenha.removeInfoSenha();
            } else {
                funcInfoSenha.addInfoSenha();
            }
        })
    }

    //FUNCTION PARA VERIFICAR CAMPOS E CRIAR OBJETO NO SUBMIT DO FORMULÁRIO
    function btnSubmit() {
        const form = document.querySelector('.frmLogin');
        let mensagem = '';
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const _user = document.querySelector('#inptEmail');
            if (Usuario.validaEmail(_user.value)) {
                _user.style.border = 'none';
                if (Usuario.validaSenha(inptSenha.value)) {
                    getUsuario();
                } else {
                    mensagem = 'VOCÊ PRECISA INFORMAR UMA SENHA VÁLIDA';
                    inptSenha.style.border = '2px solid red';
                    modal.openModal(mensagem);
                }
            } else {
                mensagem = 'USUÁRIO INVÁLIDO';
                _user.style.border = '2px solid red';
                modal.openModal(mensagem);
            };

        })
    }

    //INSTANCIANDO OS MÉTODOS FACTORY DO MODAL

    validPassword();
    btnSubmit();

})();

//FUNÇÃO PARA MANIPULAR O MODAL DE ERRO NA TELA
function funcModal() {
    const inptSenha = document.querySelector('#inptPassword');
    const inptEmail = document.querySelector('#inptEmail');

    //MONITORAR O EVENTO CLICK NO BOTÃO PARA FECHAR O MODAL DERRO
    document.querySelector('.btnCloseModal').addEventListener('click', () => {
        modal.closeModal();
    });

    //MONITORAR O CLICK NA DIV MODAL PARA FECHAR O MODAL DE ERRO
    document.querySelector('.modal').addEventListener('click', (event) => {
        if (event.target.classList == 'modal') {
            modal.closeModal();
        }
    });

    const divModal = document.querySelector('.modal');
    return {
        //MÉTODO PARA FECHAR O MODAL DE ERRO
        closeModal: () => {
            //ANTES VERIFICO SE A MENSÁGEM É DO CAMPO USUÁRIO PARA DEFINIR ONDE VAI O FOCO
            //APOS FECHAR O MODAL
            if (document.querySelector('.msgModal').textContent.includes('USUÁRIO')) {
                inptEmail.focus();
            } else inptSenha.focus();

            divModal.style.display = 'none';
        },

        //MÉTODO PARA EXIBIR O MODAL DE ERRO
        openModal: (mensagem) => {
            const divPai = document.querySelector('.btnCloseModal');
            const existeDiv = document.querySelector('.msgModal');

            //CONDIÇAO PARA VERIFICAR SE O ELEMENTO DO MODAL FOI CRIADA E SE SIM REMOVER
            if (existeDiv) {
                existeDiv.remove();
            };
            //CRIANDO O ELEMENTO DO MODAL  MONTANDO UM PARAGRAFO COM A MSG QUE VEM NO PARAMETRO
            const msgErro = document.createElement('p');
            msgErro.classList.add('msgModal')
            msgErro.innerHTML = mensagem
            divPai.insertAdjacentHTML("beforebegin", msgErro.outerHTML);
            divModal.style.display = 'grid'
        }
    }
}
const modal = funcModal();

async function getUsuario() {
    let usuario = document.querySelector('#inptEmail').value;
    let senha = document.querySelector('#inptPassword').value;
        const teste = { userName: usuario, senhaUser: senha }
        const rota = '/login'
        const data = JSON.stringify(teste);

        try {
           const response = await apiFetch.post(rota, data) 
            localStorage.setItem('token', response.token);
            window.location.href = "dashboard.html"; 
        } catch (error) {
           modal.openModal(error.message)
        }



        
      
         
        
         
}

