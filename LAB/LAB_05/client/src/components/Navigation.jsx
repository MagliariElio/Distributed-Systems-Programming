import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LogoutButton } from './Auth';

const Navigation = (props) => {
  return (
    <Navbar bg="primary" expand="lg" variant="dark" fixed="top" className="navbar-padding shadow-sm">
      <Link to="/">
        <Navbar.Brand>
          <i className="bi bi-collection-play icon-size me-2" />
          <span className="text-light fw-bold">Film Manager</span>
        </Navbar.Brand>
      </Link>

      <Navbar.Toggle aria-controls="navbar-nav" />

      <Navbar.Collapse id="navbar-nav">
        <Nav className="ms-auto">
          {props.user && props.user.name && (
            <Navbar.Text className="text-light my-auto me-3">
              Welcome, <strong>{props.user.name}</strong>!
            </Navbar.Text>
          )}

          {/* Logout Button */}
          <Form className="d-flex">
            {props.loggedIn ? (
              <LogoutButton logout={props.logout} filmManager={props.filmManager} />
            ) : (
              <Link to="/login">
                <Button variant="outline-light" className="ms-2">
                  <i className="bi bi-box-arrow-in-right" /> Login
                </Button>
              </Link>
            )}
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export { Navigation };
