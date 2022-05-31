import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";



let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show Profile User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  })

  it("should be able to show a profile of existing user", async () => {
    const { id } = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
    })


    const profile = await showUserProfileUseCase.execute(id);

    expect(profile).toHaveProperty("id");
    expect(profile).toHaveProperty("name", "user");
    expect(profile).toHaveProperty("email", "user@example.com");
    expect(profile).toHaveProperty("password");
  })
})
