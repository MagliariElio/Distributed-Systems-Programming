## JSON Schemas

This directory contains JSON schemas divided into four subfolders, each representing a different resource. The schemas are designed to ensure a robust and consistent structure for data validation during various operations.

## Folder Structure

### 1. `film`
This folder contains two JSON schemas:
- **Schema for Film Creation**
- **Schema for Film Update**

The separation ensures a rigid and solid validation structure for fields required during creation and update, as each operation involves different field requirements. For example:
- The `private` field is mandatory during creation but must not be present during updates, as the nature of a film cannot be changed once created.

This approach allows immediate detection of unnecessary fields, optimizing bandwidth usage and improving application performance in data handling and validation. Depending on the value of the `private` field during creation, additional fields may be mandatory.

### 2. `user`
This folder contains a single JSON schema for user authentication. The schema validates that only the `email` and `password` fields are present and required for the operation.

### 3. `review`
This folder contains two JSON schemas:
- **Schema for Review Creation**
- **Schema for Review Update**

The schemas address different needs:
- **Review Creation**: The schema includes an array of integers representing the IDs of reviewers the film owner wishes to invite. This allows the owner to send invitations to multiple reviewers in a single request instead of making individual requests for each reviewer, requiring only the IDs.
- **Review Update**: The schema requires the `reviewDate` field, and makes the `rating` and `reviewText` fields optional, but at least one of them must be present in the request. This has been designed this way because it makes more sense to include the date when the review was completed and at least one of the fields, either `rating` or `reviewText`.

### 4. `edit-review-request`
This folder also contains two JSON schemas:
- **Schema for Edit Review Request Creation**
- **Schema for Edit Review Request Update**

The separation is necessary because the two operations require different fields:
- **Creation**: The `deadline` field is required to define the request's expiration date.
- **Update**: Only the `status` field is required, with acceptable values being `accepted` or `rejected`.

Using separate schemas ensures accurate validation of incoming objects automatically, without additional code complexity.

Validation at the schema level eliminates unnecessary fields early in the process, ensuring that only relevant data is processed. This contributes to optimized performance by saving bandwidth and enhancing the application's efficiency in managing resources. Additionally, clearly defined structures make maintenance more straightforward, simplifying updates and debugging efforts.