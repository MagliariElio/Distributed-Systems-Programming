

class FilmBase {
    /**
     * Creates an instance of the FilmBase class.
     * 
     * Initializes the basic details of a film, including its title, owner, watch date, rating,
     * and whether it is a favorite film of the owner.
     * 
     * @throws {Error} If the title or owner are missing.
     * @param {string} title - The title of the film.
     * @param {number} owner - The unique identifier of the film's owner.
     * @param {string} [watchDate=null] - The date when the film was watched (optional).
     * @param {number} [rating=null] - The rating given to the film, between 1 and 10 (optional).
     * @param {boolean} [favorite=false] - Whether the film is a favorite of the owner (optional).
     */
    constructor(title, owner, watchDate = null, rating = null, favorite = false) {
        if (!title || !owner) {
            throw new Error("Title and owner are required fields.");
        }

        this.title = title;
        this.owner = owner;
        this.watchDate = watchDate;
        this.rating = rating;
        this.favorite = favorite;
    }
}

module.exports = FilmBase;
