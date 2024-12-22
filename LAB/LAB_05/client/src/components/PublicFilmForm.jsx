import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Form, Button, Row, Col, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film } from '../models/Film';

const PublicFilmForm = (props) => {
  const [title, setTitle] = useState(props.film ? props.film.title : '');

  const navigate = useNavigate();
  const location = useLocation();

  const nextpage = location.state?.nextpage || '/public';

  const handleSubmit = async (event) => {
    event.preventDefault();

    const owner = props.film ? props.film.owner : sessionStorage.getItem("userId");

    let film;
    if (props.film) {
      film = new Film({
        id: props.film.id,
        title: title.trim(),
        owner: parseInt(owner),
        privateFilm: false,
        active: props.film.active,
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
        privateFilm: props.film?.private || false
      });
    }

    try {
      if (props.film === undefined) {
        await props.addFilm(props.filmManager, film);
      }
      else {
        await props.editFilm(film);
      }

      navigate('/public', { state: { refresh: true } });
    } catch (error) {
      console.error("Error while saving the film:", error);
    }
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
              value={props?.film?.active ? 'True' : 'False'}
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
              value={props?.film?.private ? 'True' : 'False'}
              readOnly
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className='mt-4'>
        <ButtonGroup className='mb-3'>
          <Button className="me-2" variant="danger" onClick={() => navigate(nextpage)}><i className="bi bi-x-circle me-1" />Cancel</Button>
          <Button variant="success" type="submit"><i className="bi bi-save me-1" />Save</Button>
        </ButtonGroup>
      </Row>
    </Form>
  )
}

export default PublicFilmForm;
