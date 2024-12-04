import { Film } from "../models/Film";
import { Films } from "../models/Films";
import { FilmUpdate } from "../models/FilmUpdate";
import { Review } from "../models/Review";
import { Reviews } from "../models/Reviews";
import { User } from "../models/User";
import { Users } from "../models/Users";

const mapObjToUser = (row) => {
  if (!row) return undefined;
  return new User({ id: row.id, email: row.email, name: row.name, self: row.self });
};

const mapObjToFilm = (row) => {
  if (!row) return undefined;
  return new Film({
    id: row.id,
    title: row.title.trim(),
    owner: parseInt(row.owner),
    watchDate: row.watchDate,
    rating: row.rating,
    favorite: row.favorite,
    privateFilm: row.private,
    active: row.active,
    self: row.self,
    update: row.update,
    deleteLink: row.delete,
    reviews: row.reviews,
    selection: row.selection
  });
};

const mapObjToFilmUpdate = (row) => {
  if (!row) return undefined;
  return new FilmUpdate({
    title: row.title.trim(),
    owner: parseInt(row.owner),
    watchDate: row.watchDate,
    rating: row.rating,
    favorite: row.favorite
  });
};

const mapObjToFilms = (row) => {
  if (!row) return undefined;
  return new Films({
    totalPages: row.totalPages,
    currentPage: row.currentPage,
    totalItems: row.totalItems,
    films: row.films,
    next: row.next,
    previous: row.previous
  });
};

const mapObjToUsers = (row) => {
  if (!row) return undefined;
  return new Users({
    totalPages: row.totalPages,
    currentPage: row.currentPage,
    totalItems: row.totalItems,
    users: row.users,
    next: row.next,
    previous: row.previous
  });
};

const mapObjToReview = (row) => {
  if (!row) return undefined;
  return new Review({
    filmId: row.filmId,
    reviewerId: row.reviewerId,
    completed: row.completed,
    reviewDate: row.reviewDate,
    rating: row.rating,
    reviewText: row.reviewText,
    active: row.active,
    self: row.self,
    update: row.update,
    deleteLink: row.delete
  });
};

const mapObjToReviews = (row) => {
  if (!row) return undefined;
  return new Reviews({
    totalPages: row.totalPages,
    currentPage: row.currentPage,
    totalItems: row.totalItems,
    reviews: row.reviews,
    filmId: row.filmId,
    next: row.next,
    previous: row.previous
  });
};

export {
  mapObjToUser,
  mapObjToFilm,
  mapObjToFilmUpdate,
  mapObjToFilms,
  mapObjToUsers,
  mapObjToReview,
  mapObjToReviews
};
