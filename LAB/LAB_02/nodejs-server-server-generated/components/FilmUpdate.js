const FilmBase = require('./FilmBase');

class FilmUpdate extends FilmBase {
    /**
     * Creates an instance of the FilmUpdate class.
     * 
     * This class is used to update an existing film. All properties of the original film (except `id`)
     * can be updated, including the title, rating, and private status.
     * 
     * @param {string} [title=null] - The title of the film (optional).
     * @param {number} [owner=null] - The unique identifier of the film's owner (optional).
     * @param {string} [watchDate=null] - The date when the film was watched (optional).
     * @param {number} [rating=null] - The rating given to the film, between 1 and 10 (optional).
     * @param {boolean} [favorite=false] - Whether the film is a favorite of the owner (optional).
     * @param {boolean} [privateFilm=null] - Whether the film is private (optional).
     */
    constructor(title = null, owner = null, watchDate = null, rating = null, favorite = false) {
        super(title, owner, watchDate, rating, favorite);
    }
}

module.exports = FilmUpdate;
