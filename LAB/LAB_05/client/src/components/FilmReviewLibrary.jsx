import React from 'react';
import { Table, Button, OverlayTrigger, Popover, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Pagination from 'react-js-pagination';

function FilmReviewTable(props) {

  const handlePageChange = (pageNumber) => {
    props.refreshReviews(props.film, pageNumber);
  };

  return (
    <>
      <Table striped bordered hover responsive className="mb-4">
        <thead className="thead-dark">
          <tr>
            <th className="text-center">Actions</th>
            <th className='text-center'>Reviewer ID</th>
            <th className="text-center">Status</th>
            <th className='text-center'>Review Date</th>
            <th className="text-center">Rating</th>
            <th className="text-center">Review</th>
          </tr>
        </thead>
        <tbody>
          {props.reviews.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No Review available.
              </td>
            </tr>
          ) : (
            props.reviews.map((review) => (
              <FilmReviewRow
                reviewData={review}
                filmData={props.film}
                key={review.reviewerId}
                id={review.reviewerId}
                deleteReview={props.deleteReview}
                updateReview={props.updateReview}
              />
            ))
          )}
        </tbody>
      </Table>

      <Row className="justify-content-center mt-4">
        <Col xs="auto">
          <Pagination
            itemClass="page-item"
            linkClass="page-link"
            activePage={parseInt(sessionStorage.getItem('currentPage'))}
            itemsCountPerPage={parseInt(sessionStorage.getItem('totalItems')) / parseInt(sessionStorage.getItem('totalPages'))}
            totalItemsCount={parseInt(sessionStorage.getItem('totalItems'))}
            pageRangeDisplayed={10}
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

function FilmReviewRow(props) {
  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate.isValid() ? dayJsDate.format(format) : '';
  };

  const location = useLocation();

  return (
    <tr>
      <td className="text-center">
        {props.reviewData.reviewerId == sessionStorage.getItem('userId') && props.reviewData.completed === 0 && (
          <Link to={`/public/${props.reviewData.filmId}/reviews/complete`} state={[{ review: props.reviewData }, { nextpage: location.pathname }]}>
            <Button variant="outline-primary" size="sm" className="mr-2">
              <i className="bi bi-pencil-square" /> Edit
            </Button>
          </Link>
        )}
        &nbsp;
        {props.filmData.owner == sessionStorage.getItem('userId') && props.reviewData.completed === 0 && (
          <Button variant="outline-danger" size="sm" onClick={() => props.deleteReview(props.reviewData)}>
            <i className="bi bi-trash" /> Delete
          </Button>
        )}
      </td>
      <td className='text-center'>
        <p>{props.reviewData.reviewerId}</p>
      </td>
      <td className="text-center">
        {!props.reviewData.completed ? (
          <span className="text-danger">Not Completed</span>
        ) : (
          <span className="text-success">Completed</span>
        )}
      </td>
      <td className='text-center'>
        {props.reviewData.reviewDate ? (
          <small>{formatWatchDate(props.reviewData.reviewDate, 'MMMM D, YYYY')}</small>
        ) : (
          <span className="text-muted">No Date</span>
        )}
      </td>
      <td className="text-center">
        {props.reviewData.rating ? (
          <Rating rating={props.reviewData.rating} maxStars={10} />
        ) : (
          <span className="text-muted">No Rating</span>
        )}
      </td>
      <td className="text-center">
        {props.reviewData.reviewText ? (
          <OverlayTrigger
            trigger="click"
            placement="left"
            overlay={
              <Popover>
                <Popover.Header as="h3">Review</Popover.Header>
                <Popover.Body>{props.reviewData.reviewText}</Popover.Body>
              </Popover>
            }
          >
            <Button variant="outline-secondary" size="sm">
              <i className="bi bi-eye" /> View Review
            </Button>
          </OverlayTrigger>
        ) : (
          <span className="text-muted">No Review</span>
        )}
      </td>
    </tr>
  );
}

function Rating(props) {
  return [...Array(props.maxStars)].map((el, idx) => (
    <i key={idx} className={(idx < props.rating) ? "bi bi-star-fill text-warning" : "bi bi-star text-muted"} />
  ));
}

export default FilmReviewTable;
