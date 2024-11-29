# Northcoders News API

## **Hosted Version**
Explore the hosted API: https://my-nc-news-t6j3.onrender.com/

## **Project Summary**
The NC News API is a RESTful web application designed to serve as the backend for a news aggregation application. It provides data on articles, topics, comments, and users, with support for sorting, filtering, and CRUD operations.

## **Getting Started**

### **Cloning the Repository**
To clone this repository to your local machine:
git clone https://github.com/KeanuOx/my-nc-news/

### **Installing Dependencies**
Navigate into the project directory and install the required dependencies:
cd my-nc-news npm install

### **Seeding the Local Database**
Make sure PostgreSQL is installed and running. To set up the database:
1. Create the databases:
npm run setup-dbs

2. Seed the databases:
npm run seed

### **Running Tests**
Run the test suite to verify functionality:
npm test

## **Environment Variables**
To run this project locally, create the following `.env` files in the root directory:

1. `.env.test`  
PGDATABASE=nc_news_test

2. `.env.development`  
PGDATABASE=nc_news

These variables ensure the correct database is used for development and testing.

## **Minimum Requirements**
- **Node.js**: v16.0.0 or higher
- **PostgreSQL**: v12.0 or higher

## **Available Endpoints**
The full list of available endpoints is described in the `endpoints.json` file in the repository.


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
