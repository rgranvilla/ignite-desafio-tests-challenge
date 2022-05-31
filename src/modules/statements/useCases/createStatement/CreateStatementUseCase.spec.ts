import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { AppError } from "@shared/errors/AppError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";





let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Statement Operations", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    )

  })

  it("should be able to create a deposit statement", async () => {
    const { id } = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
    })

    const transaction = {
      user_id: id,
      type: "deposit",
      amount: 9000.00,
      description: 'e-commerce development'
    } as ICreateStatementDTO;

    const result = await createStatementUseCase.execute(transaction);

    expect(result).toHaveProperty("id");
  })

  it("it must be possible to withdraw from an account with a positive balance", async () => {
    const { id } = await createUserUseCase.execute({
      name: "user",
      email: "user@example.com",
      password: "password",
    })

    const transactionDeposit = {
      user_id: id,
      type: "deposit",
      amount: 1000.00,
      description: 'website maintenance'
    } as ICreateStatementDTO;

    const transactionWithdraw = {
      user_id: id,
      type: "withdraw",
      amount: 1000.00,
      description: 'apartment rent'
    } as ICreateStatementDTO;

    await createStatementUseCase.execute(transactionDeposit);
    const result = await createStatementUseCase.execute(transactionWithdraw);

    expect(result).toHaveProperty("id");
  })

  it("it should not be possible to withdraw from an account without a positive balance", () => {
    expect(async () => {

      const { id } = await createUserUseCase.execute({
        name: "user",
        email: "user@example.com",
        password: "password",
      })

      const transactionDeposit = {
        user_id: id,
        type: "deposit",
        amount: 500.00,
        description: 'website maintenance'
      } as ICreateStatementDTO;

      const transactionWithdraw = {
        user_id: id,
        type: "withdraw",
        amount: 1000.00,
        description: 'apartment rent'
      } as ICreateStatementDTO;

      await createStatementUseCase.execute(transactionDeposit);
      await createStatementUseCase.execute(transactionWithdraw);
    }).rejects.toBeInstanceOf(AppError)
  })
})
