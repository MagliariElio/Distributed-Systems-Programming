const dbUtils = require('../utils/DbUtils');

class EditReviewRequestDetails {

    /**
     * Constructor for the EditReviewRequestDetails class.
     * Initializes the details of an edit review request, including the film, reviewer, deadline, and status.
     * The status is mapped to predefined values (PENDING, REJECTED, ACCEPTED) using the provided status code.
     * Generates HATEOAS links for possible actions related to the edit review request, such as approving, rejecting, or canceling the request.
     * 
     * @param {number} filmId - The ID of the film for which the review edit request is made.
     * @param {number} reviewerId - The ID of the reviewer making the edit review request.
     * @param {string} deadline - The deadline for the edit review request in ISO 8601 date-time format.
     * @param {number} status - The status code of the edit review request (0 for pending, 1 for rejected, 2 for accepted).
     * @param {number} loggedUserId - Long ID of the logged user.
     * @param {number} isOwner - Check if the logged user is the owner of the film.
     */
    constructor(filmId, reviewerId, deadline, status, loggedUserId, isOwner = false) {
        this.filmId = filmId;
        this.reviewerId = reviewerId;
        this.deadline = deadline;

        switch (status) {
            case 0:
                // Handle the case where status is 0 (Pending)
                this.status = dbUtils.EditRequestStatus.PENDING;
                break;
            case 1:
                // Handle the case where status is 1 (Rejected)
                this.status = dbUtils.EditRequestStatus.REJECTED;
                break;
            case 2:
                // Handle the case where status is 2 (Accepted)
                this.status = dbUtils.EditRequestStatus.ACCEPTED;
                break;
            default:
                // Handle unknown status
                this.status = dbUtils.EditRequestStatus.UNKNOWN;
                break;
        }

        const isPending = this.status === dbUtils.EditRequestStatus.PENDING;
        const isReviewer = loggedUserId === this.reviewerId;

        // Generate HATEOAS links
        this.links = [
            {
                'rel': 'self',
                'method': 'GET',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}/editrequests`
            },
            isPending && (!isReviewer || isOwner) && {
                'rel': 'approve',
                'method': 'PATCH',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}/editrequests`
            },
            isPending && (!isReviewer || isOwner) && {
                'rel': 'reject',
                'method': 'PATCH',
                'href': `/api/films/public/${this.filmId}/reviews/${this.reviewerId}/editrequests`
            },
            isPending && isReviewer && {
                'rel': 'cancel',
                'method': 'DELETE',
                'href': `/api/films/public/${this.filmId}/reviews/editrequests`
            }
        ].filter(Boolean);
    }
}

module.exports = EditReviewRequestDetails;
