import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJall4WWpsbFltTTJNV0psWkRFeU9EQTVNR1ZqTURCbVpDSXNJbVZ0WVdsc0lqb2labUZvYVcxQVoyMWhhV3d1WTI5dElpd2lhV0YwSWpveE5qTTVOVGMwTkRjd2ZRLndwNW5xSmJNaW5uZ2s0SUwzd2lZNGlyVmtQeGpwdGJ4UC1mSVpJQ0N1NzgifQ==

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjllYmM2MWJlZDEyODA5MGVjMDBmZCIsImVtYWlsIjoiZmFoaW1AZ21haWwuY29tIiwiaWF0IjoxNjM5NTc0NDcwfQ.wp5nqJbMinngk4IL3wiY4irVkPxjptbxP-fIZICCu78

export function signin() {
  //Build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "fahim@gmail.com",
  };

  //Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object. {jwt: My JWT}
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and  Base64 encode it
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string that the cookie with encoded data
  return [`express:sess=${base64}`];

  // const email = "fahim@gmail.com";
  // const password = "1234567";

  // const response = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email,
  //     password,
  //   })
  //   .expect(201);

  // const cookie = response.get("Set-Cookie");
  // return cookie;
}
