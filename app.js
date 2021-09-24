
//Logueo animacion 
const logueoBtn2 = document.querySelector('.logueoBtn2');
const logueoBtn = document.querySelector('.logueoBtn');
const formularioBox = document.querySelector('.formularioBox');
const body = document.querySelector('body');

logueoBtn2.onclick = function(){
    formularioBox.classList.add('activo')
    body.classList.add('activo')

};
logueoBtn.onclick = function(){
    formularioBox.classList.remove('activo')
    body.classList.remove('activo')

};


//Registracion

const registrarForm = document.querySelector('#formLogueo');

registrarForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const regEmail = document.querySelector('#regEmail').value;
    const regPass = document.querySelector('#regPass').value;
    firebase.auth()
        .createUserWithEmailAndPassword(regEmail, regPass)
        .then(credenciales =>{
            window.location.href = 'dashboard.html';
            registrarForm.querySelector('.error').innerHTML = '';
        })
        .catch(err =>{
            registrarForm.querySelector('.error').innerHTML = err.message;
        })
        
});

//Logueo

const loginFrom = document.querySelector('#ingresar');

loginFrom.addEventListener('submit', e =>{
    e.preventDefault();
    const logMail = document.querySelector('#mail').value;
    const logPass = document.querySelector('#pass').value;

    firebase.auth()
            .signInWithEmailAndPassword(logMail, logPass)
            .then(credenciales =>{
            window.location.href = 'dashboard.html';
            loginFrom.querySelector('.error').innerHTML = '';
        })
            .catch(err=>{
                loginFrom.querySelector('.error').innerHTML = err.message;
            })

})







