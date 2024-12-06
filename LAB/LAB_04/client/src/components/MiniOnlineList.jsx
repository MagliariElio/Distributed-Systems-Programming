import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { FaUserCircle } from 'react-icons/fa';

const MiniOnlineList = (props) => {
  return (
    <div className="mini-online-list-container">
      <ListGroup variant="flush" className="shadow-sm">
        <ListGroup.Item className="p-3 list-title bg-primary text-white rounded-top custom-border">
          <strong>Online Users</strong>
        </ListGroup.Item>
        {props.onlineList.length === 0 ? (
          <ListGroup.Item className="p-3 text-center text-muted">
            No users online
          </ListGroup.Item>
        ) : (
          props.onlineList.map((user) => (
            <CreateUserItem user={user} key={user.userId} />
          ))
        )}
      </ListGroup>
    </div>
  );
};

function CreateUserItem(props) {
  return (
    <ListGroup.Item className="d-flex align-items-center p-3 custom-border mb-3 rounded hover-item">
      <div className="user-icon me-3">
        <FaUserCircle size={30} color="#007bff" />
      </div>
      <div className="user-info">
        <span className="user-name fw-bold fs-5 text-dark">{props.user.userName}</span>
        <br />
        <small className="text-muted">ID: {props.user.userId}</small>
      </div>
    </ListGroup.Item>
  );
}

export default MiniOnlineList;
