## REST APIs Implementation

This folder contains the code for the **Film Manager Service** server. Below is a guide to set up and run the server, as well as use the database and test the API.

---

## Starting the Server
Navigate to this folder in your terminal and choose one of the following commands to start the server:

### Option 1: Using `nodemon`
```bash
nodemon index.js
```
> **Note:** Before using this command, run:
```bash
npm install
```
This installs all required dependencies.

### Option 2: Using `npm start`
```bash
npm start
```
This command automatically handles the setup and does not require an explicit `npm install` beforehand.

### Option 3: Using `node`
```bash
node index.js
```
> **Note:** Like Option 1, ensure you run:
```bash
npm install
```
first to install all necessary libraries.

- Ensure you are in the root directory of this project when running any commands.
- Always run `npm install` at least once to install all necessary dependencies.

---

## Database Setup
In the `database` folder, there is:
- A schema for the database.
- A prepopulated SQLite database file (`database.db`) containing example data to start using the application immediately.

The server automatically builds this database at startup for data persistence. No additional setup is required for the database.

---

## User Accounts
The following user accounts are pre-configured for access to the application:

| User ID | Email                          | Password    |
|---------|--------------------------------|-------------|
| 1       | user.dsp@polito.it            | password    |
| 2       | frank.stein@polito.it         | shelley97   |
| 3       | karen.makise@polito.it        | fg204v213   |
| 4       | rene.regeay@polito.it         | historia    |
| 5       | beatrice.golden@polito.it     | seagulls    |
| 6       | arthur.pendragon@polito.it    | holygrail   |

### Recommended for Testing
- User 1: `user.dsp@polito.it` / `password`
- User 5: `beatrice.golden@polito.it` / `seagulls`

It is possible to test all endpoints with Postman using just one user (User 1) because all tests are designed not to require switching users each time. User 1 covers all possible roles in the system.

---

## Postman Collection
A Postman collection is included to facilitate API testing.
- Import the Postman collection JSON file `DSP-EXAM.postman_collection.json` located in the `REST APIs Design` folder into your Postman application.
- All available `endpoints are documented`.
- Example requests for each endpoint are provided.
- Pre-configured user accounts (such as User 1) are already set up for quick testing.

An important feature of Postman is the ability to perform automated tests. Each request has multiple examples, where each one aims to test a different case for the endpoint to observe the various response types and HTTP status codes. However, the simple test I have written to verify the response status code is valid only for the main request and not for the example requests, as it's not possible to differentiate tests between the examples. In any case, if those tests are not necessary, they can be skipped.

![Run Collection Postman Image](../REST%20APIs%20Design/run_collection_postman_image.png)