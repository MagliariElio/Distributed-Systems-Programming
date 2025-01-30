const FilmBase = require('./FilmBase');

class Film extends FilmBase {
    /**
     * Creates an instance of the Film class.
     * 
     * This class represents a complete film resource with additional links for interacting with the film,
     * including self-reference (`self`), update (`update`), delete (`delete`), and reviews (`reviews`).
     * 
     * @param {number} id - The unique identifier for the film.
     * @param {string} title - The title of the film.
     * @param {number} owner - The unique identifier of the film's owner.
     * @param {string} [watchDate=null] - The date when the film was watched (optional).
     * @param {number} [rating=null] - The rating given to the film, between 1 and 10 (optional).
     * @param {boolean} [favorite=false] - Whether the film is a favorite of the owner (optional).
     * @param {boolean} privateFilm - Whether the film is private (required).
     * @throws {Error} If the `private` field is not specified.
     */
    constructor(id, title, owner, watchDate = null, rating = null, favorite = false, privateFilm = true) {
        // Ensure that 'private' is provided
        if (privateFilm === undefined) {
            throw new Error("The 'private' field is required for the film.");
        }

        super(title, owner, watchDate, rating, favorite);

        this.id = id;
        this.private = privateFilm == 1;

        // Generate HATEOAS links
        if (this.private) {
            this.links = [
                {
                    'rel': 'self',
                    'method': 'GET',
                    'href': `/api/films/private/${this.id}`
                },
                {
                    'rel': 'update',
                    'method': 'PATCH',
                    'href': `/api/films/private/${this.id}`
                },
                {
                    'rel': 'delete',
                    'method': 'DELETE',
                    'href': `/api/films/private/${this.id}`
                }
            ].filter(Boolean);
        } else {
            this.links = [
                {
                    'rel': 'self',
                    'method': 'GET',
                    'href': `/api/films/public/${this.id}`
                },
                {
                    'rel': 'update',
                    'method': 'PATCH',
                    'href': `/api/films/public/${this.id}`
                },
                {
                    'rel': 'delete',
                    'method': 'DELETE',
                    'href': `/api/films/public/${this.id}`
                },
                {
                    'rel': 'reviews',
                    'method': 'GET',
                    'href': `/api/films/public/${this.id}/reviews`
                }
            ].filter(Boolean);
        }
    }
}

module.exports = Film;
