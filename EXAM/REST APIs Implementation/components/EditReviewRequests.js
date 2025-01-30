
class EditReviewRequests {

    /**
     * Constructor for the EditReviewRequests class. This initializes the pagination details, 
     * the list of requests, and generates HATEOAS links for navigating the paginated results.
     *
     * @param {number} totalPages - The total number of pages available in the paginated result set.
     * @param {number} currentPage - The current page number being viewed.
     * @param {number} totalItems - The total number of items (requests) available across all pages.
     * @param {Array} requests - The array of edit review requests for the current page.
     * @param {number} [filmId] - (Optional) The ID of the film for which the edit review requests are being fetched.
     * @param {number} [reviewerId] - (Optional) The ID of the reviewer for which the edit review requests are being fetched.
     * @param {number} [limit] - (Optional) The maximum number of requests displayed per page.
     * @param {string} [status] - (Optional) The status filter applied to the requests (e.g., 'pending', 'accepted', 'rejected').
     * @param {boolean} isReceived - Specifies whether the requests are received (`true`) or submitted (`false`).
     * 
     * HATEOAS Links:
     * - The 'next' link is provided if there are more pages available after the current page.
     * - The 'previous' link is provided if there are pages available before the current page.
     * - Links include query parameters (filmId, limit, and status) for consistency in navigation.
     */
    constructor(totalPages, currentPage, totalItems, requests, filmId, reviewerId, limit, status, isReceived) {
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.totalItems = totalItems;
        this.requests = requests;

        const type = isReceived ? 'received' : 'submitted';

        // HATEOAS links for pagination
        this.links = [
            currentPage < totalPages && {
                'rel': 'next',
                'method': 'GET',
                'href': `/api/films/public/reviews/editrequests/${type}?pageNo=${currentPage + 1}`
                    + (limit ? `&limit=${limit}` : '')
                    + (status ? `&status=${status}` : '')
                    + (filmId ? `&filmId=${filmId}` : '')
                    + (reviewerId ? `&reviewerId=${reviewerId}` : '')
            },
            currentPage > 1 && {
                'rel': 'previous',
                'method': 'GET',
                'href': `/api/films/public/reviews/editrequests/${type}?pageNo=${currentPage - 1}`
                    + (limit ? `&limit=${limit}` : '')
                    + (status ? `&status=${status}` : '')
                    + (filmId ? `&filmId=${filmId}` : '')
                    + (reviewerId ? `&reviewerId=${reviewerId}` : '')
            }
        ].filter(Boolean);
    }
}

module.exports = EditReviewRequests;
