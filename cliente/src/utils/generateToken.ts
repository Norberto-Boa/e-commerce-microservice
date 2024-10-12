import { sign } from "jsonwebtoken";
export function generateAutheticationToken(
	userId: string,
	name: string,
	role: string,
) {
	const key: string = process.env.JWT_SECRET_KEY ?? "";

	const token = sign({ name, role }, key, {
		subject: userId,
		expiresIn: "4s",
	});

	return token;
}
