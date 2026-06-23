const form = document.querySelector('form');
const emailDiv = document.querySelector('#emailErr');
const usernameDiv = document.querySelector('#usernameErr');
const passwordDiv = document.querySelector('#passwordErr');
const confirmPasswordDiv = document.querySelector('#confirmPasswordemailErr');


form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const email = form.email.value;
    const username = form.username.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    emailDiv.textContent = "";
    usernameDiv.textContent = "";
    passwordDiv.textContent = "";
    confirmPasswordDiv.textContent = "";

    //console.log(`${email}, ${username}, ${password}, ${confirmPassword}`)
    try{
        const response = await fetch('/signup',{
            method:'POST',
            body: JSON.stringify({email,username,password,confirmPassword}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await response.json();
        if(data.user){
            location.assign('/');
        }

        if(data.errors){    

            emailDiv.textContent = data.errors.email;
            usernameDiv.textContent = data.errors.username;
            passwordDiv.textContent = data.errors.password;
            confirmPasswordDiv.textContent = data.errors.confirmPassword;
        }

    }catch (err){
        console.log(err);
    }
})