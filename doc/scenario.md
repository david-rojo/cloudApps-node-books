# Nodebooks scenario

It is requested to implement a web application with a list of books and users that can review with comments each book.

Users that comment the book is an entity with properties nick and email. The nick must be unique.

The application will export a REST API that will have the following operations:

* CRUD endpoints to manage users: create, read, update email and delete operations. Only a user without comments can be deleted.
* Retrieve a list with the id and the title of each book (but not the other attributes of a book).
* Retrieve the information from a book (comments included). The comments must contain comment text and user nick and email.
* Create a book.
* Create a comment associated to a book.
* Delete a comment.
* Retrieve the comments of a user. In this case, every comment must contain the id of the book that comment.

From a technical point of view, it will be taken in account the following aspects:

* Information is stored in mongoDB.
* Application will be implemented with Node.js and Express.
* Application will be divided at least in two modules:
  * one module "server.js" that starts express server.
  * one module "bookRouter.js" that acts as REST controller.
* For access to database, moongose will be used.
* A postman collection must be included in order to test the application.