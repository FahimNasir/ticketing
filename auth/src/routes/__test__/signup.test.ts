import request from "supertest";
import { app } from "../../app";

it("returns a 201 on sueccessfuly signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "tasdadad",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "tasdadad",
      password: "1",
    })
    .expect(400);
});

it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "fahim@gmail.com",
      password: "1",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "1",
    })
    .expect(400);
});

it("disallowes duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "fahim@gmail.com",
      password: "1234567",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "fahim@gmail.com",
      password: "1234567",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "fahim@gmail.com",
      password: "1234567",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
