[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/BZ2iPUY6)

# Exam Call 1

## Student:

- **Surname**: Magliari
- **Name**: Anuar Elio
- **Student ID**: s317033

---

The structure of this repository is the following:

- "JSON Schemas" contains the design of the JSON Schemas;
- "REST APIs Design" contains the full Open API documentation of the REST APIs, including examples of JSON documents to be used when invoking the operations, and examples of invocations of the API operations, as a Postman collection;
- "REST APIs Implementation" contains the code of the Film Manager service application.

---

## Implementation Choices

### Resource Updates

For updating private films, public films, and completing reviews, the following PATCH endpoints have been implemented:

- `PATCH /api/films/private/{filmId}`
- `PATCH /api/films/public/{filmId}`
- `PATCH /api/films/public/{filmId}/reviews`

Using the PATCH method proved ideal for these operations as it allows for partial resource updates. In each case, JSON schemas have been defined to validate the updatable fields, avoiding unnecessary or unwanted modifications. For example, for reviews, only three specific fields can be updated to mark the review as completed.

Specifically, for `PATCH /api/films/public/{filmId}/reviews`, there is no need to include `reviewerId` in the request URI. This is because the endpoint requires user authentication, and the system automatically uses the authenticated user's ID, ensuring that different IDs cannot be used.

### Inviting to Review

The `POST /api/films/public/{filmId}/reviews` endpoint allows a film owner to invite users to review it. In the request body, a list of user IDs can be specified. Again, `reviewerId` is not included in the URI, as the operation is executed exclusively by the film owner.

### Retrieving Users

`GET /api/users/` allows fetching a list of all users in the system. A pagination system has been implemented to avoid issues related to transmitting large amounts of data. Even though there is currently no registration process, the database might contain a high number of users, making pagination necessary. If the number of users is less than 10, the response is a simple list without pagination.

### Invitation Balancing

`POST /api/films/public/assignments` is used to balance the invitation requests across the films owned by the logged-in user. Specifically, it aims to send invitations to other users in such a way that films with fewer invitations receive more, ensuring a more balanced distribution of invitations. Although the design of this endpoint was originally required, `it has also been implemented`.

### Managing Edit Review Requests

#### Viewing Requests

- `GET /api/films/public/reviews/editrequests/received`: Returns requests received by the authenticated user as the owner of the films.
- `GET /api/films/public/reviews/editrequests/submitted`: Returns requests submitted by the authenticated user as a reviewer.

Both endpoints support filters for `filmId`, page number, page limit, and request status.  
Only the first endpoint, `received`, also includes the `receiverId` filter, allowing the user to filter requests based on the specific user they want. Results are paginated and accompanied by HATEOAS links for easier navigation. Filters defined as query parameters are automatically included in the `next` and `previous` links, enhancing user experience.

#### Request Details

`GET /api/films/public/{filmId}/reviews/{reviewerId}/editrequests` allows viewing a specific request. Only the film owner and the reviewer can access this resource. The response includes custom HATEOAS links:

- Film owner: `self`, `approve`, `reject`
- Reviewer: `self`, `cancel`
- Film owner and Reviewer: `self`, `approve`, `reject`, `cancel`

#### Updating Status

`PATCH /api/films/public/{filmId}/reviews/{reviewerId}/editrequests` allows the owner to accept or reject a request. Only the `status` field is updated, making PATCH more appropriate than PUT.

#### Creation and Cancellation

- `POST /api/films/public/{filmId}/reviews/editrequests`: A reviewer can create an edit request for a completed review. Authentication ensures that the reviewer can only make requests for themselves.
- `DELETE /api/films/public/{filmId}/reviews/editrequests`: Allows canceling a request in the `pending` state. Again, the reviewer's ID is derived from authentication.

### HATEOAS Links

HATEOAS links are designed to facilitate navigation between resources. Each link is represented by an object with three fields:

- `rel`: Indicates the relationship to the resource (e.g., `self`, `update`, `delete`).
- `href`: Contains the resource's URL.
- `method`: Specifies the HTTP method that can be used (e.g., GET, POST, DELETE).

The adopted model is inspired by HAL, with a simple and generic structure aimed at improving user experience without introducing unnecessary complexity.

The fields `rel`, `method`, and `href` have been included, unlike the solution proposed in the lab, because I believe this approach is more comprehensive. It provides the user with additional information on how to execute the link, specifically the HTTP verb, which was previously missing. Moreover, it offers a well-structured format for links, allowing the user to simply scroll through the list and analyze the available elements.

In contrast, with the proposed solution, the user would have had to guess what links might be available. This approach is much more dynamic and general, making it easier for users to interact with the links. This improvement is achieved by paying greater attention during the design phase, ultimately enhancing usability.

### Additional Notes on Implementation Choices

Some changes have been made to the behavior of actions performed on reviews:

- Upon completing the update of a review, any `accepted` edit review request is deleted.
- When a review invitation is deleted, any associated edit requests are also deleted, regardless of their status.
- When viewing a review, an `editReviewRequest` field has been added, displaying the edit request only if the user is the film owner or the reviewer who completed the review. A `editReviewRequest` link is also present to view the individual request.
- When the film's owner accepts an edit request review for a review of their film, the system sets the review's `completed` field to `false` to allow the reviewer to make the requested modification.
- If the owner rejects the request, no action is taken except setting the modification request's status to `rejected`.
- When a public film is deleted, all associated reviews and edit requests are also deleted.

#### Rules for Edit Requests

- A reviewer cannot create multiple edit requests for the same review in the `pending` state. If a request is rejected, a new one can be created, replacing the previous one.
- When a request expires, it is automatically updated to `rejected` and displayed with this status.
- Only the film owner or the reviewer can view edit requests. The last request made is the one displayed for each reviewer.

#### Automatic Rejection of Requests

Automatic rejection of expired requests is managed through a function that checks the `deadline` field. If expired, the request is updated to `rejected` in the database and returned with this status. This check is performed every time a request is managed, ensuring precision even for hourly deadlines.
