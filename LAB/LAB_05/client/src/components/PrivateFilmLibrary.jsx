import React from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Pagination from "react-js-pagination";

function PrivateFilmTable(props) {
  const handlePageChange = pageNumber => {
    props.refreshFilms(pageNumber);
  }

  return (
    <>
      <Table striped bordered hover responsive className="mb-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Actions</th>
            <th className='text-center'>Film Title</th>
            <th className="text-center">Favorite</th>
            <th className="text-center">Watch Date</th>
            <th className="text-center">Rating</th>
          </tr>
        </thead>
        <tbody>
          {props.films.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No films available.
              </td>
            </tr>
          ) : (
            props.films.map((film) =>
              <PrivateFilmRow
                filmData={film} key={film.id} id={film.id}
                deleteFilm={props.deleteFilm} updateFilm={props.updateFilm}
              />
            )
          )}
        </tbody>
      </Table>

      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Pagination
            itemClass="page-item"
            linkClass="page-link"
            activePage={parseInt(sessionStorage.getItem("currentPage"))}
            itemsCountPerPage={parseInt(sessionStorage.getItem("totalItems")) / parseInt(sessionStorage.getItem("totalPages"))}
            totalItemsCount={parseInt(sessionStorage.getItem("totalItems"))}
            pageRangeDisplayed={10}
            onChange={handlePageChange}
            pageSize={parseInt(sessionStorage.getItem("totalPages"))}
            firstPageText="First"
            lastPageText="Last"
            prevPageText="Prev"
            nextPageText="Next"
          />
        </Col>
      </Row>
    </>
  );
}

function PrivateFilmRow(props) {
  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate.isValid() ? dayJsDate.format(format) : '';
  }

  const location = useLocation();

  return (
    <tr>
      <td className="text-center">
        <Link to={`/private/edit/${props.filmData.id}`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
          <Button variant="outline-primary" size="sm">
            <i className="bi bi-pencil-square" /> Edit
          </Button>
        </Link>
        &nbsp;
        &nbsp;
        <Button variant="outline-danger" size="sm" onClick={() => { props.deleteFilm(props.filmData) }}>
          <i className="bi bi-trash" /> Delete
        </Button>
      </td>
      <td>
        <p className={`keep-white-space ${props.filmData.favorite ? "text-primary" : ""} text-center`}>
          {props.filmData.title}
          {props.filmData.favorite && <i className="bi bi-heart-fill ms-2 text-danger" />}
        </p>
      </td>
      <td className="text-center">
        {props.filmData.favorite || props.filmData.favorite === 1 ? (
          <span className="text-success"><i className="bi bi-check-circle" /> Favorite</span>
        ) : (
          <span className="text-danger"><i className="bi bi-x-circle" /> Not Favorite</span>
        )}
      </td>
      <td className="text-center">
        {props.filmData.watchDate ? <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small> : 'Not Set'}
      </td>
      <td className="text-center">
        <Rating rating={props.filmData.rating} maxStars={10} />
      </td>
    </tr>
  );
}

function Rating(props) {
  return (
    <div>
      {[...Array(props.maxStars)].map((el, idx) =>
        <i key={idx} className={(idx < props.rating) ? "bi bi-star-fill text-warning" : "bi bi-star text-muted"} />
      )}
    </div>
  )
}

export default PrivateFilmTable;
