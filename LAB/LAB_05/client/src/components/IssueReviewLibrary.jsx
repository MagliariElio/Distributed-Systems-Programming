import React, { useEffect, useState } from 'react';
import { Button, Row } from 'react-bootstrap/'
import Select from 'react-select'
import _ from 'lodash'
import { ButtonGroup } from 'semantic-ui-react';

function IssueReviewTable(props) {
  const [userId, setUserId] = useState('-1');
  const [assignedUsers, setAssignedUsers] = useState([]);

  const usersOptions = _.map(props.users, (user) => ({
    value: user.userId,
    label: user.userName,
  }));

  const availableUsersOptions = usersOptions.filter(option =>
    !assignedUsers.some(assigned => assigned.value === option.value)
  );

  useEffect(() => {
    props.getUsers(props.filmManager);
  }, []);

  const handleUsersDropdown = (e) => {
    setUserId(e.value);
  }

  function assignUsers() {
    const chosenUser = props.users.find(user => user.userId === userId);

    if (chosenUser != null && !assignedUsers.some(user => user.userId === chosenUser.userId)) {
      setAssignedUsers(prevAssignedUsers => [
        ...prevAssignedUsers,
        { value: chosenUser.userId, label: chosenUser.userName }
      ]);

      props.issueReview(props.film, [chosenUser.userId]);
      setUserId("-1");
    }
  }

  return (
    <div>
      <p className="mb-3" style={{ fontSize: '1.2rem' }}>Select the user:</p>

      <Select
        options={availableUsersOptions}
        onChange={handleUsersDropdown}
        value={userId === "-1" ? null : { value: userId, label: props.users.find(user => user.userId === userId)?.userName }}
        className="mb-4 w-50"
      />

      <ButtonGroup className='mt-4'>
        <Button
          onClick={assignUsers}
          variant="outline-primary"
          size="lg"
          className="fixed-right me-2"
          disabled={userId === '-1'}
        >
          Issue Review
        </Button>

        <Button
          variant="outline-danger"
          onClick={() => setUserId('-1')}
          disabled={userId === '-1'}>
          Clear Selection
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default IssueReviewTable;