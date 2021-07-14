import supertest from "supertest";
import { validate } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { app } from "../app";

describe("Todos", () => {
  afterEach(() => jest.clearAllMocks());
  test("should be able to list all Todos", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u1",
    });
    const id = uuidv4();

    const todoResponse = await supertest(app)
      .post("/todos")
      .send({
        title: "Make a real time app with vue.js",
        deadline: new Date("2021-07-31"),
      })
      .set("username", userResponse.body.username);

    const todosResponse = await supertest(app)
      .get("/todos")
      .set("username", userResponse.body.username);

    expect(todoResponse.statusCode).toBe(200);
    expect(todosResponse.statusCode).toBe(200);
    expect(todosResponse.body).toEqual(
      expect.arrayContaining([todoResponse.body])
    );
  });
  test("should to able to create a new Todo", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u2",
    });

    const newDate = new Date();

    const todoResponse = await supertest(app)
      .post("/todos")
      .send({
        title: "Make a real time app with vue.js",
        deadline: newDate,
      })
      .set("username", userResponse.body.username);

    expect(todoResponse.body).toMatchObject({
      title: "Make a real time app with vue.js",
      deadline: newDate.toISOString(),
      done: false,
    });
    expect(validate(todoResponse.body.id)).toBeTruthy();
    expect(todoResponse.body.created_at).not.toBeUndefined();
  });
  test("should to able to update a todo", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u3",
    });

    const todoResponse = await supertest(app)
      .post("/todos")
      .send({
        title: "Make a real time app with vue.js",
        deadline: new Date("2021-07-31"),
      })
      .set("username", userResponse.body.username);

    const date = new Date("2021-08-31");

    const todoUpdated = await supertest(app)
      .put(`/todos/${todoResponse.body.id}`)
      .send({
        title: "Make a game app with python",
        deadline: date,
      })
      .set("username", userResponse.body.username);

    expect(todoUpdated.body).toMatchObject({
      title: "Make a game app with python",
      deadline: todoUpdated.body.deadline,
    });
  });
  test("should not be able to update a non existing todo", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u4",
    });
    const date = new Date("2021-08-31");

    const todoUpdated = await supertest(app)
      .put(`/todos/asd-asd-asd`)
      .send({
        title: "Make a game app with python",
        deadline: date,
      })
      .set("username", userResponse.body.username);

    expect(todoUpdated.statusCode).toBe(400);
  });
  test("should be able to mark a todo as done", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u5",
    });

    const todoResponse = await supertest(app)
      .post("/todos")
      .send({
        title: "Make a real time app with vue.js",
        deadline: new Date("2021-07-31"),
      })
      .set("username", userResponse.body.username);

    const todoDone = await supertest(app)
      .patch(`/todos/${todoResponse.body.id}/done`)
      .set("username", userResponse.body.username);

    expect(todoDone.body.done).toBeTruthy();
  });
  test("should not be able to mark a existing todo as done", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u6",
    });

    const todoDone = await supertest(app)
      .patch(`/todos/asd-asd-asd/done`)
      .set("username", userResponse.body.username);

    expect(todoDone.statusCode).toBe(400);
  });
  test("should be able to delete a todo", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u7",
    });

    const todoResponse = await supertest(app)
      .post("/todos")
      .send({
        title: "Make a real time app with vue.js",
        deadline: new Date("2021-07-31"),
      })
      .set("username", userResponse.body.username);

    const todoDeleted = await supertest(app)
      .delete(`/todos/${todoResponse.body.id}`)
      .set("username", userResponse.body.username);

    expect(todoDeleted.statusCode).toBe(200);
  });
  test("should not be able to delete a not existing todo", async () => {
    const userResponse = await supertest(app).post("/users").send({
      name: "John Doe",
      username: "u8",
    });

    const todoDeleted = await supertest(app)
      .delete(`/todos/asdasdasd`)
      .set("username", userResponse.body.username);

    expect(todoDeleted.statusCode).toBe(400);
  });
});
