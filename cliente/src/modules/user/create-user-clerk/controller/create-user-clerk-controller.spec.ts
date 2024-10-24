import { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { CreateUserClerkUseCase } from "../use-case/create-user-clerk.use-case";
import { createUserValidator } from "../../create-user/validators/create-user";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { CreateUserClerkController } from "./create-user-clerk.controller";
import { ZodError, type z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../../../middleware/errorHandler";
import type { Role, User } from "@prisma/client";
import type { CreateClientUseCase } from "../../create-user/useCase/create-user.use-case";

// vi.mock("../../../role/get-role-by-name/usecase/get-role-by-name.usecase");
// vi.mock("../../create-user/useCase/create-user.use-case");
// vi.mock("../../create-user/validators/create-user");

vi.mock(
	"../../../role/get-role-by-name/usecase/get-role-by-name.usecase",
	() => ({
		GetRoleByNameUseCase: vi.fn().mockImplementation(() => ({
			execute: vi.fn(),
		})),
	}),
);

vi.mock("../use-case/create-user-clerk.use-case", () => ({
	CreateUserClerkUseCase: vi.fn().mockImplementation(() => ({
		execute: vi.fn(),
	})),
}));

vi.mock("../../create-user/validators/create-user", () => ({
	createUserValidator: {
		parse: vi.fn(),
	},
}));

const mockedGetRoleByNameUseCase = vi.mocked(GetRoleByNameUseCase);
const mockedCreateUserClerkUseCase = vi.mocked(CreateUserClerkUseCase);

describe("Testing Create User Clerk Controller", () => {
	let createUserClerkController: CreateUserClerkController;
	let mockGetRoleByNameUseCase: InstanceType<typeof GetRoleByNameUseCase>;
	let mockCreateUserClerkUseCase: InstanceType<typeof CreateUserClerkUseCase>;

	beforeEach(() => {
		vi.clearAllMocks();

		mockGetRoleByNameUseCase = new GetRoleByNameUseCase();
		mockCreateUserClerkUseCase = new CreateUserClerkUseCase();

		createUserClerkController = new CreateUserClerkController(
			mockCreateUserClerkUseCase as unknown as CreateClientUseCase,
			mockGetRoleByNameUseCase as unknown as GetRoleByNameUseCase,
		);
	});

	// const mockCreateUserClerkController = vi.fn<CreateUserClerkController, []>(
	// 	() => {
	// 		return {
	// 			handle: vi.fn(),
	// 		};
	// 	},
	// );

	// const createUserClerkController = mockCreateUserClerkController();
	// const mockGetRoleByNameUseCase = new GetRoleByNameUseCase();
	// const mockCreateUserClerkUseCase = new CreateUserClerkUseCase();

	const mockRequest = (
		body: z.infer<typeof createUserValidator>,
	): Partial<Request> => ({
		body,
	});

	const next = vi.fn();

	const mockResponse = (): Partial<Response> => {
		const res: Partial<Response> = {};
		res.status = vi.fn().mockReturnValue(res);
		res.json = vi.fn().mockReturnValue(res);
		return res;
	};

	// beforeEach(() => {
	// 	vi.clearAllMocks();
	// });

	it("should return 400 when if validation fails", async () => {
		const req = mockRequest({
			name: "",
			roleName: "Admin",
			password: "short",
			cpassword: "short",
			email: "johndoe@example",
			phone: "ascsd123243",
		});

		const res = mockResponse();

		(createUserValidator.parse as Mock).mockImplementation(() => {
			throw new ZodError([
				{
					path: ["name"],
					message: "Name is required",
					code: "invalid_type",
					expected: "string",
					received: "undefined",
				},
			]);
		});

		const controller = new CreateUserClerkController(
			mockCreateUserClerkUseCase as unknown as CreateClientUseCase,
			mockGetRoleByNameUseCase as unknown as GetRoleByNameUseCase,
		);

		try {
			await controller.handle(req as Request, res as Response);
		} catch (error) {
			errorHandler(
				error as Error,
				req as Request,
				res as Response,
				next as NextFunction,
			);
		}

		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			errors: [{ field: "name", message: "Name is required" }],
			message: "Invalid data",
		});
	});

	it("should return 201 and create a new user when validation passes", async () => {
		const req = mockRequest({
			name: "John Doe",
			roleName: "Admin",
			password: "password123",
			cpassword: "password123",
			email: "johndoe@example.com",
			phone: "123456789",
		});

		const res = mockResponse();

		(createUserValidator.parse as Mock).mockReturnValue(req.body);

		(mockGetRoleByNameUseCase.execute as Mock).mockResolvedValue({
			id: "1",
			name: "Admin",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		(mockCreateUserClerkUseCase.execute as Mock).mockResolvedValue({
			id: "1",
			name: "John Doe",
			role_id: "1",
			password: "hashedPassword",
			email: "johndoe@example.com",
			phone: "123456789",
		});

		await createUserClerkController.handle(req as Request, res as Response);

		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({
			id: "1",
			name: "John Doe",
			role_id: "1",
			password: "hashedPassword",
			email: "johndoe@example.com",
			phone: "123456789",
		});
	});
});
