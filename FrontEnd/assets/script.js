addEventListener('DOMContentLoaded', function(){
    const authToken = localStorage.getItem('authToken');
    if(!authToken){
        location.href = 'login.html';
    }else{
        loadid()
        getCategory('Tous');
        logout()
    };
});

function loadid(){
    fetch('http://localhost:5678/api/categories')
    .then(reponse => {
        if(!reponse.ok){
            throw new Error('Connection error');
        }
        return reponse.json();
    }).then((categories)=>{
        let filtrs = document.getElementById('filters');
        let tous = document.createElement('button');
        tous.type = "button";
        tous.textContent = "Tous"
        filtrs.appendChild(tous);
        tous.onclick = () => getCategory('Tous');
        for(categorie of categories){
           let button = document.createElement("button");
           button.textContent = categorie.name + categorie.id;
           button.type = "button";
           filtrs.appendChild(button)
           button.addEventListener('click', (function(id) {
            return function() {
                getCategory(id);
            }
            })(categorie.id));
        }
    }).catch((error)=>{
        alert(error);
    });
}

function getCategory(id){
    document.querySelector('.gallery').innerHTML ='';
    let url = 'http://localhost:5678/api/works';
    if(id != 'Tous'){
        url += `?categoryId=${id}`;
    };
    fetch(url)
    .then((reponse)=>{
        if(!reponse.ok){
            throw new Error('Connection error');
        }
        return reponse.json();
    })
    .then(works => {
        for(work of works){
            if (id === 'Tous' || work.categoryId == id) {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const caption = document.createElement('figcaption');
        
                img.src = work.imageUrl;
                img.alt = work.title;
                caption.textContent = work.title + work.categoryId;
        
                figure.appendChild(img);
                figure.appendChild(caption);
                document.querySelector('.gallery').appendChild(figure);
            }
        }
    }).catch(error => {
        alert(error);
    });
}
function logout(){
    let log = document.getElementById('log');
    log.innerHTML = 'logout';
    log.addEventListener('click', function(){
        localStorage.removeItem('authToken');
    });
    
}



// modifier
function close(){
    let close = document.getElementById('close-modal');
    close.addEventListener('click', ()=>{
        modal.style.display = 'none';
        overlay.style.display = 'none';
    });
}

let btnmodifier = document.querySelector('.modifier');
btnmodifier.addEventListener('click', function(){
    let modal = document.getElementById('modal');
    modal.style.display = 'flex';
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    close();
    fetch('http://localhost:5678/api/works')
    .then((reponse)=>{
        if(!reponse.ok){
            throw new Error('Connection error');
        };
        return reponse.json();
    }).then((works)=>{
        let gallery = document.getElementById('gallery-view');
        for(work of works){
            let content = `
            <div class="contentWithDelet" data-id="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <i onclick="delet(${work.id})" class="fa-solid fa-trash-can"></i>
            </div>
            `;
            if(!gallery.dataset.loadid == true){
                gallery.innerHTML += content;
            }   
        }
        gallery.dataset.loadid = true;
    }).catch((error)=>{
        alert(error);
    });

});


async function delet(id) {
    try{
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
           method: 'DELETE',
           headers:{
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
           }, 
        });
        if(response.ok){
            let itemAtRemove = document.querySelector(`.contentWithDelet[data-id="${id}"]`);
            if(itemAtRemove){
                itemAtRemove.remove();
                getCategory('Tous');
                messages('supprimé avec succès', 'success');
            }
        }else{
            messages(`Une erreur s'est produite lors de la suppression`, 'error')
        }
    }catch(error){
        console.error("Erreur lors de la requête:", error);
        alert('Erreur: Impossible de supprimer l\'élément.');
    }
};

function messages(text, type){
    let modal = document.getElementById('modal');
    let divmessage = document.createElement('div');
    if(type === 'success'){
        divmessage.innerHTML='<i class="fa-solid fa-circle-check"></i>' + text;
    }else{
        divmessage.innerHTML='<i class="fa-solid fa-circle-xmark"></i>' + text;
    }
    divmessage.classList.add('temporary-message', type);
    modal.appendChild(divmessage);
    let modalcontent = document.querySelector('.modal-content');
    modalcontent.classList.add('blur')
    setTimeout(()=>{
        divmessage.style.display = 'none';
        modalcontent.classList.remove('blur');
    }, 3000);
};
