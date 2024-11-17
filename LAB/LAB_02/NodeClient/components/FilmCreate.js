const FilmBase = require('./FilmBase');

class FilmCreate extends FilmBase {
    /**
     * Creates an instance of the FilmCreate class.
     * 
     * This class is used to create a new film, with the added requirement that the `private` field
     * is always specified during the creation of the film resource.
     * 
     * @param {string} title - The title of the film.
     * @param {number} owner - The unique identifier of the film's owner.
     * @param {string} [watchDate=null] - The date when the film was watched (optional).
     * @param {number} [rating=null] - The rating given to the film, between 1 and 10 (optional).
     * @param {boolean} [favorite=false] - Whether the film is a favorite of the owner (optional).
     * @param {boolean} privateFilm - Whether the film is private and only accessible by the owner (required).
     * @throws {Error} If the `private` field is not specified.
     */
    constructor(title, owner, watchDate = null, rating = null, favorite = false, privateFilm = true) {
        if (privateFilm === undefined) {
            throw new Error("The 'private' field is required for film creation.");
        }

        super(title, owner, watchDate, rating, favorite);

        this.private = privateFilm;
    }
}

module.exports = FilmCreate;
