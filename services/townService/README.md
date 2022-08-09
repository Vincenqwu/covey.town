# New User Signup

Sign up new user with username, password, email

**URL** : `/users/register/`

**Method** : `POST`

**JWT Auth required** : NO

**Data example** All fields must be sent.

Provide username, password, and email to register.

```json
{
    "username": "fred",
    "password": "11111111",
    "email": "fred@gmail.com"
}
```

## Success Response

**Condition** : Data is valid and new user is successfully created

**Code** : `200`

**Content example**
```json
{
    "username": "Fred",
    "password": "$2b$10$cVZNYcJlSzQ1yQ.n1JLds.KlQbAFR67mTsqf.BpZ1mTeaTcXQ28nC",
    "email": "fred@gmail.com",
    "_id": "62eb01a6f39a3a528fe53ea2",
    "createdAt": "2022-08-03T23:15:50.741Z",
    "updatedAt": "2022-08-03T23:15:50.741Z",
    "__v": 0
}
```
## Error Response

**Condition** : Username or email is not unique

**Code** : `500`

**Content** :

```json
{
    "index": 0,
    "code": 11000,
    "keyPattern": {
        "username": 1
    },
    "keyValue": {
        "username": "Fred"
    }
}
```
```json
{
    "index": 0,
    "code": 11000,
    "keyPattern": {
        "email": 1
    },
    "keyValue": {
        "email": "fred@gmail.com"
    }
}
```

# User Login

User login with username and password

**URL** : `/users/login/`

**Method** : `POST`

**JWT Auth required** : NO

**Data example** All fields must be sent.

Provide username, password, and email to register.

```json
{
    "username": "fred",
    "password": "11111111",
}
```

## Success Response

**Condition** : Username and password is successfully verified

**Code** : `200`

**Content example**
```json
{
    "message": "Auth successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkZyZWQiLCJpYXQiOjE2NTk3MjM3MDQsImV4cCI6MTY1OTc1OTcwNH0.vp2TfiQxTani40Wr2Mz5hgyacXIgM6DCirPeMn5ttro",
    "user": {
        "_id": "62eb01a6f39a3a528fe53ea2",
        "username": "Fred",
        "password": "$2b$10$cVZNYcJlSzQ1yQ.n1JLds.KlQbAFR67mTsqf.BpZ1mTeaTcXQ28nC",
        "email": "fred@gmail.com",
        "createdAt": "2022-08-03T23:15:50.741Z",
        "updatedAt": "2022-08-03T23:15:50.741Z",
        "__v": 0
    }
}
```

## Error Response

**Condition** : Username does not exist

**Code** : `404`

**Content** :

```json
"user not found"
```

**Condition** : Password is wrong

**Code** : `401`

**Content** :

```json
"wrong password"
```

# Validate User Login

validate user is logged in/authenticated

**URL** : `/users/validate/`

**Method** : `GET`

**JWT Auth required** : YES

## Success Response

**Condition** : JWT token is valid

**Code** : `200`

**Content example**
```json
{
    "message": "Token validated",
}
```
## Error Response

**Condition** : JWT token is not provided

**Code** : `401`

**Content** :

```json
{
    "message": "Unauthorized",
}
```

**Condition** : JWT token is not valid

**Code** : `404`

**Content** :

```json
{
    "message": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    },
    "err": {
        "name": "JsonWebTokenError",
        "message": "invalid signature"
    }
}
```


**Condition** : JWT token expired

**Code** : `404`

**Content** :

```json
{{
    "message": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2022-08-05T09:39:34.000Z"
    },
    "err": {
        "name": "TokenExpiredError",
        "message": "jwt expired",
        "expiredAt": "2022-08-05T09:39:34.000Z"
    }
}
```

# Delete User Account

Remove a user's account by username and all the towns created by the user

**URL** : `/users/:username/`

**Method** : `DELETE`

**JWT Auth required** : YES

**Parameter** : username

## Success Response

**Condition** : JWT is valid and username exists

**Code** : `200`

**Content example**
```json
{
    "message": "User deleted",
    "username": "Leo"
}
```

# Get User's Info

Get user's profile information with username

**URL** : `/:username`

**Method** : `GET`

**JWT Auth required** : YES

**Parameter** : username

## Success Response

**Condition** : JWT is valid and username exists

**Code** : `200`

**Content example**
```json
{
    "_id": "62e583b99726a518f352ad1d",
    "username": "vincent",
    "password": "$2b$10$JC0jX8.DDyhDLXDg91Gcu.5mR/Tm61BfD624NH11yPXDWXgFDl6ja",
    "email": "qwu@gmail.com",
    "createdAt": "2022-07-30T19:17:14.001Z",
    "updatedAt": "2022-07-30T19:17:14.001Z",
    "__v": 0
}
```

## Error Response

**Condition** : Username does not exist

**Code** : `404`

**Content** :

```json
"user not found"
```

# Get User's Towns

get all the towns created by the user by username

**URL** : `/:username/towns`

**Method** : `GET`

**JWT Auth required** : YES

**Parameter** : username

## Success Response

**Condition** : JWT is valid and username exists

**Code** : `200`

**Content example**
```json
[
    {
        "_id": "62e8687dc4e4890c41fde63c",
        "coveyTownId": "131452E4",
        "userId": "62e583b99726a518f352ad1d",
        "townUpdatePassword": "vTSGPEIyRe0lVkCvC_4lr70S",
        "isPublic": true,
        "friendlyName": "testtown",
        "capacity": 20,
        "createdAt": "2022-08-01T23:57:49.709Z",
        "updatedAt": "2022-08-01T23:57:49.709Z",
        "__v": 0
    }
]
```
## Error Response

**Condition** : username does not exist

**Code** : `404`

**Content** :

```json
user not found
```


# Update User's Profile

Update user's profile information: email and password

**URL** : `/:username`

**Method** : `PUT`

**JWT Auth required** : YES

**Parameter** : username

**Data example** 

Provide at least one of the data fields: password, email
```json
{
    "password": "22222222",
    "email": "v@gmail.com",
}
```

## Success Response

**Condition** : username exists and profile is updated successfully

**Code** : `200`

**Content example**
```json
profile has been updated
```

## Error Response

**Condition** : username does not exist

**Code** : `404`

**Content** :

```json
user not found
```

