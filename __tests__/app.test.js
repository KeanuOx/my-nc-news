const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const sort = require("jest-sorted")


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
      expect(article.article_id).toBe(1)
      expect(article.title).toBe(data.articleData[0].title)
      expect(article.topic).toBe(data.articleData[0].topic)
      expect(article.author).toBe(data.articleData[0].author)
      expect(article.body).toBe(data.articleData[0].body)
      expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
      expect(article.votes).toBe(data.articleData[0].votes)
      expect(article.article_img_url).toBe(data.articleData[0].article_img_url)
     })
  })
  test("400: Responds with an error message when the article id is invalid", () =>{
    return request(app)
    .get("/api/articles/invalid_id")
    .expect(400)
    .then(({body}) => {
      const error = body
      expect(error.msg).toEqual("Bad Request")
    })
  })
  test("404: Responds with an error message when the article provided doesn't exist", () =>{
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({body}) =>{
      const error = body
      expect(error.msg).toBe("Not found")
    })
  })
  })

describe("GET /api/articles", ()=>{
  test("200: Responds with an array of all the articles with all the correct properties, sorted by the date created in descending order", ()=>{
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) =>{
      const articles = body.articles
      expect(articles).toHaveLength(13)
      articles.forEach((article)=>{
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),

        })
      })
      expect(articles).toBeSortedBy("created_at", { descending: true, })
    })
  })
})












  describe("Not found error", () =>{
  test("404: responds with not found when the given path isn't available", () => {
    return request(app)
    .get("/api/topi")
    .expect(404)
    .then((response) => {
      expect(response.body).toEqual({msg: "Not found"})
    })
  });
})
