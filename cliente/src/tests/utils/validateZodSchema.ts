import { expect } from "vitest";
import { ZodError, type ZodSchema } from "zod";

export interface ExpectedError {
	code: string;
	expected?: string;
	received?: string;
	path: (string | number)[];
	message: string;
}

export function validateZodSchema<T>(
	schema: ZodSchema<T>,
	// biome-ignore lint/suspicious/noExplicitAny: Data depends on the test
	invalidData: any,
	expectedErrors: ExpectedError[],
) {
	expect(() => schema.parse(invalidData)).toThrow(ZodError);

	try {
		schema.parse(invalidData);
	} catch (error) {
		expect(error).toBeInstanceOf(ZodError);

		const zodError = error as ZodError;
		expect(zodError.errors).toHaveLength(expectedErrors.length);

		expectedErrors.forEach((expectedError, i) => {
			expect(zodError.errors[i]).toMatchObject(expectedError);
		});
	}
}
