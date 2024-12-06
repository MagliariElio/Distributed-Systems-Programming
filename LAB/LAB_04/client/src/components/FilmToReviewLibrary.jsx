import React from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Pagination from "react-js-pagination";

function FilmToReviewTable(props) {

  const handlePageChange = pageNumber => {
    props.refreshFilms(pageNumber);
  }

  return (
    <>
      <Table striped bordered hover responsive className="mb-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Actions</th>
            <th className='text-center'>Select Film</th>
            <th className='text-center'>Film Title</th>
            <th className="text-center">Read Reviews</th>
            <th className="text-center">Issue Reviews</th>
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
              <PublicFilmRow
                filmData={film} key={film.id} id={film.id}
                deleteFilm={props.deleteFilm} updateFilm={props.updateFilm}
                selectFilm={props.selectFilm} onlineList={props.onlineList}
                user={props.user}
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

function PublicFilmRow(props) {
  const location = useLocation();
  let selectedFilmId = -1;

  for (let i = 0; i < props.onlineList.length; i++) {
    if (props.onlineList[i].userId == sessionStorage.getItem('userId')) {
      selectedFilmId = props.onlineList[i].filmId;
    }
  }

  return (
    <tr>
      <td className="text-center">
        {
          props.filmData.owner == sessionStorage.getItem("userId") &&
          <Link to={`/public/edit/${props.filmData.id}`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
            <Button variant="outline-primary" size="sm">
              <i className="bi bi-pencil-square" /> Edit
            </Button>
          </Link>
        }
        &nbsp;
        &nbsp;
        {props.filmData.owner == sessionStorage.getItem("userId") &&
          <Button variant="outline-danger" size="sm" onClick={() => { props.deleteFilm(props.filmData) }}>
            <i className="bi bi-trash" /> Delete
          </Button>
        }
      </td>
      <td className="text-center">
        <Form.Check type="checkbox">
          <Form.Check.Input type="radio" checked={props.filmData.active} onChange={() => props.selectFilm(props.filmData)} />
        </Form.Check>
      </td>
      <td>
        <p className={['text-center', props.filmData.favorite ? "bi-favorite" : ""].join(' ')}>
          {props.filmData.title}
        </p>
      </td>
      <td className="text-center">
        <Link to={`/public/${props.filmData.id}/reviews`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
          <Button variant="info" size="sm">
            <i className="bi bi-chat-left-dots me-1" /> Read Reviews
          </Button>
        </Link>
      </td>
      <td className="text-center">
        {
          props.filmData.owner == sessionStorage.getItem("userId") &&
          <Link to={`/public/${props.filmData.id}/issue`} state={[{ film: props.filmData }, { nextpage: location.pathname }]}>
            <Button variant="secondary" size="sm">
              <i className="bi bi-file-earmark-text align-items-center" /> Issue Review
            </Button>
          </Link>
        }
      </td>
    </tr>
  );
}

export default FilmToReviewTable;
