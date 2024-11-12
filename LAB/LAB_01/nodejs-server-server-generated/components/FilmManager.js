/**
 * Class that manages various API endpoints related to films and users.
 * 
 * The FilmManager class organizes the API routes that deal with films, including public,
 * private, and invited films, as well as user authentication and review assignments.
 * It provides convenient access to the relevant URLs for interacting with the film-related
 * resources.
 * 
 * @class
 */
class FilmManager{
    /**
     * Creates an instance of FilmManager.
     * Initializes the API endpoint URLs for films, users, and other related resources.
     * 
     * The instance will provide easy access to the relevant film API routes and
     * user authentication endpoints.
     * 
     * @constructor
     */
    constructor() {
        this.films = "/api/films/";
        this.privateFilms = "/api/films/private/";
        this.publicFilms = "/api/films/public/";
        this.invitedPublicFilms = "/api/films/public/invited";
        this.reviewAssignments = "/api/films/public/assignments";
        this.users = "/api/users/";
        this.usersAuthenticator = "/api/users/authenticator";
    }
}

module.exports = FilmManager;