import { listener_works } from "./works.js";
import { listener_login } from "./login.js";

listener_works();

listener_login();

//Envoi de la fonction refresh_works de works.js vers login.js,
//pour permettre un rafraîchissement des travaux après connexion
//Cela permet de remettre les travaux au filtre par tous, si celui-ci était différent
listener_login.refresh_works = listener_works.refresh_works;