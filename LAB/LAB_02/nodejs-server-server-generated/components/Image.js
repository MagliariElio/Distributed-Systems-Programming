/**
 * Represents an image associated with a public film.
 * 
 * This class provides an object-oriented representation of an image, including properties 
 * such as its unique identifier, name, type, and links for interacting with the image 
 * resource (e.g., for deletion). The class is designed to align with a schema that enforces 
 * constraints on these properties.
 * 
 * @param {number} id - A unique identifier for the image (integer).
 * @param {string} name - The name of the image without the file extension (string).
 * @param {string} type - The type of the image (must be one of: 'image/png', 'image/jpg', 'image/gif').
 * @param {string} filmId - A unique identifier for the film of the image (integer).
 */
class Image {
    constructor({ id, name, type, filmId }) {
        this.id = id;
        this.name = name;
        this.type = type;

        this.self = `/api/films/public/${filmId}/images/${this.id}`;
        this.delete = `/api/films/public/${filmId}/images/${this.id}`;
    }
}
