import { prismaClient } from "../../../infra/database/prismaClient";
import { CreateClientUseCase } from "./create-client.use-case";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../infra/database/prismaClient", () => ({
	prismaClient: {
		client: {
			findFirst: vi.fn(),
			create: vi.fn(),
		},
	},
}));

const prismaMock = prismaClient as unknown as {
	client: {
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
		};

		prismaMock.client.findFirst.mockResolvedValue(null);

		prismaMock.client.create.mockResolvedValue(clientData);

		const result = await createClientUseCase.execute(clientData);

		expect(prismaMock.client.findFirst).toHaveBeenCalledWith({
			where: { email: clientData.email },
		});

		expect(prismaMock.client.create).not.toHaveBeenCalledWith();
	});
});
