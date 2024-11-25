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
  test("200: Responds with an object of all the topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.result).toEqual(data.topicData)
      })
  })
})
describe("Not found error", () =>{
  test('404: responds with not found', async () => {
    return request(app)
    .get("/api/topi")
    .expect(404)
    .then((response) =>{
      expect(response.text).toBe("{\"msg\":\"Route not found\"}")
    })
  });
})
