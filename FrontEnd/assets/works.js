// works contient la liste des travaux qui seront affichés
let works = [];

/**
 * @name refresh_works
 * Télécharge la liste complète des travaux puis rafraichi sur l'acceuil
 * @use set_type_filter()
 * @use show_works()
 * @return { Void }
 */
async function refresh_works()
{
    const response = await fetch("http://localhost:5678/api/works");
    works = await response.json();

    set_type_filter( "all" );
    show_works( works );
}


/**
 * @name set_type_filter
 * Marque par une classe, le bouton correspondant au filtre sélectionné
 * Ce qui permet de différencier le filtre actuel des autres
 * @param { String } type, nom du type de filtre, ex: all, object, apartment, hotel-restaurant
 * @return { Void }
 */
function set_type_filter( type )
{
    const filters = document.querySelectorAll( ".filter-container .filter" );

    for( let index = 0; index < filters.length; index++ )
    {
        const filter = filters[index];
        filter.classList.remove( "selected" );

        if( filter.classList.contains( `filter-${type}` ) )
        {
            filter.classList.add( "selected" );
        }
    }
}


/**
 * @name show_works
 * Rafraichi la liste des travaux sur l'acceuil
 * @param { Array } works, liste des travaux à afficher, présente dans la variable global works
 * @return { Void }
 */
function show_works( works )
{
    const gallery_container = document.querySelector( "#portfolio .gallery" );
    gallery_container.innerHTML = "";

    for( let index = 0; index < works.length; index++ )
    {
        const work = works[index];

        const figure_element = document.createElement( "FIGURE" );
        const img_element = document.createElement( "IMG" );
        const figcaption_element = document.createElement( "FIGCAPTION" );

        img_element.setAttribute( "src" ,work.imageUrl );
        img_element.setAttribute( "alt" ,work.title );

        figcaption_element.innerText = work.title;

        figure_element.appendChild( img_element );
        figure_element.appendChild( figcaption_element );

        gallery_container.appendChild( figure_element );
    }
}


/**
 * @name manage_works_error
 * Affiche un message d'erreur lors de la création ou suppression de travail erroné
 * Efface l'ancien message et affiche le nouveau au bout de 500 milisecondes
 * @param { String } message, message à afficher
 * @return { Void }
 */
function manage_works_error( message )
{
    const error = document.getElementById( "manage-works-error" );

    error.parentElement.style.transition = "";
    error.parentElement.style.bottom = "640px";

    error.style.display = "none";

    setTimeout(
        () =>
        {
            error.innerText = message;

            error.style.display = "flex";

            error.parentElement.style.transition = "bottom 5s";
            error.parentElement.style.bottom = "-60px";
        }
        ,500
    );
}


/**
 * @name show_manage_works
 * Ouvre la fenêtre qui permet de gérer les travaux
 * En supprimer ou en créer
 * @use manage_works_page()
 * @return { Void }
 */
function show_manage_works()
{
    const manage_works = document.getElementById( "manage-works" );
    const body = document.querySelector( "body" );
    manage_works.style.height = ( body.scrollHeight + 78 ) + "px";
    manage_works.classList.add( "open-manage-works" );

    manage_works_page();
}


/**
 * @name hide_manage_works
 * Ferme la fenêtre qui permet de gérer les travaux
 * @use back_manage_works()
 * @return { Void }
 */
function hide_manage_works()
{
    const manage_works = document.getElementById( "manage-works" );
    manage_works.classList.remove( "open-manage-works" );

    back_manage_works( false );
}


/**
 * @name back_manage_works
 * Permet de réinitialiser le contenu principal de la fenêtre qui permet de gérer les travaux
 * Remet les paramètres de la first-page (première page)
 * @param { Boolean } back, permet d'afficher la première page si besoin
 * @use manage_works_page()
 * @return { Void }
 */
function back_manage_works( back=true )
{
    const manage_works = document.getElementById( "manage-works" );
    const action_manage_works_button = document.getElementById( "manage-works-action" );
    const error = document.getElementById( "manage-works-error" );

    error.style.display = "none";

    manage_works.dataset.page = "1";

    manage_works.classList.add( "first-page" );

    manage_works.querySelector(".main").innerHTML = "";

    action_manage_works_button.disabled = false;

    if(back)
    {
        manage_works_page();
    }
}


/**
 * @name delete_work
 * Permet de supprimer un travail par appel d'événement et avec l'identifiant du travail
 * @param { Object } elem, element html appelé par événement et comportant la data work-id avec l'identifiant du travail
 * @use refresh_works()
 * @use manage_works_error()
 * @return { Void }
 */
function delete_work( elem )
{
    const work_id = elem.target.dataset.workId;
    const token = window.localStorage.getItem( "token-login" );

    fetch(
        "http://localhost:5678/api/works/" + work_id
        ,{
            method: "DELETE"
            ,headers:
            {
                "accept": "application/json"
                ,"Authorization": "Bearer " + token
            }
        }
    )
    .then(
        ( response ) =>
        {
            console.log(response);
            if( response.status == 200 || response.status == 204 )
            {
                document.querySelector( `#manage-works .work-${work_id}` ).outerHTML = "";
                refresh_works();
            }
            else if( response.status == 401 )
            {
                manage_works_error( "Vous n'êtes pas autorisé à supprimer ce travail !" );
            }
            else if( response.status == 500 )
            {
                manage_works_error( "Une erreur interne au serveur empêche la suppression" );
            }
            else
            {
                manage_works_error( "Une erreur inconnue empêche la suppression" );
            }
        }
    );
}


/**
 * @name check_form_create_work_image
 * Permet d'effectuer la vérification de l'input image
 * En cas de présence d'un fichier, création d'une miniature
 * La miniature remplace la partie upload de l'image, du formulaire
 * @use check_form_create_work()
 * @return { Void }
 */
function check_form_create_work_image()
{
    const image_input = document.getElementById( "upload-image-work-input" );
    const ckeck_image = image_input.files.length != 0;

    if( ckeck_image )
    {
        const [image_bin] = image_input.files;

        if( image_bin )
        {
            let reader = new FileReader();
            reader.onload = ( image ) =>
            {
                const image_element = document.createElement( "IMG" );
                image_element.setAttribute( "src" ,image.target.result );
                image_element.setAttribute( "alt" ,"Miniature" );

                document.querySelector("#create-work-form .upload-image-work").innerHTML = image_element.outerHTML;
            }
            reader.readAsDataURL(image_bin);
        }
    }

    check_form_create_work();
}


/**
 * @name check_form_create_work
 * Permet d'effectuer la vérification de l'input titre, catégorie et image
 * Si les trois son bon, alors le bouton d'action est activé
 * @return { Boolean } Vrai si les trois input son bon
 */
function check_form_create_work()
{
    const create_work_form = document.getElementById( "create-work-form" );
    const action_manage_works_button = document.getElementById( "manage-works-action" );
    let check_validity = false;

    const ckeck_image = document.getElementById( "upload-image-work-input" ).files.length != 0;
    const ckeck_title = create_work_form.querySelector( "#create-work-title" ).value != "";
    const ckeck_category = create_work_form.querySelector( "#create-work-category" ).value != 0;

    check_validity = ckeck_image && ckeck_title && ckeck_category;

    if( check_validity )
    {
        action_manage_works_button.disabled = false;
    }
    else
    {
        action_manage_works_button.disabled = true;
    }

    return check_validity;
}


/**
 * @name send_work
 * Permet d'effectuer une requête serveur pour ajouter un travail via son formulaire
 * @use hide_manage_works()
 * @use refresh_works()
 * @use manage_works_error()
 * @return { Void }
 */
function send_work()
{
    const form = document.getElementById( "create-work-form" );
    const token = window.localStorage.getItem( "token-login" );

    const form_data = new FormData( form );

    fetch(
        form.action
        ,{
            method: "POST"
            ,headers:
            {
                "accept": "application/json"
                ,"Authorization": "Bearer " + token
            }
            ,body: form_data
        }
    )
    .then(
        ( response ) =>
        {
            if( response.status == 201 )
            {
                hide_manage_works();
                refresh_works();
            }
            else if( response.status == 400 )
            {
                manage_works_error( "Il y a une erreur dans la requête, lors de l'ajout d'un travail" );
            }
            else if( response.status == 401 )
            {
                manage_works_error( "Vous n'êtes pas autorisé à ajouter un travail !" );
            }
            else if( response.status == 500 )
            {
                manage_works_error( "Une erreur interne au serveur empêche l'ajout du travail" );
            }
            else
            {
                manage_works_error( "Une erreur inconnue empêche l'ajout du travail" );
            }
        }
    );
}


/**
 * @name action_manage_works
 * Gère le bouton d'action du manage work (modale de création de travail)
 * @use manage_works_page()
 * @use check_form_create_work()
 * @use send_work()
 * @return { Void }
 */
function action_manage_works()
{
    const manage_works = document.getElementById( "manage-works" );

    const page_id = manage_works.dataset.page;

    switch( page_id )
    {
        case "1":
            manage_works.dataset.page = "2";
            manage_works_page();
            break;

        case "2":
            if( check_form_create_work() )
            {
                send_work();
            }
            break;
    }

}


/**
 * @name manage_works_page
 * Gère les pages du manage work (modale de création/suppression de travail)
 * @use listener_manage_works_page()
 * @return { Void }
 */
async function manage_works_page()
{
    const action_manage_works_button = document.getElementById( "manage-works-action" );
    const manage_works = document.getElementById( "manage-works" );

    const page_id = manage_works.dataset.page;

    switch( page_id )
    {
        case "1":
            let works_html = "";

            for (let index = 0; index < works.length; index++)
            {
                const work = works[index];

                works_html += `<li class="work-${work.id}"><img src="${work.imageUrl}" alt="${work.title}"><i class="fa-solid fa-trash-can" data-work-id="${work.id}"></i></li>`;
            }

            manage_works.querySelector(".main").innerHTML =
                "<h3>Galerie photo</h3>\
                <ul>\
				    " + works_html + "\
			    </ul>";

            action_manage_works_button.innerText = "Ajouter une photo";
            break;

        case "2":
            const categories_query = await fetch("http://localhost:5678/api/categories");
            const categories = await categories_query.json();
            let categories_html = `<option value="0"></option>`;

            for( let index = 0; index < categories.length; index++ )
            {
                const category = categories[index];
                categories_html += `<option value="${category.id}">${category.name}</option>`;
            }

            manage_works.classList.remove( "first-page" );

            manage_works.querySelector(".main").innerHTML =
                `<h3>Ajout photo</h3>
                <form action="http://localhost:5678/api/works" method="post" id="create-work-form" enctype="multipart/form-data">
                    <input type="file" accept=".jpg, .png" name="image" id="upload-image-work-input" hidden required>
				    <div class="upload-image-work">
                        <i class="fa-regular fa-image"></i>
                        <label for="upload-image-work-input" class="upload-image-work-button">+ Ajouter photo</label>
                        <p>jpg, png : 4mo max</p>
				    </div>
                    <label for="create-work-title">Titre</label>
                    <input type="text" name="title" id="create-work-title" required>
                    <label for="create-work-category">Catégorie</label>
                    <select name="category" id="create-work-category" required>
                        ${categories_html}
                    </select>
			    </form>`;

            action_manage_works_button.innerText = "Valider";
            action_manage_works_button.disabled = true;
            break;
    }

    listener_manage_works_page();
}


/**
 * @name listener_manage_works_page
 * Gère les événement des pages du manage work (modale de création/suppression de travail)
 * @return { Void }
 */
function listener_manage_works_page()
{
    const manage_works = document.getElementById( "manage-works" );

    const page_id = manage_works.dataset.page;

    switch( page_id )
    {
        case "1":
            const delete_work_list = manage_works.querySelectorAll( ".main ul li i.fa-trash-can" );

            for( let index = 0; index < delete_work_list.length; index++ )
            {
                const delete_work_elem = delete_work_list[index];

                delete_work_elem.addEventListener(
                    "click"
                    ,delete_work
                );
            }
            break;

        case "2":
            const data_form_list =
            [
                "create-work-title"
                ,"create-work-category"
            ];
            
            for( let index = 0; index < data_form_list.length; index++ )
            {
                document.getElementById( data_form_list[index] ).addEventListener(
                    "change"
                    ,check_form_create_work
                );
                document.getElementById( data_form_list[index] ).addEventListener(
                    "keyup"
                    ,check_form_create_work
                );
            }

            document.getElementById( "upload-image-work-input" ).addEventListener(
                "change"
                ,check_form_create_work_image
            );
            break;
    }
}


/**
 * @name listener_works
 * Gère les travaux sur la page d'accueil
 * Gère les filtres et ses événements
 * Gère les événements de la modale de création/suppression de travail
 * @use set_type_filter()
 * @use show_works()
 * @use show_manage_works() Par événement
 * @use hide_manage_works() Par événement
 * @use back_manage_works() Par événement
 * @use action_manage_works() Par événement
 * @use refresh_works()
 * @return { Void }
 */
export function listener_works()
{
    const filter_all_list = document.querySelectorAll( ".filter-container .filter-all" );
    const filter_object_list = document.querySelectorAll( ".filter-container .filter-object" );
    const filter_apartment_list = document.querySelectorAll( ".filter-container .filter-apartment" );
    const filter_hotel_restaurant_list = document.querySelectorAll( ".filter-container .filter-hotel-restaurant" );

    const to_manage_works = document.getElementById( "to-manage-works" );
    const close_manage_works = document.querySelector( "#manage-works .fa-xmark" );
    const close_manage_works_bg = document.querySelector( "#manage-works .shadow-bg" );
    const back_manage_works_button = document.querySelector( "#manage-works .fa-arrow-left" );
    const action_manage_works_button = document.getElementById( "manage-works-action" );

/********* Filter by All *********/
    for( let index = 0; index < filter_all_list.length; index++ )
    {
        const filter_all = filter_all_list[index];
        
        filter_all.addEventListener(
            "click"
            ,()=>
                {
                    set_type_filter( "all" );
                    show_works( works );
                }
        );
    }

/********* Filter by Object *********/
    for( let index = 0; index < filter_object_list.length; index++ )
    {
        const filter_object = filter_object_list[index];
        
        filter_object.addEventListener(
            "click"
            ,()=>
                {
                    set_type_filter( "object" );
                    const works_filtered = works.filter(
                        function(work){
                            return work.category.name === "Objets";
                        }
                    );
                    show_works( works_filtered );
                }
        );
    }

/********* Filter by Apartement *********/
    for( let index = 0; index < filter_apartment_list.length; index++ )
    {
        const filter_apartment = filter_apartment_list[index];
        
        filter_apartment.addEventListener(
            "click"
            ,()=>
                {
                    set_type_filter( "apartment" );
                    const works_filtered = works.filter(
                        function(work){
                            return work.category.name === "Appartements";
                        }
                    );
                    show_works( works_filtered );
                }
        );
    }

/********* Filter by Hotel and Restaurant *********/
    for( let index = 0; index < filter_hotel_restaurant_list.length; index++ )
    {
        const filter_hotel_restaurant = filter_hotel_restaurant_list[index];
        
        filter_hotel_restaurant.addEventListener(
            "click"
            ,()=>
                {
                    set_type_filter( "hotel-restaurant" );
                    const works_filtered = works.filter(
                        function(work){
                            return work.category.name === "Hotels & restaurants";
                        }
                    );
                    show_works( works_filtered );
                }
        );
    }


    to_manage_works.addEventListener(
        "click"
        ,show_manage_works
    );
    close_manage_works.addEventListener(
        "click"
        ,hide_manage_works
    );
    close_manage_works_bg.addEventListener(
        "click"
        ,hide_manage_works
    );
    back_manage_works_button.addEventListener(
        "click"
        ,back_manage_works
    );
    action_manage_works_button.addEventListener(
        "click"
        ,action_manage_works
    );

    refresh_works();
}

//Alias de la fonction refresh_works
listener_works.refresh_works = refresh_works;