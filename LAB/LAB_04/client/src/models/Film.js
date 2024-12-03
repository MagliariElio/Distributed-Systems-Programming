import * as dayjs from 'dayjs';

/**
 * Constructor function for new Film objects
*/
function Film({ id, title, owner, privateFilm, watchDate, rating, favorite, self, update, deleteLink, reviews, selection } = {}) {
    if (id)
        this.id = id;

    this.title = title;
    this.owner = owner;
    this.private = privateFilm;

    this.favorite = !!favorite && (favorite === 1 || favorite === true);

    if (watchDate) {
        this.watchDate = dayjs(watchDate);
    }

    if (rating) {
        this.rating = parseInt(rating);
    }

    if (self) {
        this.self = self;
    }

    if (update) {
        this.update = update;
    }

    if (deleteLink) {
        this.delete = deleteLink;
    }

    if (selection) {
        this.selection = selection;
    }

    if (reviews) {
        this.reviews = reviews;
    }
}

export { Film }


