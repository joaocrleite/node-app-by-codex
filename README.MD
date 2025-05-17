# NodeJS App

This simple Express server demonstrates how to integrate with the public JSONPlaceholder service.

## Running the server

```
npm start
```

The server starts on port 3000 and exposes a small REST API.

### Available endpoints

- `GET /users` – list users from the remote service
- `GET /users/:userId` – fetch a single user
- `POST /users` – create a new user
- `DELETE /users/:userId` – delete a user

These endpoints proxy requests to `https://jsonplaceholder.typicode.com/users`.
