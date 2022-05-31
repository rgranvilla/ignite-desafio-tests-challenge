import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";





let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;


describe("Get Balance User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );

  })

  it("should be able to list a transaction by operation id", async () => {
    const { id: user_id } = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
    })

    const transaction = {
      user_id,
      type: "deposit",
      amount: 9000.00,
      description: 'e-commerce development'
    } as ICreateStatementDTO;

    const { id: statement_id } = await createStatementUseCase.execute(transaction);

    const statementOperation = await getStatementOperationUseCase.execute({ user_id, statement_id });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
    expect(statementOperation).toHaveProperty("type");
    expect(statementOperation).toHaveProperty("amount");
    expect(statementOperation).toHaveProperty("description");
    expect(statementOperation.id).toEqual(statement_id);
    expect(statementOperation.user_id).toEqual(user_id);
    expect(statementOperation.amount).toBe(9000);
    expect(statementOperation.type).toBe("deposit");
  })
})
