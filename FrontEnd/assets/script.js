let btnmodifier = document.querySelector('.modifier');
const edition = document.querySelector('.edition');
let worksData = [];
const authToken = localStorage.getItem('authToken');
let api = 'http://localhost:5678/api/';
const defaultCategory = 'Tous'
fetch(`${api}works`)
    .then((reponse) => {
        if (!reponse.ok) {
            throw new Error('Connection error');
        }
        return reponse.json();
    }).then(works => {
        worksData = works;
        getWorks(defaultCategory);
        if (!authToken) {
            repalcgetFiltersButtons()
            btnmodifier.style.display = 'none';
            edition.style.display = 'none';
        } else {
            logout()
        };
    })


// Afficher les boutons de filtrage en fonction des données récupérées à partir d'Abi Direct
// function getFiltersButtons() {
//     fetch(`${api}categories`)
//         .then(reponse => {
//             if (!reponse.ok) {
//                 throw new Error('Connection error');
//             }
//             return reponse.json();
//         }).then((categories) => {
//             const filtrs = document.getElementById('filters');
//             const tous = document.createElement('button');
//             tous.type = "button";
//             tous.textContent = "Tous";
//             filtrs.appendChild(tous);
//             tous.addEventListener('click', () => {
//                 getWorks(defaultCategory);
//             })
//             for (let categorie of categories) {
//                 let button = document.createElement("button");
//                 button.textContent = categorie.name;
//                 button.type = "button";
//                 filtrs.appendChild(button)
//                 button.addEventListener('click', (function () {
//                     getWorks(categorie.id);
//                 })
//                 );
//             }
//         }).catch((error) => {
//             alert(error);
//         });
// }

// Afficher les boutons de filtrage en fonction des données récupérées à partir du tableau ****worksData****
function repalcgetFiltersButtons() {
    const uniqueCategories = [...new Map(worksData.map(
        work => [work.categoryId, { id: work.categoryId, name: work.category.name }]))
    .values()];

    const filtrs = document.getElementById('filters');
    const tous = document.createElement('button');
    tous.type = "button";
    tous.textContent = "Tous";
    filtrs.appendChild(tous);
    tous.addEventListener('click', () => {
        getWorks(defaultCategory);
    })
    for (const category of uniqueCategories) {
        let button = document.createElement("button");
        button.textContent = category.name;
        button.type = "button";
        filtrs.appendChild(button)
        button.addEventListener('click', (function () {
            getWorks(category.id);
        })
        );
    }
}

function getWorks(id) {
    document.querySelector('.gallery').innerHTML = '';

    for (let work of worksData) {
        if (id === 'Tous' || work.categoryId == id) {
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            const caption = document.createElement('figcaption');

            img.src = work.imageUrl;
            img.alt = work.title;
            caption.textContent = work.title;

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
let modal = document.getElementById('modal');
let overlay = document.getElementById('overlay');
let ajoutermodalcontent = document.getElementById('ajoutermodalcontent');

btnmodifier.addEventListener('click', function () {
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    close(modal, 'close-modal');
    let gallery = document.getElementById('gallery-view');
    for (let work of worksData) {
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
    addNewPro()
});


async function delet(id) {
    try {
        const response = await fetch(`${api}works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
        });
        if (response.ok) {
            let itemAtRemove = document.querySelector(`.contentWithDelet[data-id="${id}"]`);
            worksData = worksData.filter(work => work.id !== id);
            if (itemAtRemove) {
                itemAtRemove.remove();
                getWorks(defaultCategory);
                messages('supprimé avec succès', 'success');
            }
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
        ajoutermodalcontent.style.display = 'flex';
        modal.style.display = 'none';
        close(ajoutermodalcontent, 'close-mod');
        retour();
        category();
    });
}

function retour() {
    let retour = document.getElementById('retour');
    retour.addEventListener('click', () => {
        ajoutermodalcontent.style.display = 'none';
        modal.style.display = 'flex';
    });
}

const refer = document.getElementById('refer');
const icon = document.getElementById('icon');
const remplacefileInput = document.getElementById('remplacefileInput');
const fileInput = document.getElementById('fileInput');
const photoContainer = document.getElementById('photoContainer');
const errorDiv = document.getElementById('error');

function addPhoto() {
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
    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    const existingImage = photoContainer.querySelector('img');
                    if (existingImage) {
                        photoContainer.removeChild(existingImage);
                    }
                    photoContainer.insertBefore(img, refer)
                    icon.style.display = 'none';
                    remplacefileInput.style.display = 'none';
                    refer.style.display = 'none';
                    errorDiv.style.display = 'none';
                };

                reader.readAsDataURL(file);
            } else {
                alert(`Le fichier que vous avez sélectionné n'est pas une image valide.`);
            }
        }
    });
}

// Afficher les catégories en ajoutant une nouvelle image
async function category() {
    let select = document.getElementById('select');
    try {
        const response = await fetch('http://localhost:5678/api/categories')
        if (response.ok) {
            let categorys = await response.json()
            if (select.value === '') {
                for (cat of categorys) {
                    select.innerHTML += `
                    <option class='opt' id='${cat.id}'>${cat.name}</option>
                    `
                };
            }

        } else {
            throw error;
        }
    } catch (error) {
        alert('Erreur lors de la récupération des catégories');
    }
}

// Soumettre un nouveau projet
const titreInput = document.getElementById('titre');
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
        let titre = titreInput.value.trim();
        let selectedOption = select.options[select.selectedIndex];
        const categoryId = selectedOption.id;

        const data = new FormData();
        data.append('title', titre);
        data.append('image', fileInput.files[0])
        data.append('category', categoryId)

        try {
            const response = await fetch(`${api}works`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'accept': 'application/json',
                },
                body: data,
            });
            if (response.ok) {
                const newWork = await response.json();
                worksData.push(newWork);
                ajoutermodalcontent.style.display = 'none';
                overlay.style.display = 'none';
                let main = document.querySelector('main');
                main.classList.add('blur');
                setTimeout(() => {
                    main.classList.remove('blur');
                }, 3000);
                messages('Projet ajouté avec succès', 'success')
                getWorks(defaultCategory);

                const gallery = document.getElementById('gallery-view');
                gallery.innerHTML = '';
                worksData.forEach(work => {
                    let content = `
                        <div class="contentWithDelet" data-id="${work.id}">
                            <img src="${work.imageUrl}" alt="${work.title}">
                            <i onclick="delet(${work.id})" class="fa-solid fa-trash-can"></i>
                        </div>
                    `;
                    gallery.innerHTML += content;
                });
                titreInput.value = '';
                select.selectedIndex = 0;

                let photo = document.querySelector('#photoContainer img');
                const per = photo.parentNode;
                per.replaceChild(remplacefileInput, photo);

                icon.style.display = 'block';
                remplacefileInput.style.display = 'block';
                refer.style.display = 'block';
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


document.addEventListener('DOMContentLoaded', function () {
    addPhoto();
    setupPhotoUpload();
    Soumettre()
});