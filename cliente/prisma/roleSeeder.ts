import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function seed() {
	await client.role.createMany({
		data: [
			{ name: "Admin" },
			{ name: "Client" },
			{ name: "Manager" },
			{ name: "Customer" },
			{ name: "Vendor" },
			{ name: "Support Agent" },
		],
		skipDuplicates: true,
	});
}

seed()
	.catch((error) => {
		console.error("Error seeding data:", error);
		process.exit(1);
	})
	.finally(async () => {
		await client.$disconnect();
	});
