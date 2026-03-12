# Posts management API

## Project Description

This repository contains the code to run a medium-like API, with the help of Postman/Bruno/ThunderClient, or any API client that you like, as there is no user interface here. 
The API is divided in 4 main routes, which are /posts, /tags, /comments, et /notifications. You can see the detail of every endpoint available a bit later in this document.

## Prerequisites

To be able to run this project, you must have node.js downloaded on your computer, the version used to create this project was 25.5.0, try to aim for this version or a newer one.

## Installation

To install this project, you must :
1. Clone it in and IDE using the GitHub clone tool, and install the dependencies by using the terminal in your IDE and typing "npm install".

2. Create a file named ".env" at the root of your project, and putting 3 variables in it :
PORT : The port you want your server to run on (example PORT=3000)
DATABASE_URL : The name of your database file if you want to change from the default one : DATABASE_URL=database.sqlite
NODE_ENV : Example : NODE_ENV=development

3. If you use the database file already provided, it will be set up with basic data, detailed later. You can run a seed script to populate any database file you want with the basic data by running "npm run seed" in your IDE terminal (THIS IS MANDATORY IF YOU USE AN OTHER DATABASE FILE)

4. You can now run the command "npm run build" to check that everything is okay, and after that "npm run start" and you are ready !

## API Documentation

Once the server is running with "npm run start", you can access the API documentation and see and try every endpoint. Some will need a bearer token to be used, that you can get by using the endpoint /auth/login with in the body of your request a JSON containing the username and password of the user you want to use (the token "represents" your user).

## Testing 

To try the different premade tests, you just have to run in the terminal the commands "npm run test" for the unit tests and "npm run test:e2e" for the integration tests


## Seed data 

The basic data in the database will contain 4 users, each one with a different role : "reader, writer, moderator, admin" and 4 posts written by the "writer" user, all in a different status : "draft, waiting, accepted, rejected". The username and password of each role are "username : `role`_user password : password123"


