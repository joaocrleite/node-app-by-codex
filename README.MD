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
- `POST /users/distance` – calculate the distance from given coordinates to a user's location
- `DELETE /users/:userId` – delete a user

These endpoints proxy requests to `https://jsonplaceholder.typicode.com/users`.
The distance endpoint expects a JSON body containing `userId`, `lat` and `lng`.
