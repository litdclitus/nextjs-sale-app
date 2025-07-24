import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
});

const envVars = {
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT
};

const config = configSchema.safeParse(envVars);

if (!config.success) {
  console.error("Validation errors:", config.error.issues);
  throw new Error("Invalid environment variables");
}

const envConfig = config.data;

export default envConfig;