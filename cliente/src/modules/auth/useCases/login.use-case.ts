import { compare } from "bcryptjs";
import { GetUserByEmailUseCase } from "../../get-user-by-email/usecase/get-user-by-email.usecase";
import { generateAutheticationToken } from "../../../utils/generateToken";
import { GetRoleByIdUseCase } from "../../get-role-by-id/usecase/get-role-by-id.use-case";

interface LoginData {
	email: string;
	password: string;
}

export class LoginUseCase {
	async execute({ email, password }: LoginData): Promise<string> {
		const getUserByEmail = new GetUserByEmailUseCase();
		const user = await getUserByEmail.execute(email);

		if (!user) {
			throw new Error("Email ou senha inválidos.");
		}

		const passwordMatches = await compare(password, user.password);

		if (!passwordMatches) {
			throw new Error("Email ou senha inválidos.");
		}

		const getRoleById = new GetRoleByIdUseCase();
		const role = await getRoleById.execute(user.role_id);
		if (!role) {
			throw new Error(
				"Algo esta errado com o usuario. Contacte administarcao.",
			);
		}

		const token = generateAutheticationToken(user.id, user.name, role.name);

		return token;
	}
}
