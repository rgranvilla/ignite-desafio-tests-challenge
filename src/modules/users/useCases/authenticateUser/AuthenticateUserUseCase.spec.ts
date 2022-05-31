import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);


  })

  it("should be authenticate an exist user", async () => {
    const user = {
      name: "user",
      email: "user@example.com",
      password: "password",
    };

    await createUserUseCase.execute(user);

    const authenticateUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(authenticateUser).toHaveProperty("token");
  })

  it("shouldn't be able to authenticate an nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'johndoe@mail.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(AppError);
  })

  it('should not be able to authenticate with incorrect password', () => {
    expect(async () => {
      const user = {
        name: "user",
        email: "user@example.com",
        password: "password",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'invalid',
      })
    }).rejects.toBeInstanceOf(AppError);
  })

})
