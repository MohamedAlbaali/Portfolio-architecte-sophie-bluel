let btnmodifier = document.querySelector('.modifier');
const edition = document.querySelector('.edition');
let worksData = []
const authToken = localStorage.getItem('authToken');
let url = 'http://localhost:5678/api/works';
fetch(url)
    .then((reponse) => {
        if (!reponse.ok) {
            throw new Error('Connection error');
        }
        return reponse.json();
    }).then(works =>{
        worksData = works;
        getCategory('Tous');
    })

if (!authToken) {
    // location.href = 'login.html';
    loadid()
    btnmodifier.style.display = 'none';
    edition.style.display = 'none';
} else {
    // loadid()
    logout()
};


function loadid() {
    fetch('http://localhost:5678/api/categories')
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Connection error');
            }
            return reponse.json();
        }).then((categories) => {
            const filtrs = document.getElementById('filters');
            const tous = document.createElement('button');
            tous.type = "button";
            tous.textContent = "Tous";
            filtrs.appendChild(tous);
            tous.addEventListener('click', () => {
                getCategory('Tous');
            })
            for (let categorie of categories) {
                let button = document.createElement("button");
                button.textContent = categorie.name;
                button.type = "button";
                filtrs.appendChild(button)
                button.addEventListener('click', (function () {
                    getCategory(categorie.id);
                })
                );
            }
        }).catch((error) => {
            alert(error);
        });
}

function getCategory(id) {
    document.querySelector('.gallery').innerHTML = '';
    console.log(id)
    console.log(worksData)
    for (let work of worksData) {
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
}
function logout() {
    let log = document.getElementById('log');
    log.innerHTML = 'logout';
    log.addEventListener('click', function () {
        localStorage.removeItem('authToken');
    });

}



// modifier
function close(mod, clo) {
    let close = document.getElementById(clo);
    let overlay = document.getElementById('overlay');
    close.addEventListener('click', () => {
        mod.style.display = 'none';
        overlay.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            mod.style.display = 'none';
            overlay.style.display = 'none';
        }
    });
};

btnmodifier.addEventListener('click', function () {
    let modal = document.getElementById('modal');
    let overlay = document.getElementById('overlay');
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    close(modal, 'close-modal');
    fetch('http://localhost:5678/api/works')
        .then((reponse) => {
            if (!reponse.ok) {
                throw new Error('Connection error');
            };
            return reponse.json();
        }).then((works) => {
            let gallery = document.getElementById('gallery-view');
            for (work of works) {
                let content = `
            <div class="contentWithDelet" data-id="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <i onclick="delet(${work.id})" class="fa-solid fa-trash-can"></i>
            </div>
            `;
                if (!gallery.dataset.loadid == true) {
                    gallery.innerHTML += content;
                }
            }
            gallery.dataset.loadid = true;
        }).catch((error) => {
            alert(error);
        });
    addNewPro()
});


async function delet(id) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        if (response.ok) {
            // let itemAtRemove = document.querySelector(`.contentWithDelet[data-id="${id}"]`);
            worksData = worksData.filter(work => work.id !== id);
            // تحديث العرض
            getCategory('Tous');
            messages('Supprimé avec succès', 'success');
            // if (itemAtRemove) {
            //     itemAtRemove.remove();
            //     getCategory('Tous');
            //     messages('supprimé avec succès', 'success');
            // }
        } else {
            messages(`Une erreur s'est produite lors de la suppression`, 'error')
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
        alert('Erreur: Impossible de supprimer l\'élément.');
    }
};

function messages(text, type) {
    let modal = document.getElementById('modal');
    let divmessage = document.createElement('div');
    if (type === 'success') {
        divmessage.innerHTML = '<i class="fa-solid fa-circle-check"></i>' + text;
    } else {
        divmessage.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>' + text;
    }
    divmessage.classList.add('temporary-message', type);
    document.body.appendChild(divmessage);
    let modalcontent = document.querySelector('.modal-content');
    modalcontent.classList.add('blur')
    setTimeout(() => {
        divmessage.style.display = 'none';
        modalcontent.classList.remove('blur');
    }, 3000);
};

function addNewPro() {
    let addPhoto = document.getElementById('add-photo');
    addPhoto.addEventListener('click', () => {
        let ajoutermodalcontent = document.getElementById('ajoutermodalcontent');
        ajoutermodalcontent.style.display = 'flex';
        let modal = document.getElementById('modal');
        modal.style.display = 'none';
        close(ajoutermodalcontent, 'close-mod');
        retour();
        category()
    });
}


function retour() {
    let retour = document.getElementById('retour');
    retour.addEventListener('click', () => {
        ajoutermodalcontent.style.display = 'none';
        modal.style.display = 'flex';

    });
}

function addPhoto() {
    let remplacefileInput = document.getElementById('remplacefileInput');
    let fileInput = document.getElementById('fileInput');
    let photoContainer = document.getElementById('photoContainer');

    if (remplacefileInput && fileInput) {
        remplacefileInput.addEventListener('click', () => {
            fileInput.click();
        });
    } else {
        console.error("Les boutons ou les entrées ne sont pas présents");
    };

    fileInput.addEventListener('change', () => {
        let messageError = "";
        const maxsize = 4 * 1024 * 1024;
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const filesize = file.size;
            const filetype = file.type;
            if (!['image/jpeg', 'image/png'].includes(filetype)) {
                messageError = "Types de fichiers autorisés: jpeg/png";
                return;
            };
            if (filesize > maxsize) {
                messageError = "La taille maximale du fichier autorisée est de 4 Mo";
                return;
            }
            document.getElementById('error').innerHTML = messageError;
        };
    });
};

function setupPhotoUpload() {
    const remplacefileInput = document.getElementById('remplacefileInput');
    const fileInput = document.getElementById('fileInput');
    const photoContainer = document.getElementById('photoContainer');
    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    remplacefileInput.style.display = 'none';
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    const existingImage = photoContainer.querySelector('img');
                    function clearContainer(container) {
                        while (container.firstChild) {
                            container.removeChild(container.firstChild);
                        }
                    }
                    clearContainer(photoContainer);
                    if (existingImage) {
                        photoContainer.removeChild(existingImage);
                    }

                    photoContainer.appendChild(img);
                };

                reader.readAsDataURL(file);
            } else {
                alert(`Le fichier que vous avez sélectionné n'est pas une image valide.`);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    addPhoto();
    setupPhotoUpload();
});


// Afficher les catégories en ajoutant une nouvelle image
async function category() {
    let select = document.getElementById('select');
    try {
        const response = await fetch('http://localhost:5678/api/categories')
        if (response.ok) {
            let categorys = await response.json()
            for (cat of categorys) {
                select.innerHTML += `
                <option class='opt' id='${cat.id}'>${cat.name}</option>
                `
            };
        } else {
            throw error;
        }
    } catch (error) {
        alert('Erreur lors de la récupération des catégories');
    }
}


// Soumettre un nouveau projet
const titreInput = document.getElementById('titre');
const fileInput = document.getElementById('fileInput');
const select = document.getElementById('select');
const btn = document.querySelector('.btn-valider');

function checkInput() {
    const titreTrue = titreInput.value.trim() !== '';
    const fileTrue = fileInput.files.length > 0;
    const selectTrue = select.selectedIndex !== -1;
    if (titreTrue && fileTrue && selectTrue) {
        btn.style.background = '#1d6154';
        btn.disabled = false;
    } else {
        btn.style.background = '#A7A7A7';
        btn.disabled = true;
    };
};
titreInput.addEventListener('input', checkInput);
fileInput.addEventListener('change', checkInput);
select.addEventListener('change', checkInput);


function Soumettre() {

    btn.addEventListener('click', async () => {
        if (!titreInput || !fileInput.files[0] || !select.selectedIndex === -1) {
            alert('Tous les éléments sont obligatoires');
            return;
        }
        const titre = titreInput.value.trim();
        const selectedOption = select.options[select.selectedIndex];
        const categoryId = selectedOption.id;

        const data = new FormData();
        data.append('title', titre);
        data.append('image', fileInput.files[0])
        data.append('category', categoryId)

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'accept': 'application/json',
                },
                body: data,
            });
            if (response.ok) {
                const result = await response.json();
                worksData.push(result);
                console.log(result);
                document.getElementById('ajoutermodalcontent').style.display = 'none';
                document.getElementById('overlay').style.display = 'none';
                // alert('Projet ajouté avec succès');
                let main = document.querySelector('main');
                main.classList.add('blur')
                setTimeout(() => {
                    main.classList.remove('blur');
                }, 3000);
                messages('Projet ajouté avec succès', 'success')
                getCategory('Tous');
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.message || 'Un problème est survenu'}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            alert('Erreur lors de l\'envoi des données');
        };
    });
}
Soumettre()