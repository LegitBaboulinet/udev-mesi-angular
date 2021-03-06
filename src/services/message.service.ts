import { Injectable } from '@angular/core';
import { Language } from 'src/models/language.model';
import { Message } from 'src/models/message.model';
import { Subject } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class MessageService {

  private _selectedLanguage: Language;

  private _messagesSub: Subject<Map<string, string>>;

  private _languages: Array<Language>;
  private messages: Array<Message>;

  constructor(
    private configService: ConfigService
  ) {
    this._languages = [
      new Language('fr', 'Français', `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAAjUlEQVRIS2N01pktzszMvIeBgUEHiHECm6T/+KQx5JQrc/GqZ2RguMLAyOjC6KY/7zIhy0EmUdsBIDNBjgA5AOw1BeEQvC7u38ZJUgh8UFXCq/7A27dg+VEHjIbAaAiMhsBoCIyGwGgIjIbAaAgMihAYsEYpsEl4nhHULGdiZt4HbKFq0bNZDrackdETAIE6sTNLga3zAAAAAElFTkSuQmCC`),
      new Language('en', 'English', `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAFMElEQVRIS+1WaVCVVRh+voW73y6LsoNLajAy1hh6oZn8Y2aN4eTkUmbiVogiZkrQAhoGpAWyFCMqOLgVNTQp+sOwaXQmldQxGRodQlyIAJeBu3Lx3u/7Ot/5uFcISqkf9aPz5zvnfO/ynOe8531fZj4Sc6eg8T0DHCzIsJdUyh/U7AZ+brpD5wNHbskoujSsXzlo36uXs/6+jk7HI6vAf5CcV88OvdiIKXlMLvSC1/lAACsXLkTC9P1oa7P9LQAcx6D263lovH5qWADUFwHBFAGSvFieEAcmOBT67Dzw8dOpUnePB4sWtcJqEXxG6usnwWjk0BUbC9FiofusyYSQy5dhswmYNauZ7pWWRWFavB4Mw0C8fQvOD7Ph+fG0z87es0107gOQPH2y8pMoaBYnQ7s6HYxKBatVQEZGGy5d6qW/HwQgKakFO3dGIyZGS+XvfV8PR/4WSFYFLDge/PzFqNyYqbjLLamkDKyXenCvZh/gvkd/8BMfgyF3G/gJkyAIEmpru1FU1PWXAHp7RXR3exAeroLksMP+ST76jn7jOzVnfhrq9Eyw0WMhigIOH265DyDjjWUQ29vgKtsOz6nvFHRqNfRrN0D3ajIEETh50gaz2QC9nh10BVxEBILPnYNEjkIIhPunC7BmZ0Jo/5XaYceMg4Y45hNn0PXFi04UFBxHXd1VEPFt0uzZ45CT8zymTtVRAfmunMUFEFt/oWuVOREmwoYUFAI5uGQnA2OAi4pCcEMDiSYJtrIiOKr3gNAGxmCEZsUaqBcsAfz80NnpxtGjFhw4cBcNDXXKIWUA8sRsTiIBF4ikJH9ERvpRA67aQ+itKIVos4B9xAT/9z+A9rkXqOJwAAQSbJ0znyIAWajnvgRt6ltgA4Oo/LFjFpSX34LDQagkwwfAGwPZ6St8d/Uwk2EZeBjFfpmtpVUKA/86AG8eeDksbAT4/7noFx0dCgP/A/AysDgmZkS8ilYrfXZ0sCxYo3FE+oeuXPmPBKH3Fby5PJki4nkGajVLkw0kEZLTST4kqajUYDUa3ymHe4aSxw3RqdQMVktqAU/yCRkejwSXS3n/3lG8t1phYGAiysgIxZw5JvrDdvwYOjatg2w0esenCHhxHt2XSZex/VkecF1twbVlS+BqbkbgqlQEv7MZDM/jzBkHCgs7ceeOh9oZlAnDwvQ4eHApEhP1kNxudOXl4G5lBdRjxmJ89QHoJsfR677Z5sKoINXQWuBNxf3HE+x2XF+Xip66I9A+OQ1R5VXwi4hEV5cHxcVdBIx9aCaUi5GbFI8bry+FkxQT0zOz8OiuKvD+/qQQSfi23oKP8jtJLp84pB/gwsMRfP48LKR0azTkClUsASyhY0ch2gu2gjOaEFW2C8aZz1KIcj1YsIC0XDKb3hhIGRuCm+kp8PT0IGLjJkS+mw2G49DnFvHxduK4TqnnD+oHUlJu4LPyaAT481S+50Q9WlYtp3ZD0jYgNCuHXAmHI0eakZZ24n4iMhu14Ax6TKioRFDSXEXZ4sGa1Jtobe3zBc+DAMgdkU7HIi8/nJZulkSz6/o1XHllIZxNTTCQyjpu9z7sGR+lMODNAzOeiEPs519CFxNL6Tt3wYGst9vhdA6O3ocB4EW75LVArE4ZTV4WC8HhQMvaVNz+qgZ+o0fj9I32/iv4Q1O6zi1g85YfkJ93xnfqgZORdMWyXnx8KOpPLEJZ9UFqZmA3bYdRYOS2/HHSluv72/KahP1oOPvbsM7lzZECkHUCAjTYsMUwCIDsvBFx+b8DctqHmw6AaZ4AAAAASUVORK5CYII=`),
      new Language('it', 'Italiano', `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAYCAYAAACbU/80AAAAjUlEQVRIS2NkqPITZ2D4s4eBgUEHiHGCJvFgfNIYcpr5WXjVMzIwXPnFwOLCyFDldZmQ5SCTqO0AkJkgR4Ac8B/E0TfTxeviYx4tJIXAf29/vOq3790Llh91wGgIjIbAaAiMhsBoCIyGwGgIjIbAoAiBAWuUMjD8Pw8MAXCzfB+wfahFz2Y5yPLfDKyeAJLRsoJQI/N3AAAAAElFTkSuQmCC`),
    ];
    this.messages = [
      // Menu
      new Message('fr', 'menu_constructors', 'Constructeurs'),
      new Message('en', 'menu_constructors', 'Constructors'),
      new Message('it', 'menu_constructors', 'Costruttori'),
      new Message('fr', 'menu_models', 'Modèles'),
      new Message('en', 'menu_models', 'Models'),
      new Message('it', 'menu_models', 'Modelli'),
      new Message('fr', 'menu_planes', 'Avions'),
      new Message('en', 'menu_planes', 'Planes'),
      new Message('it', 'menu_planes', 'Aeroplani'),
      new Message('fr', 'menu_flights', 'Vols'),
      new Message('en', 'menu_flights', 'Flights'),
      new Message('it', 'menu_flights', 'Voli'),
      new Message('fr', 'menu_planning', 'Planification'),
      new Message('en', 'menu_planning', 'Planning'),
      new Message('it', 'menu_planning', 'Pianificazione'),
      new Message('fr', 'menu_passengers', 'Passagers'),
      new Message('en', 'menu_passengers', 'Passengers'),
      new Message('it', 'menu_passengers', 'Passaggeri'),
      new Message('fr', 'menu_reservations', 'Réservations'),
      new Message('en', 'menu_reservations', 'Reservations'),
      new Message('it', 'menu_reservations', 'Prenotazioni'),
      new Message('fr', 'menu_reports', 'Rapports'),
      new Message('en', 'menu_reports', 'Reports'),
      new Message('it', 'menu_reports', 'Rapporti'),
      new Message('fr', 'menu_login', 'Connexion'),
      new Message('en', 'menu_login', 'Login'),
      new Message('it', 'menu_login', 'Connessione'),
      new Message('fr', 'menu_logout', 'Déconnexion'),
      new Message('en', 'menu_logout', 'Logout'),
      new Message('it', 'menu_logout', 'Scollegamento'),

      // CRUD
      new Message('fr', 'crud_creation', 'Création'),
      new Message('en', 'crud_creation', 'Creation'),
      new Message('it', 'crud_creation', 'Creazione'),
      new Message('fr', 'crud_read', 'Consultation'),
      new Message('en', 'crud_read', 'View'),
      new Message('it', 'crud_read', 'Consultazione'),
      new Message('fr', 'crud_edition', 'Édition'),
      new Message('en', 'crud_edition', 'Edition'),
      new Message('it', 'crud_edition', 'Divulgazione'),
      new Message('fr', 'crud_edit', 'Modifier'),
      new Message('en', 'crud_edit', 'Edit'),
      new Message('it', 'crud_edit', 'Modifica'),

      // Entities
      new Message('fr', 'entity_constructor', 'Constructeur'),
      new Message('en', 'entity_constructor', 'Constructor'),
      new Message('it', 'entity_constructor', 'Costruttori'),
      new Message('fr', 'entity_model', 'Modèle'),
      new Message('en', 'entity_model', 'Model'),
      new Message('it', 'entity_model', 'Modello'),
      new Message('fr', 'entity_plane', 'Avion'),
      new Message('en', 'entity_plane', 'Plane'),
      new Message('it', 'entity_plane', 'Aeroplano'),
      new Message('fr', 'entity_flight', 'Vol'),
      new Message('en', 'entity_flight', 'Flight'),
      new Message('it', 'entity_flight', 'Volo'),
      new Message('fr', 'entity_planning', 'Planification'),
      new Message('en', 'entity_planning', 'Planning'),
      new Message('it', 'entity_planning', 'Pianificazione'),
      new Message('fr', 'entity_passenger', 'Passager'),
      new Message('en', 'entity_passenger', 'Passenger'),
      new Message('it', 'entity_passenger', 'Passaggero'),
      new Message('fr', 'entity_reservation', 'Réservation'),
      new Message('en', 'entity_reservation', 'Reservation'),
      new Message('it', 'entity_reservation', 'Prenotazione'),
      new Message('fr', 'entity_report', 'Rapport'),
      new Message('en', 'entity_report', 'Report'),
      new Message('it', 'entity_report', 'Rapporto'),

      // General
      new Message('fr', 'close', 'Fermer'),
      new Message('en', 'close', 'Close'),
      new Message('it', 'close', 'chiudere'),
      new Message('fr', 'name', 'Nom'),
      new Message('en', 'name', 'Name'),
      new Message('it', 'name', 'Nominativo'),
      new Message('fr', 'countEcoSlots', 'Nombre de places éco'),
      new Message('en', 'countEcoSlots', 'Eco slots number'),
      new Message('it', 'countEcoSlots', 'Numero di luoghi eco'),
      new Message('fr', 'countBusinessSlots', 'Nombre de places affaires'),
      new Message('en', 'countBusinessSlots', 'Business slots number'),
      new Message('it', 'countBusinessSlots', 'Numero di luoghi di lavoro'),
      new Message('fr', 'nothing_to_do_here', 'Il n\'y a rien à faire ici'),
      new Message('en', 'nothing_to_do_here', 'Nothing to do here'),
      new Message('it', 'nothing_to_do_here', 'Non c\'è niente da fare qui'),
      new Message('fr', 'delete', 'Supprimer'),
      new Message('en', 'delete', 'Delete'),
      new Message('it', 'delete', 'Rimuovere'),
      new Message('fr', 'filter', 'Filtrer'),
      new Message('en', 'filter', 'Filter'),
      new Message('it', 'filter', 'Filtro'),
      new Message('fr', 'under_maintenance', 'En maintenance'),
      new Message('en', 'under_maintenance', 'Under maintenance'),
      new Message('it', 'under_maintenance', 'In manutenzione'),
      new Message('fr', 'departure_city', 'Ville de départ'),
      new Message('en', 'departure_city', 'Departure city'),
      new Message('it', 'departure_city', 'Città di partenza'),
      new Message('fr', 'arrival_city', 'Ville d\'arrivée'),
      new Message('en', 'arrival_city', 'Arrival city'),
      new Message('it', 'arrival_city', 'Città di arrivo'),
      new Message('fr', 'departure_date_time', 'Date et heure de départ'),
      new Message('en', 'departure_date_time', 'Departure date and time'),
      new Message('it', 'departure_date_time', 'Data e ora di partenza'),
      new Message('fr', 'arrival_date_time', 'Date et heure d\'arrivée'),
      new Message('en', 'arrival_date_time', 'Arrival date and time'),
      new Message('it', 'arrival_date_time', 'Data e ora di arrivo'),
      new Message('fr', 'ARN', 'ARN'),
      new Message('en', 'ARN', 'ARN'),
      new Message('it', 'ARN', 'ARN'),
      new Message('fr', 'no_planning', 'Il n\'y pas de planification'),
      new Message('en', 'no_planning', 'There is no planning'),
      new Message('it', 'no_planning', 'Non c\'è pianificazione'),
      new Message('fr', 'no_plane', 'Il n\'y pas d\'avion'),
      new Message('en', 'no_plane', 'There is no plane'),
      new Message('it', 'no_plane', 'Non c\'è un aeroplano'),
      new Message('fr', 'no_reservation', 'Il n\'y pas de réservation'),
      new Message('en', 'no_reservation', 'There is no reservation'),
      new Message('it', 'no_reservation', 'Non ci sono prenotazioni'),
      new Message('fr', 'reservation_date', 'Date de réservation'),
      new Message('en', 'reservation_date', 'Reservation date'),
      new Message('it', 'reservation_date', 'Data di prenotazione'),
      new Message('fr', 'reservation_class', 'Classe'),
      new Message('en', 'reservation_class', 'Class'),
      new Message('it', 'reservation_class', 'Classe'),
      new Message('fr', 'business', 'Affaire'),
      new Message('en', 'business', 'Business'),
      new Message('it', 'business', 'Affare'),
      new Message('fr', 'economic', 'Économique'),
      new Message('en', 'economic', 'Economic'),
      new Message('it', 'economic', 'Economico'),
      new Message('fr', 'plan_flight', 'Planifier un vol'),
      new Message('en', 'plan_flight', 'Plan a flight'),
      new Message('it', 'plan_flight', 'Pianificare un volo'),
      new Message('fr', 'create_reservation', 'Faire une réservation'),
      new Message('en', 'create_reservation', 'Make a reservation'),
      new Message('it', 'create_reservation', 'Effettuare una prenotazione'),
      new Message('fr', 'create_return', 'Créer également un vol retour'),
      new Message('en', 'create_return', 'Also create the return flight'),
      new Message('it', 'create_return', 'Anche creare il ritorno'),

      new Message('fr', 'firstName', 'Prénom'),
      new Message('en', 'firstName', 'First name'),
      new Message('it', 'firstName', 'Nome'),
      new Message('fr', 'lastName', 'Nom de famille'),
      new Message('en', 'lastName', 'Last name'),
      new Message('it', 'lastName', 'Cognome'),
      new Message('fr', 'email', 'Email'),
      new Message('en', 'email', 'Email'),
      new Message('it', 'email', 'Email'),
      new Message('fr', 'phoneNumber', 'Numéro de téléphone'),
      new Message('en', 'phoneNumber', 'Phone Number'),
      new Message('it', 'phoneNumber', 'Numero di telefono'),
      new Message('fr', 'IDNumber', 'Numéro de carte d\'identité'),
      new Message('en', 'IDNumber', 'ID Number'),
      new Message('it', 'IDNumber', 'Numero della carta d\'identità'),
      new Message('fr', 'gender', 'Genre'),
      new Message('en', 'gender', 'Gender'),
      new Message('it', 'gender', 'Genere'),
      new Message('fr', 'man', 'Homme'),
      new Message('en', 'man', 'Man'),
      new Message('it', 'man', 'Uomo'),
      new Message('fr', 'woman', 'Femme'),
      new Message('en', 'woman', 'Woman'),
      new Message('it', 'woman', 'Donna'),
      new Message('fr', 'birthday', 'Date de naissance'),
      new Message('en', 'birthday', 'Birthday'),
      new Message('it', 'birthday', 'Compleanno'),
      new Message('fr', 'username', 'Nom d\'utilisateur'),
      new Message('en', 'username', 'Username'),
      new Message('it', 'username', 'Nome utente'),
      new Message('fr', 'password', 'Mot de passe'),
      new Message('en', 'password', 'Password'),
      new Message('it', 'password', 'Password'),

      // Errors
      new Message('fr', 'cannot_communicate_with_api', 'Une erreur s\'est produite lors de la communication avec l\'API'),
      new Message('en', 'cannot_communicate_with_api', 'An error occured when trying to communicate with the API'),
      new Message('it', 'cannot_communicate_with_api', 'Si è verificato un errore durante la comunicazione con l\'API'),

      // Validators
      new Message('fr', 'field_cannot_be_edited', 'Ce champ ne peut pas être modifié'),
      new Message('en', 'field_cannot_be_edited', 'This field cannot be edited'),
      new Message('it', 'field_cannot_be_edited', 'Questo campo non può essere cambiato'),
      new Message('fr', 'field_is_required', 'Ce champ est requis'),
      new Message('en', 'field_is_required', 'This field is required'),
      new Message('it', 'field_is_required', 'Questo campo è richiesto'),
      new Message('fr', 'field_cannot_contain_less_than_2_characters', 'Ce champ ne peut pas contenir moins de deux caractères'),
      new Message('en', 'field_cannot_contain_less_than_2_characters', 'This field cannot contain less than two characters'),
      new Message('it', 'field_cannot_contain_less_than_2_characters', 'Questo campo non può contenere meno di due caratteri'),
      new Message('fr', 'field_cannot_contain_less_than_4_characters', 'Ce champ ne peut pas contenir moins de quatre caractères'),
      new Message('en', 'field_cannot_contain_less_than_4_characters', 'This field cannot contain less than four characters'),
      new Message('it', 'field_cannot_contain_less_than_4_characters', 'Questo campo non può contenere meno di quattro caratteri'),
      new Message('fr', 'password_will_not_be_edited', 'Le mot de passe ne sera pas modifié'),
      new Message('en', 'password_will_not_be_edited', 'Password will not be edited'),
      new Message('it', 'password_will_not_be_edited', 'La password non verrà modificata'),
      new Message('fr', 'field_is_email', 'Ce n\'est pas une adresse email correcte'),
      new Message('en', 'field_is_email', 'This is a not a valid email address'),
      new Message('it', 'field_is_email', 'Questo non è un indirizzo email corretto'),
      new Message('fr', 'field_is_numeric', 'Ce champ ne peut contenir que des chiffres'),
      new Message('en', 'field_is_numeric', 'This field can only contain numbers'),
      new Message('it', 'field_is_numeric', 'Questo campo può contenere solo numeri'),
      new Message('fr', 'email_exists', 'Cette adresse email est déjà prise'),
      new Message('en', 'email_exists', 'This email address is already taken'),
      new Message('it', 'email_exists', 'Questo indirizzo e-mail è già stato preso'),
      new Message('fr', 'phone_number_exists', 'Ce numéro de téléphone est déjà pris'),
      new Message('en', 'phone_number_exists', 'This phone number is already taken'),
      new Message('it', 'phone_number_exists', 'Questo numero di telefono è già stato preso'),
      new Message('fr', 'id_number_exists', 'Ce numéro de carte d\'identité est déjà pris'),
      new Message('en', 'id_number_exists', 'This ID number is already taken'),
      new Message('it', 'id_number_exists', 'Questo numero di carta d\'identità è già stato preso'),

      // Actions
      new Message('fr', 'constructor_has_been_created', 'Le constructeur a bien été créé'),
      new Message('en', 'constructor_has_been_created', 'The constructor has succesfully been created'),
      new Message('it', 'constructor_has_been_created', 'Il costruttore è stato creato'),
      new Message('fr', 'constructor_has_been_edited', 'Le constructeur a bien été modifié'),
      new Message('en', 'constructor_has_been_edited', 'The constructor has succesfully been edited'),
      new Message('it', 'constructor_has_been_edited', 'Il costruttore è stato modificato'),
      new Message('fr', 'constructor_has_been_deleted', 'Le constructeur a bien été supprimé'),
      new Message('en', 'constructor_has_been_deleted', 'The constructor has succesfully been deleted'),
      new Message('it', 'constructor_has_been_deleted', 'Il costruttore è stato cancellato'),
      new Message('fr', 'model_has_been_created', 'Le modèle a bien été créé'),
      new Message('en', 'model_has_been_created', 'The model has succesfully been created'),
      new Message('it', 'model_has_been_created', 'Il modello è stato creato'),
      new Message('fr', 'model_has_been_edited', 'Le modèle a bien été modifié'),
      new Message('en', 'model_has_been_edited', 'The model has succesfully been edited'),
      new Message('it', 'model_has_been_edited', 'Il modello è stato modificato'),
      new Message('fr', 'model_has_been_deleted', 'Le modèle a bien été supprimé'),
      new Message('en', 'model_has_been_deleted', 'The model has succesfully been deleted'),
      new Message('it', 'model_has_been_deleted', 'Il modello è stato cancellato'),
      new Message('fr', 'plane_has_been_created', 'L\'avion a bien été créé'),
      new Message('en', 'plane_has_been_created', 'The plane has succesfully been created'),
      new Message('it', 'plane_has_been_created', 'Il aeroplano è stato creato'),
      new Message('fr', 'plane_has_been_edited', 'L\'avion a bien été modifié'),
      new Message('en', 'plane_has_been_edited', 'The plane has succesfully been edited'),
      new Message('it', 'plane_has_been_edited', 'Il aeroplano è stato modificato'),
      new Message('fr', 'plane_has_been_deleted', 'L\'avion a bien été supprimé'),
      new Message('en', 'plane_has_been_deleted', 'The plane has succesfully been deleted'),
      new Message('it', 'plane_has_been_deleted', 'Il aeroplano è stato cancellato'),
      new Message('fr', 'flight_has_been_created', 'Le vol a bien été créé'),
      new Message('en', 'flight_has_been_created', 'The flight has succesfully been created'),
      new Message('it', 'flight_has_been_created', 'Il volo è stato creato'),
      new Message('fr', 'flight_has_been_edited', 'Le vol a bien été modifié'),
      new Message('en', 'flight_has_been_edited', 'The flight has succesfully been edited'),
      new Message('it', 'flight_has_been_edited', 'Il volo è stato modificato'),
      new Message('fr', 'flight_has_been_deleted', 'Le vol a bien été supprimé'),
      new Message('en', 'flight_has_been_deleted', 'The flight has succesfully been deleted'),
      new Message('it', 'flight_has_been_deleted', 'Il volo è stato cancellato'),
      new Message('fr', 'planning_has_been_created', 'La planification a bien été créée'),
      new Message('en', 'planning_has_been_created', 'The planning has succesfully been created'),
      new Message('it', 'planning_has_been_created', 'Il pianificazione è stato creato'),
      new Message('fr', 'planning_has_been_edited', 'La planification a bien été modifiée'),
      new Message('en', 'planning_has_been_edited', 'The planning has succesfully been edited'),
      new Message('it', 'planning_has_been_edited', 'Il pianificazione è stato modificato'),
      new Message('fr', 'planning_has_been_deleted', 'La planification a bien été supprimée'),
      new Message('en', 'planning_has_been_deleted', 'The planning has succesfully been deleted'),
      new Message('it', 'planning_has_been_deleted', 'Il pianificazione è stato cancellato'),
      new Message('fr', 'passenger_has_been_created', 'Le passager a bien été créé'),
      new Message('en', 'passenger_has_been_created', 'The passenger has succesfully been created'),
      new Message('it', 'passenger_has_been_created', 'Il passeggero è stato creato'),
      new Message('fr', 'passenger_has_been_edited', 'Le passsager a bien été modifié'),
      new Message('en', 'passenger_has_been_edited', 'The passenger has succesfully been edited'),
      new Message('it', 'passenger_has_been_edited', 'Il passeggero è stato modificato'),
      new Message('fr', 'passenger_has_been_deleted', 'Le passager a bien été supprimé'),
      new Message('en', 'passenger_has_been_deleted', 'The passenger has succesfully been deleted'),
      new Message('it', 'passenger_has_been_deleted', 'Il passeggero è stato cancellato'),

      new Message('fr', 'reservation_has_been_created', 'La réservation a bien été créée'),
      new Message('en', 'reservation_has_been_created', 'The reservation has succesfully been created'),
      new Message('it', 'reservation_has_been_created', 'La prenotazione è stata creata'),
      new Message('fr', 'reservation_has_been_edited', 'La réservation a bien été modifiée'),
      new Message('en', 'reservation_has_been_edited', 'The reservation has succesfully been edited'),
      new Message('it', 'reservation_has_been_edited', 'La prenotazione è stata modificata'),
      new Message('fr', 'reservation_has_been_deleted', 'La réservation a bien été supprimée'),
      new Message('en', 'reservation_has_been_deleted', 'The reservation has succesfully been deleted'),
      new Message('it', 'reservation_has_been_deleted', 'La prenotazione è stata cancellata'),

      new Message('fr', 'choose_a_date', 'Choisissez une date'),
      new Message('en', 'choose_a_date', 'Choose a date'),
      new Message('it', 'choose_a_date', 'Scegli una data'),
      new Message('fr', 'choose_a_date_time', 'Choisissez une date et une heure'),
      new Message('en', 'choose_a_date_time', 'Choose a date and time'),
      new Message('it', 'choose_a_date_time', 'Scegli una data e un\'ora')
    ];

    // Initialisation du subscribable
    this._messagesSub = new Subject<Map<string, string>>();

    // Chargement du langage depuis le local storage
    this.selectedLanguage = this.getLanguageFromLocalStorage();
  }

  public get languages(): Array<Language> {
    return this._languages;
  }

  public get messagesSub(): Subject<Map<string, string>> {
    return this._messagesSub;
  }

  public getLanguageFromLocalStorage(): Language {
    const languageCode = localStorage.getItem('language_code');
    if (languageCode) {
      // Vérification de l'existence du code de language
      const language = this.languages.find((language: Language) => {
        return language.code === languageCode;
      });
      return (language) ? language : this.languages[0];
    } else {
      return this.languages[0];
    }
  }

  public get selectedLanguage(): Language {
    return this._selectedLanguage;
  }

  public set selectedLanguage(language: Language) {
    this._selectedLanguage = language;

    // Changement du language dans le local storage
    localStorage.setItem('language_code', language.code);

    // Changement dans l'entête HTTP
    this.configService.HEADERS['Accept-Language'] = language.code;

    this.sendMessages();
  }

  public sendMessages(): void {
    const messagesMap = new Map<string, string>();
    const currentMessages = this.messages.filter(message => {
      return message.languageCode === this._selectedLanguage.code;
    });
    currentMessages.forEach((currentMessage: Message) => {
      messagesMap.set(currentMessage.name, currentMessage.content);
    });
    this.messagesSub.next(messagesMap);
  }
}
