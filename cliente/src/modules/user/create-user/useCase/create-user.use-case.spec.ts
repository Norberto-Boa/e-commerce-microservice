import { hash } from "bcryptjs";
import { prismaClient } from "../../../../infra/database/prismaClient";
import { CreateClientUseCase } from "./create-user.use-case";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { date } from "zod";

vi.mock("../../../../infra/database/prismaClient", () => ({
	prismaClient: {
		user: {
			findFirst: vi.fn(),
			create: vi.fn(),
		},
	},
}));

vi.mock("bcryptjs", () => ({
	hash: vi.fn().mockResolvedValue("hashedPassword"),
}));

const prismaMock = prismaClient as unknown as {
	user: {
		findFirst: ReturnType<typeof vi.fn>;
		create: ReturnType<typeof vi.fn>;
	};
};

describe("CreateClientUseCase", () => {
	let createClientUseCase: CreateClientUseCase;

	beforeEach(() => {
		createClientUseCase = new CreateClientUseCase();
	});

	it("Should create a new client", async () => {
		const clientData = {
			name: "John Doe",
			email: "johndoe@example.com",
			password: "securepassword",
			phone: "1234567890",
			role_id: "j",
		};

		prismaMock.user.findFirst.mockResolvedValue(null);

		prismaMock.user.create.mockResolvedValue({
			...clientData,
			id: "generated-id",
			password: "hashedPassword",
		});

		const result = await createClientUseCase.execute(clientData);

		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: { email: clientData.email },
		});

		expect(prismaMock.user.create).toHaveBeenCalledWith({
			data: {
				name: clientData.name,
				email: clientData.email,
				password: "hashedPassword",
				phone: clientData.phone,
				role_id: clientData.role_id,
			},
		});

		expect(result).toMatchObject({
			...clientData,
			id: "generated-id",
			password: "hashedPassword",
		});
	});
});
