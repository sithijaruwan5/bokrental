# API Documentation
##  Auth API



### 1. User Registration
POST `API_BASE_URL/api/auth/register`


Request Body: JSON
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "************"
}
```
### 2. User Login
POST `API_BASE_URL/api/auth/login`


Request Body: JSON
```json
{
  "email": "john@example.com",
  "password": "************"
}
```
##  Book API

### 1. Add Book (Admin)
POST `API_BASE_URL/api/books/add`  

Headers:  `Authorization: Bearer <token>`

Request Body: JSON  
```json
{
  "title": "The Great Adventure",
  "author": "John Smith",
  "isbn": "9780147514013",
  "genre": "FICTION"
}

```

### 2. Update Book  (Admin)
PUT `API_BASE_URL/api/books/update`  

Headers:  `Authorization: Bearer <token>`

Request Body: JSON  
```json
{
  "id": 1,
  "title": "The Great Adventure - Updated",
  "author": "John Smith",
  "isbn": "9780147514013",
  "genre": "FICTION"
}

```
### 3. Get All Books 
GET `API_BASE_URL/api/books/all` 

Headers:  `Authorization: Bearer <token>` 

### 4. Delete Book  (Admin)
DELETE `API_BASE_URL/api/books/delete/{id}`  

Headers:  `Authorization: Bearer <token>`

## Rental API

### 1. Rent Book 
POST `API_BASE_URL/api/rentals/rent`  

Headers:  `Authorization: Bearer <token>`

Request Body: JSON  
```json
{
  "bookId": 1
}
```

### 2. Return Book  
POST `API_BASE_URL/api/rentals/return/{rentalId}`  

Headers:  `Authorization: Bearer <token>`



### 3. Get All Rentals (Admin)
GET `API_BASE_URL/api/rentals/all` 

Headers:  `Authorization: Bearer <token>` 


### 4. Get Rentals by Logged-in User
GET `API_BASE_URL/api/rentals/user` 

Headers:  `Authorization: Bearer <token>` 

### 5. Extend Rental Date
POST `API_BASE_URL/api/rentals/extenddate/{rentalId}`  

Headers:  `Authorization: Bearer <token>`
