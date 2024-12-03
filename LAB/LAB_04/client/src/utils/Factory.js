import { Film } from "../models/Film";
import Films from "../models/Films";
import { Review } from "../models/Review";
import Reviews from "../models/Reviews";
import { User } from "../models/User";
import { Users } from "../models/Users";

const mapObjToUser = (row) => {
    if (!row) return undefined;
    return new User(row.id, row.email, row.name);
  };
  
  const mapObjToFilm = (row) => {
    if (!row) return undefined;
    return new Film(row.id, row.title, row.owner, row.watchDate, row.rating, row.favorite, row.private);
  };
  
  const mapObjToFilms = (row) => {
    if (!row) return undefined;
    return new Films(row.totalPages, row.currentPage, row.totalItems, row.films);
  };
  
  const mapObjToUsers = (row) => {
    if (!row) return undefined;
    return new Users(row.totalPages, row.currentPage, row.totalItems, row.users);
  };
  
  const mapObjToReview = (row) => {
    if (!row) return undefined;
    return new Review(row.filmId, row.reviewerId, row.completed, row.reviewDate, row.rating, row.reviewText, row.active);
  };
  
  const mapObjToReviews = (row) => {
    if (!row) return undefined;
    return new Reviews(row.totalPages, row.currentPage, row.totalItems, row.reviews, row.filmId);
  };
  
  export {
    mapObjToUser,
    mapObjToFilm,
    mapObjToFilms,
    mapObjToUsers,
    mapObjToReview,
    mapObjToReviews
  };
  