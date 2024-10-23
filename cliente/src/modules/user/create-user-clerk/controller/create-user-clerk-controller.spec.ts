import { GetRoleByNameUseCase } from "../../../role/get-role-by-name/usecase/get-role-by-name.usecase";
import { CreateUserClerkUseCase } from "../use-case/create-user-clerk.use-case";
import { createUserValidator } from "../../create-user/validators/create-user";
import { describe, expect, it, vi } from "vitest";
import { CreateUserClerkController } from "./create-user-clerk.controller";
import type { z } from "zod";
import type { Request, Response } from "express";

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

describe("Testing Create User Clerk Controller", () => {
	const createUserClerkController = new CreateUserClerkController();

	const mockRequest = (
		body: z.infer<typeof createUserValidator>,
	): Partial<Request> => ({
		body,
	});

	const mockResponse = (): Partial<Response> => {
		const res: Partial<Response> = {};
		res.status = vi.fn().mockReturnValue(res);
		res.json = vi.fn().mockReturnValue(res);
		return res;
	};

	it("Should throw a validation error when passwords do not match", async () => {
		const req = mockRequest({
			name: "John Doe",
			roleName: "Admin",
			password: "password",
			cpassword: "differentpassword",
			email: "johndoe@example.com",
			phone: "1234567890",
		});

		const res = mockResponse();

		// biome-ignore lint/suspicious/noExplicitAny: Iy is way complicated to get the type of this function properly
		(createUserValidator.parse as any).mockImplementation(() => {
			throw new Error("Passwords do not match");
		});

		await expect(
			createUserClerkController.handle(req as Request, res as Response),
		).rejects.toThrow("Passwords do not match");

		expect(createUserValidator.parse).toHaveBeenCalledWith(req.body);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	it("should return an error when the role name is invalid", async () => {
		const req = mockRequest({
			name: "John Doe",
			roleName: "InvalidRole",
			password: "password",
			cpassword: "password",
			email: "johndoe@example.com",
			phone: "1234567890",
		});

		const res = mockResponse();

		// biome-ignore lint/suspicious/noExplicitAny: It is way complicated to get the type of this function properly
		(createUserValidator.parse as any).mockImplementation(() => {
			throw new Error("Role name is Invalid");
		});

		await expect(
			createUserClerkController.handle(req as Request, res as Response),
		).rejects.toThrow("Role name is Invalid");

		expect(createUserValidator.parse).toHaveBeenCalledWith(req.body);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	it("should return an error when the password is less than 8 characters", async () => {
		const req = mockRequest({
			name: "John Doe",
			roleName: "Admin",
			password: "short",
			cpassword: "short",
			email: "johndoe@example.com",
			phone: "1234567890",
		});

		const res = mockResponse();

		// biome-ignore lint/suspicious/noExplicitAny: It is way complicated to get the type of this function properly
		(createUserValidator.parse as any).mockImplementation(() => {
			throw new Error("Password must be at least 8 characters long");
		});

		await expect(
			createUserClerkController.handle(req as Request, res as Response),
		).rejects.toThrow("Password must be at least 8 characters long");

		expect(createUserValidator.parse).toHaveBeenCalledWith(req.body);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});
});
