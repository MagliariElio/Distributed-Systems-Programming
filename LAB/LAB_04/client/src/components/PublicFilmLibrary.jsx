import React from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Pagination from 'react-js-pagination';

function PublicFilmTable(props) {
  const handlePageChange = (pageNumber) => {
    props.refreshFilms(pageNumber);
  };

  return (
    <>
      <Table striped bordered hover responsive className="mb-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Actions</th>
            <th className='text-center'>Film Title</th>
            <th className="text-center">Reviews</th>
            <th className="text-center">Issue Review</th>
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
            props.films.map((film) => (
              <PublicFilmRow
                filmData={film}
                key={film.id}
                id={film.id}
                deleteFilm={props.deleteFilm}
                updateFilm={props.updateFilm}
              />
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Pagination
            itemClass="page-item"
            linkClass="page-link"
            activePage={parseInt(sessionStorage.getItem('currentPage'))}
            itemsCountPerPage={parseInt(sessionStorage.getItem('totalItems')) / parseInt(sessionStorage.getItem('totalPages'))}
            totalItemsCount={parseInt(sessionStorage.getItem('totalItems'))}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            pageSize={parseInt(sessionStorage.getItem('totalPages'))}
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

function PublicFilmRow(props) {
  const location = useLocation();
  return (
    <tr>
      <td className="text-center">
        {/* Actions for the owner */}
        {props.filmData.owner == sessionStorage.getItem('userId') && (
          <>
            <Link to={`/public/edit/${props.filmData.id}`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
              <Button variant="outline-primary" size="sm" className="mr-2">
                <i className="bi bi-pencil-square" /> Edit
              </Button>
            </Link>
            &nbsp;&nbsp;
            <Link to="#" onClick={() => props.deleteFilm(props.filmData)}>
              <Button variant="outline-danger" size="sm">
                <i className="bi bi-trash" /> Delete
              </Button>
            </Link>
          </>
        )}
      </td>
      <td>
        <p className={['text-center', props.filmData.favorite ? 'bi-favorite text-danger' : ''].join(' ')}>
          {props.filmData.title}
        </p>
      </td>
      <td className="text-center">
        <Link to={`/public/${props.filmData.id}/reviews`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
          <Button variant="info" size="sm">
            <i className="bi bi-chat-left-dots" /> Read Reviews
          </Button>
        </Link>
      </td>
      <td className="text-center">
        {props.filmData.owner == sessionStorage.getItem('userId') && (
          <Link to={`/public/${props.filmData.id}/issue`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
            <Button variant="secondary" size="sm">
              <i className="bi bi-file-earmark-text" /> Issue Review
            </Button>
          </Link>
        )}
      </td>
    </tr>
  );
}

export default PublicFilmTable;
