import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaClient } from "../../../../infra/database/prismaClient";
import { GetUserByEmailUseCase } from "./get-user-by-email.usecase";
import type { User } from "@prisma/client";

vi.mock("../../../../infra/database/prismaClient", () => ({
	prismaClient: {
		user: {
			findFirst: vi.fn(),
		},
	},
}));

const prismaMock = prismaClient as unknown as {
	user: {
		findFirst: ReturnType<typeof vi.fn>;
	};
};

describe("Get user by email usecase", () => {
	let getUserByEmailUseCase: GetUserByEmailUseCase;

	beforeEach(() => {
		getUserByEmailUseCase = new GetUserByEmailUseCase();
	});

	it("should return user when email is already registered", async () => {
		const email: string = "John.Doe@gmail.com";

		const date = new Date();

		prismaMock.user.findFirst.mockResolvedValue({
			id: "1",
			name: "John Doe",
			email: "John.Doe@gmail.com",
			phone: "1234567890",
			role_id: "c",
			password: "hashedPassword",
			createdAt: date,
			updatedAt: date,
		} as User);

		const user = await getUserByEmailUseCase.execute(email);

		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { email },
		});

		expect(user?.email).toMatch(email);
	});

	it("should return null if user does not exist", async () => {
		const email: string = "invalid.email@gmail.com";

		prismaMock.user.findFirst.mockResolvedValue(null);

		const user = await getUserByEmailUseCase.execute(email);

		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { email },
		});

		expect(user).toBeNull();
	});
});
