import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap/'
import Select from 'react-select'
import _ from 'lodash'


function IssueReviewTable(props) {
  let userId = "-1";

  useEffect(() => {
    props.getUsers(props.filmManager);
  }, []);

  const usersOptions = _.map(props.users, (id, index) => ({
    value: props.users[index].userId,
    label: props.users[index].userName,
  }))

  const handleUsersDropdown = (e) => {
    userId = e.value;
  }

  function assignUsers() {
    var chosenUser = null;
    for (const user of props.users) {
      if (user.userId == userId) {
        chosenUser = user;
      }
    }
    if (chosenUser != null) {
      props.issueReview(props.film, [chosenUser.userId]);
    }
  }

  return (
    <div>
      <p className="mb-3" style={{ fontSize: '1.2rem' }}>Select the user:</p>

      <Select
        options={usersOptions}
        onChange={handleUsersDropdown}
        className="mb-4 w-50"
      />

      <Button
        onClick={assignUsers}
        variant="outline-primary"
        size="lg"
        className="fixed-right mt-4"
      >
        Issue Review
      </Button>
    </div>
  );
}

export default IssueReviewTable;