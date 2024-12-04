import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film } from '../models/Film';

const PublicFilmForm = (props) => {
  const [title, setTitle] = useState(props.film ? props.film.title : '');
  const [privateFilm, setPrivateFilm] = useState(props.film ? props.film.private : false);

  const navigate = useNavigate();
  const location = useLocation();

  const nextpage = location.state?.nextpage || '/public';

  const handleSubmit = (event) => {
    event.preventDefault();

    const owner = props.film ? props.film.owner : sessionStorage.getItem("userId");
    var film;
    if (props.film != undefined) {
      film = new Film({ "id": props.film.id, "title": title.trim(), "owner": parseInt(owner), "privateFilm": privateFilm, "self": props.film.self, "reviews": props.film.reviews });
    } else {
      film = new Film({ "title": title.trim(), "owner": parseInt(owner), "privateFilm": privateFilm });
    }

    if (props.film === undefined) {
      props.addFilm(props.filmManager, film);
    }
    else {
      props.editFilm(film);
    }

    navigate('/public');
  }

  return (
    <Form className="block-example border border-primary rounded mb-0 form-padding" onSubmit={handleSubmit}>
      <Row>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} />
        </Form.Group>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Active</Form.Label>
            <Form.Control
              type="text"
              value={props.film.active ? 'True' : 'False'}
              readOnly
              disabled
            />
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label>Private Film</Form.Label>
            <Form.Control
              type="text"
              value={privateFilm ? 'True' : 'False'}
              readOnly
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className='mt-4'>
        <ButtonGroup className='mb-3'>
          <Button className="me-2" variant="primary" type="submit">Save</Button>
          <Button variant="danger" onClick={() => navigate(nextpage)} >Cancel</Button>
        </ButtonGroup>
      </Row>
    </Form>
  )
}

export default PublicFilmForm;
