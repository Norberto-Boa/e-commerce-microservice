import { describe, expect, it } from "vitest";
import { createUserValidator } from "./create-user";
import { ZodError } from "zod";
import {
	validateZodSchema,
	type ExpectedError,
} from "../../../../tests/utils/validateZodSchema";

describe("createUserValidator", () => {
	describe("Name validation", () => {
		it("should throw an error when name is Number", () => {
			const invalidData = {
				name: 1,
				email: "john@example.com",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "1234567890",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					expected: "string",
					received: "number",
					path: ["name"],
					message: "Expected string, received number",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw an error when name is empty", () => {
			const invalidData = {
				name: "",
				email: "john@example.com",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "1234567890",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "too_small",
					path: ["name"],
					message: "Name is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw an error when name is empty", () => {
			const invalidData = {
				email: "john@example.com",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "1234567890",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["name"],
					message: "Name is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});
	});

	describe("Email validation", () => {
		it("should throw an error when email is empty", () => {
			const invalidData = {
				name: "John Doe",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "1234567890",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["email"],
					message: "Email is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw an error when email is invalid", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "1234567890",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_string",
					path: ["email"],
					message: "Invalid email address",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});
	});

	describe("Password validation", () => {
		it("should throw an error when password is less than 8 characters", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "ABCDE1",
				cpassword: "ABCDE1",
				roleName: "Admin",
				phone: "123456789",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "too_small",
					path: ["password"],
					message: "Password must be at least 8 characters long",
				},
				{
					code: "too_small",
					path: ["cpassword"],
					message: "Confirm password must be at least 8 characters long",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when passowrd and cpassword do not macth", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "weakpassword123",
				roleName: "Admin",
				phone: "123456789",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "custom",
					path: ["cpassword"],
					message: "Passwords do not match",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when cpassword is not provided", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				roleName: "Admin",
				phone: "123456789",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["cpassword"],
					message: "Confirmation of password is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when password is not provided", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				cpassword: "weakpassword123",
				roleName: "Admin",
				phone: "123456789",
			};

			const expectedError: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["password"],
					message: "Password is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedError);
		});
	});

	describe("RoleName validation", () => {
		it("should throw error when roleName is not provided", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "weakpassword123",
				phone: "123456789",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["roleName"],
					message: "Role Name is Invalid",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when roleName is invalid", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "weakpassword123",
				roleName: "InvalidRole",
				phone: "123456789",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_enum_value",
					path: ["roleName"],
					message: "Role Name is Invalid",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});
	});

	describe("Phone number validation", () => {
		it("should throw error when phone number is not provided", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "weakpassword123",
				roleName: "Admin",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_type",
					path: ["phone"],
					message: "Phone is required",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when phone number is has letters and numbers", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "123abc456",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "invalid_string",
					path: ["phone"],
					message: "Phone number must contain only digits",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});

		it("should throw error when phone number is less than 9 digits", () => {
			const invalidData = {
				name: "John Doe",
				email: "johndoe@example.com",
				password: "strongpassword123",
				cpassword: "strongpassword123",
				roleName: "Admin",
				phone: "12345678",
			};

			const expectedErrors: ExpectedError[] = [
				{
					code: "too_small",
					path: ["phone"],
					message: "Phone number must be at least 9 characters long",
				},
			];

			validateZodSchema(createUserValidator, invalidData, expectedErrors);
		});
	});

	it("Should not throw error when all fields are valid", () => {
		const validData = {
			name: "John Doe",
			email: "johndoe@example.com",
			password: "strongpassword123",
			cpassword: "strongpassword123",
			roleName: "Admin",
			phone: "123456789",
		};

		const expectedErrors: ExpectedError[] = [];

		expect(() => createUserValidator.parse(validData)).not.toThrow();
	});
});
