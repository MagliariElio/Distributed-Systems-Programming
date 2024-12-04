/**
 * Creates an instance of the FilmUpdate class.
 * 
 * This class is used to update an existing film. All properties of the original film (except `id`)
 * can be updated, including the title, rating, and private status.
 * 
 * @param {string} [title] - The title of the film (optional).
 * @param {number} [owner] - The unique identifier of the film's owner (optional).
 * @param {string} [watchDate] - The date when the film was watched (optional).
 * @param {number} [rating] - The rating given to the film, between 1 and 10 (optional).
 * @param {boolean} [favorite] - Whether the film is a favorite of the owner (optional).
 */
export function FilmUpdate({ title, owner, watchDate, rating, favorite } = {}) {
    this.title = title;
    this.owner = owner;

    if (watchDate) {
        this.watchDate = watchDate.format('YYYY-MM-DD');
    }

    this.active = active;
    this.rating = rating;
    this.favorite = favorite;
};
