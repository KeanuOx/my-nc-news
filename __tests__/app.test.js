const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")


/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data)
})

afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});
describe("GET /api/topics", () => {
  test("200: Responds with an array of all the topics including slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.topics).toEqual(data.topicData)
      })
  })
})
describe("GET /api/articles/:article_id", () =>{
  test("200: Responds with the correct article object with all the correct properties", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      const article = body.article
      expect(article.title).toBe("Living in the shadow of a great man")
      expect(article.topic).toBe("mitch")
      expect(article.author).toBe("butter_bridge")
      expect(article.body).toBe("I find this existence challenging")
      expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
      expect(article.votes).toBe(100)
      expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
     })
  })
  test("400: Responds with an error message when the article id is invalid", () =>{
    return request(app)
    .get("/api/articles/banana")
    .expect(400)
    .then(({body}) => {
      const error = body
      expect(error.msg).toEqual("Invalid article id")
    })
  })
  test("404: Responds with an error message when the article provided doesn't exist", () =>{
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({body}) =>{
      const error = body
      expect(error.msg).toBe("Couldn't find article")
    })
  })
  })


describe("Not found error", () =>{
  test("404: responds with not found when the given path isn't available", () => {
    return request(app)
    .get("/api/topi")
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({msg: "Route not found"})
    })
  });
})
