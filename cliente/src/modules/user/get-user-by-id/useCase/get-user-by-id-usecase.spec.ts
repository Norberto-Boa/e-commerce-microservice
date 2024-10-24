import { beforeEach, describe, expect, it, vi } from "vitest";
import { prismaClient } from "../../../../infra/database/prismaClient";
import { GetUserByIdUseCase } from "./get-user-by-id.usecase";
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

describe("get User By Id test", () => {
	let getUserByIdUseCase: GetUserByIdUseCase;

	beforeEach(() => {
		getUserByIdUseCase = new GetUserByIdUseCase();
	});

	it("Should be able to find a user by id", async () => {
		const userId = "1";

		const date = new Date();

		prismaMock.user.findFirst.mockResolvedValueOnce({
			id: userId,
			name: "John Doe",
			email: "test@example.com",
			password: "hashedPassword",
			phone: "1234567890",
			role_id: "j",
			createdAt: date,
			updatedAt: date,
		} as User);

		const result = await getUserByIdUseCase.execute(userId);

		expect(prismaMock.user.findFirst).toBeCalledWith({ where: { id: userId } });

		expect(result?.id).toMatch(userId);
	});

	it("should return null when user is not found", async () => {
		const id: string = "5";

		prismaMock.user.findFirst.mockResolvedValue(null);

		const user = await getUserByIdUseCase.execute(id);

		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { id },
		});

		expect(user).toBeNull();
	});
});
