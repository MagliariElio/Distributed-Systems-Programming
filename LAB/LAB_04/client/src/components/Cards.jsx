import React from 'react';
import { Card, Icon, Header } from 'semantic-ui-react';

const Cards = (props) => {
  const { id, name, selectedInfo } = props;

  return (
    <Card className="card-hover-effect">
      <Card.Content>
        <div className="d-flex align-items-center justify-content-center">
          <Icon name="user circle" size="large" color="blue" />
          <Header as="h3" className="m-3" style={{ fontWeight: 'bold', color: '#333' }}>
            {name}
          </Header>
        </div>
      </Card.Content>

      <Card.Content className='d-flex justify-content-center' style={{ fontSize: '16px', fontWeight: 'bold' }}>
        <strong>User ID:</strong> {id}
      </Card.Content>

      <Card.Content extra className='d-flex justify-content-center'>
        {selectedInfo.filmId ? (
          <>
            <Icon name="film" color="teal" />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
              <div style={{ marginLeft: '10px' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                  Film Selected
                </span>
                <div style={{ fontSize: '14px', marginTop: '5px' }}>
                  <div><strong>Film ID:</strong> {selectedInfo.filmId}</div>
                  <div><strong>Film Title:</strong> {selectedInfo.filmTitle}</div>
                </div>
              </div>
            </span>
          </>
        ) : (
          <>
            <Icon name="ban" color="red" />
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Film not selected</span>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

// CSS for hover effect and better appearance
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default Cards;
