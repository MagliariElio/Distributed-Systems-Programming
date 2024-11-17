/**
 * Represents an image associated with a public film.
 * 
 * This class provides an object-oriented representation of an image related to a specific 
 * film, including properties such as its unique identifier, original name, file type, size, 
 * and URLs for accessing and deleting the image resource. The class ensures that the data 
 * conforms to a specific schema for film-related images.
 * 
 * @param {number} id - The unique identifier for the image (integer).
 * @param {string} originalname - The original name of the image file, excluding the file extension (string).
 * @param {string} filename - The generated filename for the uploaded image, typically including the file extension (string).
 * @param {number} filmId - The unique identifier of the film associated with the image (integer).
 * @property {string} self - A URL pointing to the image resource, used for retrieving the image.
 * @property {string} delete - A URL pointing to the image resource, used for deleting the image.
 */
class Image {
    constructor(id, originalname, filename, filmId) {
        this.id = id;
        this.originalname = originalname;
        this.filename = filename;
        this.filmId = filmId;

        this.self = `/api/films/public/${this.filmId}/images/${this.id}`;
        this.delete = `/api/films/public/${this.filmId}/images/${this.id}`;
    }
}

module.exports = Image;