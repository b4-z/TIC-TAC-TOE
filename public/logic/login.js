const form = document.querySelector('form');
const usernameDiv = document.querySelector('#usernameErr');
const passwordDiv = document.querySelector('#passwordErr');
form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const username = form.username.value;
    const password = form.password.value;
    
    usernameDiv.textContent = "";
    passwordDiv.textContent = "";

    try {
        const response = await fetch('/login',{
            method: "POST",
            body: JSON.stringify({username,password}),
            headers: {'Content-Type': 'application/json'}
        })
        const data = await response.json();
        if(data.user){
            location.assign('/');

        }

        if(data.errors){    

            usernameDiv.textContent = data.errors.username;
            passwordDiv.textContent = data.errors.password;
        }

    } catch (error) {
        console.log(error);
    }
})