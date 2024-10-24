import { z } from "zod";

export const createUserValidator = z
	.object({
		name: z
			.string({
				required_error: "Name is required",
			})
			.trim()
			.min(1, { message: "Name is required" })
			.refine((name) => typeof name !== "undefined", {
				message: "Name is required",
			}),
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email address"),
		password: z
			.string({ required_error: "Password is required" })
			.min(8, "Password must be at least 8 characters long"),
		cpassword: z
			.string({ required_error: "Confirmation of password is required" })
			.min(8, "Confirm password must be at least 8 characters long"),
		roleName: z.enum(
			["Admin", "Customer", "Vendor", "Support Agent", "Manager"],
			{
				required_error: "Role name should be provided",
				message: "Role Name is Invalid",
			},
		),
		phone: z
			.string({ required_error: "Phone is required" })
			.min(9, "Phone number must be at least 9 characters long")
			.regex(/^\d+$/, "Phone number must contain only digits"),
	})
	.refine((data) => data.password === data.cpassword, {
		message: "Passwords do not match",
		path: ["cpassword"], // Mark the field where the error occurs
	});
