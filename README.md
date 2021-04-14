# JWT Auth boilerplate with Express ☠️

Create `.env` file in root folder with following properties.

```dotenv
PORT=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRES=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRES=
```

Example `.env` file is below.

```dotenv
PORT=3000
ACCESS_TOKEN_SECRET=sample_access_secret
ACCESS_TOKEN_EXPIRES=30m
REFRESH_TOKEN_SECRET=sample_refresh_secret
REFRESH_TOKEN_EXPIRES=30d
```

## Routes

`POST /auth/login`

This route ensures the login of the user with the request body as follows.

```json
{
  "email": "hello@example.com",
  "password": "hello@123"
}
```

Success response

```json
{
  "status": "SUCCESS",
  "token": "A long jwt token will fill this."
}
```

The token should be provided as a `Bearer token` in the Authorization header.


`POST auth/refresh`

This route refreshes the access token using refresh token. This doesn't require request body but valid cookie with token
should be provided with the request.

Success response

```json
{
  "status": "SUCCESS",
  "token": "A long jwt token will fill this."
}
```

`POST auth/logout`

This route provides logout feature by clearing up the refresh token cookie. The access token may still be valid and may
have access to restricted routes. It is recommended to remove it from the app once this action called.

Success response

```json
{
  "message": "Logout success."
}
```

Logout action requires user to be authenticated. Otherwise, error will be thrown as below.

```json
{
  "status": "ERROR",
  "message": "jwt expired"
}
```
