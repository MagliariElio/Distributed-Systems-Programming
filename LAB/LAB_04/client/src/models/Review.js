import * as dayjs from 'dayjs';

/**
 * Constructor function for new Review objects
*/
export function Review({ filmId, reviewerId, completed, reviewDate, rating, reviewText, active, self, update, deleteLink } = {}) {
    this.filmId = filmId;
    this.reviewerId = reviewerId;
    this.completed = completed;
    this.active = active;

    if (reviewDate)
        this.reviewDate = dayjs(reviewDate);

    if (rating)
        this.rating = rating;

    if (reviewText)
        this.reviewText = reviewText;

    if (self)
        this.self = self;

    if (update)
        this.update = update;

    if (deleteLink)
        this.delete = deleteLink;
};
