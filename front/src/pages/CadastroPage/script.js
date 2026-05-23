import { cadastrarNovaCredencial, CREDENTIALS } from "../../controller/authController.js"

window.onload = () => {
    const formElement = document.querySelector('form')
    const registrarBtn = document.getElementById('registrar')

    formElement.addEventListener('submit', (e) => {
        e.preventDefault()

        const dataFromForm = new FormData(formElement)
        const dados = Object.fromEntries(dataFromForm.entries())

        if (dados.password != dados.confirm_password) {
            alert("A senha de confirmação deve ser idêntica a senha original")
            document.getElementById('register-error').style.display = 'block'
        } else {
            document.getElementById('register-error').style.display = 'none'
            console.log('mando')
            cadastrarNovaCredencial(dados.profile, dados.user, dados.password )
        } 


    })

}

