import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Form, Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film } from '../models/Film';

const PrivateFilmForm = (props) => {
  const [title, setTitle] = useState(props.film ? props.film.title : '');
  const [favorite, setFavorite] = useState(props.film ? props.film.favorite : false);
  const [watchDate, setWatchDate] = useState(props.film ? ((props.film.watchDate != undefined && props.film.watchDate != "") ? props.film.watchDate.format('YYYY-MM-DD') : "") : dayjs().format('YYYY-MM-DD'));
  const [rating, setRating] = useState(props.film?.rating || 0);

  const navigate = useNavigate();
  const location = useLocation();

  const nextpage = location.state?.nextpage || '/';

  const handleSubmit = (event) => {
    event.preventDefault();

    const owner = props.film ? props.film.owner : sessionStorage.getItem("userId");
    var film;
    if (props.film != undefined) {
      film = new Film({
        id: props.film.id,
        title: title.trim(),
        owner: parseInt(owner),
        watchDate: watchDate,
        rating: rating,
        favorite: favorite,
        privateFilm: true,
        self: props.film.self,
        update: props.film.update,
        deleteLink: props.film.delete,
        reviews: props.film.reviews,
        selection: props.film.selection
      });
    } else {
      film = new Film({
        title: title.trim(),
        owner: parseInt(owner),
        privateFilm: true,
        watchDate: watchDate,
        rating: rating,
        favorite: favorite
      });
    }

    if (props.film === undefined) {
      props.addFilm(props.filmManager, film);
    } else {
      props.editFilm(film);
    }

    navigate('/private', { state: { refresh: true } });
  }

  return (
    <Form className="block-example border border-primary rounded mb-5 p-4 form-padding" onSubmit={handleSubmit}>
      <Form.Group className="mb-4">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          required
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Enter Film Title"
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Private Film</Form.Label>
        <Form.Control
          type="text"
          value={'True'}
          readOnly
          disabled
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Check
          custom
          type="checkbox"
          label="Favorite"
          name="favorite"
          checked={favorite}
          onChange={(event) => setFavorite(event.target.checked)}
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mb-4">
            <Form.Label>Watch Date</Form.Label>
            <Form.Control
              type="date"
              value={watchDate}
              max={dayjs().format("YYYY-MM-DD")}
              onChange={(event) => setWatchDate(event.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-4">
            <Form.Label>Rating</Form.Label>
            <Form.Select
              aria-label="Rating"
              value={rating}
              onChange={event => setRating(event.target.value)}
            >
              {[...Array(11)].map((v, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <ButtonGroup className='mb-3'>
          <Button className="me-2" variant="danger" onClick={() => navigate(nextpage)}><i className="bi bi-x-circle me-1" /> Cancel</Button>
          <Button variant="success" type="submit"><i className="bi bi-save me-1" /> Save</Button>
        </ButtonGroup>
      </Row>

    </Form>
  );
}

export default PrivateFilmForm;
