
const ERROR_NOT_AUTHENTICATED = 'Must be authenticated to make this request!';
const ERROR_INCORRECT_EMAIL_PASSWORD = 'The email and/or password provided are incorrect.';
const ERROR_DATABASE = 'An unexpected error occurred while processing your request. Please try again later.';
const ERROR_AUTHORIZATION = 'You are not authorized to perform this action.';
const ERROR_BOTH_CODE_AND_MESSAGE_REQUIRED = 'Both "code" and "message" are required in the error response.';
const ERROR_PRIVATE_FIELD_REQUIRED = 'The "private" field is mandatory for this film.';
const ERROR_TITLE_OWNER_REQUIRED = 'Both title and owner are required for the film.';
const ERROR_PRIVATE_FIELD_REQUIRED_FOR_CREATION = 'The "private" field is required when creating a new film.';
const ERROR_PASSWORD_LENGTH = 'Password must be between 6 and 20 characters in length.';
const ERROR_USER_ID_REQUIRED = 'User ID is required to proceed.';
const ERROR_EMAIL_REQUIRED = 'Email address is required to complete the request.';
const ERROR_INVALID_USER_ID = 'The provided User ID is invalid.';
const ERROR_FILM_NOT_FOUND_OR_PRIVATE = 'The requested film could not be found or is marked as private.';
const ERROR_NO_PERMISSION = 'You do not have permission to access this resource.';
const ERROR_NO_PENDING_REVIEW_INVITATION = 'No pending review invitations are available for this film and reviewer.';
const ERROR_REVIEW_ALREADY_COMPLETED = 'This review has already been completed and cannot be deleted.';
const ERROR_LIST_CANNOT_BE_EMPTY = 'The provided list cannot be empty. Please include at least one reviewer ID.';
const ERROR_FILM_ID_INVALID = 'No film was found with the provided ID. Please verify the ID and try again.';
const ERROR_PERMISSION_REQUIRED = 'You do not have the necessary permissions to perform this action on the film.';
const ERROR_FILM_PRIVATE_NO_REVIEWS = 'This film is marked as private and cannot have reviews.';
const ERROR_CONFLICT_PRIVATE_FIELD_CHANGE = 'A conflict occurred due to an existing resource or data inconsistency. The "private" field cannot be modified. Please check the data or resource identifiers.';
const ERROR_REVIEW_NOT_FOUND = 'The requested review could not be located.';
const ERROR_CODE_AND_MESSAGE_REQUIRED = 'Both "code" and "message" must be included in the error response.';
const ERROR_IMAGE_FILE_TYPE = 'Only image files (PNG, JPG, JPEG, GIF) are allowed!';
const ERROR_IMAGE_NOT_FOUND_OR_INVALID = 'No image found for the specified ID in this film.';
const ERROR_IMAGE_SEND_FAILURE = 'An error occurred while sending the requested image. Please try again later or check the image path for validity.';

function formatErrorFilmIdNotFound(filmId) {
  return `No film found with the provided ID: ${filmId}.`;
}

function formatErrorReviewAlreadyExists(filmId, reviewerId) {
  return `A review already exists for reviewer ID ${reviewerId} for film ID ${filmId}.`;
}

function formatErrorUserNotFound(userId) {
  return `User with ID ${userId} not found`;
}

function formatErrorMissingReviewerIds(missingIds) {
  return `The following reviewer IDs are not present: ${missingIds.join(', ')}`;
}

function formatErrorNoReviewInvitation(loggedUserId, filmId) {
  return `No review invitation found for the reviewer (ID: ${loggedUserId}) on the film (ID: ${filmId}). Please ensure you have been invited to review this film.`;
}

function formatErrorReviewAlreadyCompletedByReviewer(filmId, loggedUserId) {
  return `The review for film (ID: ${filmId}) by reviewer (ID: ${loggedUserId}) has already been completed. You cannot submit a new review.`;
}

module.exports = {
  ERROR_NOT_AUTHENTICATED,
  ERROR_INCORRECT_EMAIL_PASSWORD,
  ERROR_DATABASE,
  ERROR_AUTHORIZATION,
  ERROR_BOTH_CODE_AND_MESSAGE_REQUIRED,
  ERROR_PRIVATE_FIELD_REQUIRED,
  ERROR_TITLE_OWNER_REQUIRED,
  ERROR_PRIVATE_FIELD_REQUIRED_FOR_CREATION,
  ERROR_PASSWORD_LENGTH,
  ERROR_USER_ID_REQUIRED,
  ERROR_EMAIL_REQUIRED,
  ERROR_INVALID_USER_ID,
  ERROR_FILM_NOT_FOUND_OR_PRIVATE,
  ERROR_NO_PERMISSION,
  ERROR_NO_PENDING_REVIEW_INVITATION,
  ERROR_REVIEW_ALREADY_COMPLETED,
  ERROR_LIST_CANNOT_BE_EMPTY,
  ERROR_FILM_ID_INVALID,
  ERROR_PERMISSION_REQUIRED,
  ERROR_FILM_PRIVATE_NO_REVIEWS,
  ERROR_CONFLICT_PRIVATE_FIELD_CHANGE,
  ERROR_REVIEW_NOT_FOUND,
  ERROR_CODE_AND_MESSAGE_REQUIRED,
  ERROR_IMAGE_FILE_TYPE,
  ERROR_IMAGE_NOT_FOUND_OR_INVALID,
  ERROR_IMAGE_SEND_FAILURE,

  formatErrorFilmIdNotFound,
  formatErrorReviewAlreadyExists,
  formatErrorUserNotFound,
  formatErrorMissingReviewerIds,
  formatErrorNoReviewInvitation,
  formatErrorReviewAlreadyCompletedByReviewer
};
