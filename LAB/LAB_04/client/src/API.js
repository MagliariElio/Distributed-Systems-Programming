import { Film } from './models/Film';
import { Review } from './models/Review';
import { ReviewUpdate } from './models/ReviewUpdate';
import { User } from './models/User';
import { mapObjToFilm, mapObjToFilmUpdate } from './utils/Factory';

const SERVER = 'http://localhost:3001';

/**
 * A utility function for parsing the HTTP response.
 */
async function getJson(httpResponsePromise) {
  try {
    const response = await httpResponsePromise;

    // Verifica se la risposta esiste e se il codice di stato è valido
    if (!response) {
      throw { error: "No response from server" };
    }

    if (response.ok) {
      // La risposta del server è valida, cerchiamo di fare il parsing del JSON
      try {
        const text = await response.text();
        if (!text) {
          return {};
        }

        const json = JSON.parse(text);;
        if (json === null) {
          throw { error: "Server returned an empty or null JSON" };
        } else if (Object.keys(json).length === 0) {
          // Gestiamo il caso in cui il JSON sia un oggetto vuoto
          return json; // Risposta vuota è valida, la restituiamo comunque
        } else {
          return json;
        }
      } catch (err) {
        // Errore nel parsing del JSON
        console.error("JSON parsing error: ", err);
        throw { error: "Cannot parse server response" };
      }
    } else {
      // Errore nel lato server, cerchiamo di analizzare la risposta
      try {
        const obj = await response.json();
        if (obj) {
          throw obj;
        } else if (Object.keys(obj).length === 0) {
          // Se il corpo è vuoto ({}), trattiamo come risposta valida
          return obj;
        } else {
          throw { error: "Unknown server error" };
        }
      } catch (err) {
        // Errore nel parsing della risposta di errore
        console.error("Error parsing error response: ", err);
        throw err;
      }
    }
  } catch (err) {
    // Gestiamo gli errori di rete e altri errori imprevisti
    if (err instanceof TypeError) {
      // Tipo di errore dovuto a connessione o mancanza di rete
      throw { error: "Network error: Cannot communicate" };
    } else {
      // Altri tipi di errore imprevisti
      console.error("Unexpected error: ", err);
      throw err;
    }
  }
}

/**
 * Getting from the Film Manager resource with hyperlinks
 */
const getFilmManager = async () => {
  return getJson(fetch(SERVER + "/api")).then(fm => { return fm; })
}

/**
 * Getting from the server side and returning the list of private films.
 */
const getPrivateFilms = async (filmManager, pageNumber) => {
  let path = SERVER + filmManager["privateFilms"];
  if (pageNumber != undefined) path += '?pageNo=' + pageNumber;

  return getJson(fetch(path, { credentials: 'include' })).then(json => {
    sessionStorage.setItem('totalPages', json.totalPages);
    sessionStorage.setItem('currentPage', json.currentPage);
    sessionStorage.setItem('totalItems', json.totalItems);
    sessionStorage.setItem('filmsType', 'private');
    if (json.totalPages != 0) {
      return json.films.map(film => mapObjToFilm(film));
    } else {
      return [];
    }
  })
}

/**
 * Getting from the server side and returning the list of private films.
 */
const getPublicFilms = async (filmManager, pageNumber) => {
  let path = SERVER + filmManager["publicFilms"];
  if (pageNumber != undefined) path += '?pageNo=' + pageNumber;
  return getJson(fetch(path, { credentials: 'include' })).then(json => {
    sessionStorage.setItem('totalPages', json.totalPages);
    sessionStorage.setItem('currentPage', json.currentPage);
    sessionStorage.setItem('totalItems', json.totalItems);
    sessionStorage.setItem('filmsType', 'public');
    if (json.totalPages != 0) {
      return json.films.map(film => mapObjToFilm(film));
    } else {
      return [];
    }
  })
}


/**
 * Getting from the server side and returning the list of private films.
 */
const getPublicFilmsToReview = async (filmManager, pageNumber) => {
  let path = SERVER + filmManager["invitedPublicFilms"];
  if (pageNumber != undefined) path += '?pageNo=' + pageNumber;
  return getJson(fetch(path, { credentials: 'include' })).then(json => {
    sessionStorage.setItem('totalPages', json.totalPages);
    sessionStorage.setItem('currentPage', json.currentPage);
    sessionStorage.setItem('totalItems', json.totalItems);
    sessionStorage.setItem('filmsType', 'public');
    if (json.totalPages != 0)
      return json.films.map((film) => new Film(film));
    else
      return [];
  })
}

/**
 * Getting from the server side and returning the list of film reviews.
 */
const getFilmReviews = async (film, pageNumber) => {
  var path = SERVER + film.reviews;
  if (pageNumber != undefined) path += '?pageNo=' + pageNumber;
  return getJson(fetch(path, { credentials: 'include' })).then(json => {
    sessionStorage.setItem('totalPages', json.totalPages);
    sessionStorage.setItem('currentPage', json.currentPage);
    sessionStorage.setItem('totalItems', json.totalItems);
    if (json.totalPages != 0)
      return json.reviews.map((review) => new Review(review));
    else
      return [];
  }).catch(err => {
    sessionStorage.setItem('totalPages', 0);
    sessionStorage.setItem('currentPage', 0);
    sessionStorage.setItem('totalItems', 0);
    return [];
  })
}

/**
 * Getting and returing a film, specifying its filmId.
 */
const getFilm = async (film) => {
  return getJson(fetch(SERVER + film.self, { credentials: 'include' }))
    .then(film => {
      film.privateFilm = film.private;
      return mapObjToFilm(film);
    })
}

/**
 * This function wants a film object as parameter. If the filmId exists, it updates the film in the server side.
 */
async function updateFilm(film) {
  const updateLink = film.update;
  const filmObj = mapObjToFilmUpdate(film);

  const response = await fetch(
    SERVER + updateLink, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(filmObj) // dayjs date is serialized correctly by the .toJSON method override
  })

  if (!response.ok) {
    const error = await response.json()
    let err = { status: error.code, errObj: error.message };
    throw err;
  }

  return response.ok;
}
/**
 * This function adds a new film in the back-end library.
 */
async function addFilm(filmManager, film) {
  if (film.watchDate) {
    film.watchDate = film.watchDate.format('YYYY-MM-DD');
  }

  return await getJson(
    fetch(SERVER + filmManager["films"], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(film)
    })
  )
}

/**
 * This function deletes a film from the back-end library.
 */
async function deleteFilm(film) {
  const response = await fetch(SERVER + film.self, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json()
    let err = { status: error.code, errObj: error.message };
    throw err;
  }
  return response.ok;
}


/**
 * This function issues a new review.
 */
function issueReview(film, usersIdList) {
  const jsonUser = JSON.stringify(usersIdList);
  return getJson(
    fetch(SERVER + film.reviews, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: jsonUser
    })
  )
}


/**
 * This function deletes an issued review.
 */
async function deleteReview(review) {
  const response = await fetch(SERVER + review.self, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (!response.ok) {
    const error = await response.json()
    let err = { status: error.code, errObj: error.message };
    throw err;
  }
  return response.ok;
}

/**
 * Getting a review
 */
const getReview = async (review) => {
  return getJson(fetch(SERVER + review.self, { credentials: 'include' }))
    .then(review => { return review; })
}


/**
 * This function updates a review
 */
async function updateReview(review) {
  if (review.reviewDate)
    review.reviewDate = review.reviewDate.format('YYYY-MM-DD');

  const updateReviewObj = new ReviewUpdate({ reviewDate: review.reviewDate, rating: review.rating, reviewText: review.reviewText });

  const response = await fetch(
    SERVER + review.update, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(updateReviewObj) // dayjs date is serialized correctly by the .toJSON method override
  })
  if (!response.ok) {
    const error = await response.json()
    let err = { status: error.code, errObj: error.message };
    throw err;
  }
  return response.ok;
}

/**
 * This function selects a filmn
 */
async function selectFilm(film) {
  const response = await fetch(
    SERVER + film.selection, {
    method: 'PATCH', headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json()
    let err = { status: error.code, errObj: error.message };
    throw err;
  }
}

/**
 * This function wants email and password inside a "credentials" object.
 * It executes the log-in.
 */
const logIn = async (filmManager, credentials) => {
  return getJson(fetch(SERVER + filmManager["usersAuthenticator"], {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
  )
};


/**
 * This function is used to retrieve the users of the service.
 * It returns a JSON object with the users.
 */


async function getUsers(filmManager) {
  const response = await fetch(SERVER + filmManager['users'], {
    credentials: 'include',
  });
  const responseJson = await response.json();
  if (response.ok) {
    return responseJson.users.map((u) => new User(u));
  } else {
    let err = { status: responseJson.code, errObj: responseJson.message };
    throw err; // An object with the error coming from the server
  }

}


const API = { logIn, getUsers, getFilmManager, getPrivateFilms, getPublicFilms, getFilmReviews, updateFilm, deleteFilm, addFilm, getFilm, issueReview, deleteReview, getReview, updateReview, getPublicFilmsToReview, selectFilm };
export default API;
