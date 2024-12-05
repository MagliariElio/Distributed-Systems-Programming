import React from 'react';
import Card from './Cards';
import { Container, Row, Col } from 'react-bootstrap';

const OnlineList = ({ usersList }) => {
  return (
    <Container fluid className="p-1">
      <Row className="g-4">
        {usersList.map(user => {
          const selectedInfo = usersList.find(u => u.userId === user.userId);

          return (
            <Col key={user.userId} xs={12} md={6} lg={4} className="d-flex justify-content-center">
              <Card selectedInfo={selectedInfo} id={user.userId} name={user.userName} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default OnlineList;
