document.getElementById('loginForm').addEventListener('submit', async function(event){
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('passe').value;
    const loginData = {
        email: email,
        password: password,
    };
    try{
        const respons = await fetch('http://localhost:5678/api/users/login', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        if(respons.ok){
            const data = await respons.json();
            localStorage.setItem('authToken', data.token);
            location.href = 'index.html';
        }else{
            document.getElementById('error-message').style.display = 'block';
        }
    }catch(error){
        console.error('Error during login:', error);
    }; 
});

