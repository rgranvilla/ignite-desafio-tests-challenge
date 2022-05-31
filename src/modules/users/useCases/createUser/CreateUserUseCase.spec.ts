import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
    })

    expect(user).toHaveProperty('id');
  })

  it("shouldn't be create an user already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user",
        email: "user@example.com",
        password: "password",
      })
      await createUserUseCase.execute({
        name: "user",
        email: "user@example.com",
        password: "password",
      })
    }).rejects.toBeInstanceOf(AppError);
  })
})
