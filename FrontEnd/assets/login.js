/**
 * @name show_login_content
 * Permet d'afficher la page de connexion du site
 * @return { Void }
 */
function show_login_content()
{
    const main_content = document.querySelector( "body > main" );
    main_content.classList.toggle( "open-login" );
}


/**
 * @name show_home_content
 * Permet d'afficher l'accueil du site
 * @return { Void }
 */
function show_home_content()
{
    const main_content = document.querySelector( "body > main" );
    main_content.classList.remove( "open-login" );
}


/**
 * @name send_login
 * Permet d'effectuer une requête serveur pour récupérer le jeton (token) de connexion
 * @param { Object } form element html appelé par événement et comportant le formulaire de connexion
 * @use login()
 * @use login_error()
 * @return { Void }
 */
function send_login( form )
{
    form.preventDefault();

    const data = {
        email: form.target.querySelector("[name=email-login").value,
        password: form.target.querySelector("[name=password").value
    };
    
    fetch(
        "http://localhost:5678/api/users/login"
        ,{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }
    )
    .then( response => response.json() )
    .then(
        (response) =>
        {
            if( response.token != null )
            {
                window.localStorage.setItem("token-login", response.token);
                login();
            }
            else
            {
                login_error();
            }
        }
    );
}


/**
 * @name login
 * Permet la connexion utilisateur
 * Affiche un message de réussite en dessous du formulaire, sauf au démarrage de la page
 * Effectue les changements nécessaires à l'affichage suite à la connexion
 * @param { Boolean } on_launch permet d'éviter l'affiche du message de réussite, sert au lancement de la page
 * @use listener_login.refresh_works() fonction provenant de works.js
 * @use show_home_content()
 * @return { Void }
 */
function login( on_launch=false )
{
    const error = document.getElementById( "login-error" );
    const success = document.getElementById( "login-success" );
    const login_button = document.getElementById( "login-button" );
    const logout_button = document.getElementById( "logout-button" );
    const filter_container = document.querySelector( ".filter-container" );
    const to_manage_works = document.getElementById( "to-manage-works" );

    if( !on_launch )
    {
        success.innerText = "La connexion a réussie !";
    
        error.style.display = "none";
        success.style.display = "flex";
    }

    listener_login.refresh_works();

    setTimeout(
        () =>
        {
            if( !on_launch )
            {
                success.style.display = "none";
            }

            login_button.style.display = "none";
            logout_button.style.display = "list-item";

            filter_container.style.display = "none";

            to_manage_works.style.display = "inline";

            show_home_content();
        }
        ,( on_launch?0:1500 )
    );
}


/**
 * @name login_error
 * Affiche les erreurs de connexion en dessous du formulaire
 * Supprime l'ancien message et affiche le nouveau après 500 milisecondes
 * @return { Void }
 */
function login_error()
{
    const error = document.getElementById( "login-error" );
    const success = document.getElementById( "login-success" );

    error.style.display = "none";

    setTimeout(
        () =>
        {
            error.innerText = "Erreur de connexion, l'email et le mot de passe ne correspond pas !";

            success.style.display = "none";
            error.style.display = "flex";
        }
        ,500
    );
}


/**
 * @name logout
 * Permet la déconnexion utilisateur et l'affichage de l'accueil
 * @use show_home_content()
 * @return { Void }
 */
function logout()
{
    const login_button = document.getElementById( "login-button" );
    const logout_button = document.getElementById( "logout-button" );
    const filter_container = document.querySelector( ".filter-container" );
    const works_modify = document.getElementById( "to-manage-works" );

    window.localStorage.removeItem( "token-login" );

    logout_button.style.display = "none";
    login_button.style.display = "list-item";

    filter_container.style.display = "flex";

    works_modify.style.display = "none";

    show_home_content();
}


/**
 * @name listener_login
 * Gère la partie connexion, son formulaire et l'affichage de cette page
 * Gère les événements de connexion, formulaire et son affichage
 * @use show_login_content() Par événement
 * @use logout() Par événement
 * @use show_home_content() Par événement
 * @use listener_manage_works_page() Par événement
 * @use send_login() Par événement
 * @use login()
 * @return { Void }
 */
export function listener_login()
{
    const to_login = document.getElementById( "login-button" );
    const to_logout = document.getElementById( "logout-button" );
    const to_home = document.getElementById( "to-home" );

    to_login.addEventListener(
        "click"
        ,show_login_content
    );

    to_logout.addEventListener(
        "click"
        ,logout
    );

    to_home.addEventListener(
        "click"
        ,show_home_content
    );


    const login_form = document.getElementById("login-form");

    login_form.addEventListener(
        "submit" 
        ,send_login
    );

    if( window.localStorage.getItem( "token-login" ) )
    {
        login(true);
    }
}

//Fonction refresh_works de works.js à faire passer
listener_login.refresh_works = function(){};