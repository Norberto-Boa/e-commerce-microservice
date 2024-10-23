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
});
