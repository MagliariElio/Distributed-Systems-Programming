import * as dayjs from 'dayjs';

/**
 * Constructor function for new Film objects
*/
export function Film({ id, title, owner, watchDate, rating, favorite, privateFilm, active, self, update, deleteLink, reviews, selection } = {}) {
    this.id = id;
    this.title = title;
    this.owner = owner;
    this.private = privateFilm;

    if (!this.private) {
        this.active = active;
    }

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
};