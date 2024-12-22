import React from 'react';
import { ListGroup } from 'react-bootstrap/';
import { NavLink } from 'react-router-dom';

/**
 * 
 * This component requires:
 * - the list of filters labels to show,
 * - the filter that is currently selected,
 * - the handler to notify a new selection.
 */
const RouteFilters = (props) => {
  const { items, selected } = props;

  return (
    <ListGroup as="ul" variant="flush" className="p-2">
      {items.map((item) => (
        <NavLink
          key={item}
          to={`/${item}`}
          style={{ textDecoration: 'none' }}
        >
          <ListGroup.Item
            as="li"
            key={item}
            action
            active={selected === item}
            className={`d-flex align-items-center py-3 px-4 my-1 rounded-3 ${selected === item ? 'bg-primary text-white fw-bold' : 'text-dark hover-list-item'}`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1).replace('/', ' ').replace('_', ' ')}
          </ListGroup.Item>
        </NavLink>
      ))}
    </ListGroup>
  );
};

export { RouteFilters };