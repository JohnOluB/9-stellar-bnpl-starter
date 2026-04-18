import { z } from 'zod';

const contractIdSchema = z.string().regex(/^C[A-Z2-7]{55}$/, "Invalid Soroban Contract ID");

const envSchema = z.object({
    SOROBAN_RPC_URL: z.string().url(),
    NETWORK_PASSPHRASE: z.string().min(1, "Network passphrase cannot be empty"),
    CREDIT_LINE_CONTRACT_ID: contractIdSchema,
    REPAYMENT_CONTRACT_ID: contractIdSchema,
    ESCROW_CONTRACT_ID: contractIdSchema,
    USDC_CONTRACT_ID: contractIdSchema,
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_NETWORK: z.enum(['testnet', 'mainnet']),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const getEnv = () => {
    const result = envSchema.safeParse({
          ...process.env,
          NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK || (process.env.NODE_ENV === 'production' ? undefined : 'testnet'),
    });

    if (!result.success) {
          console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
          throw new Error('Invalid environment variables');
    }

    return result.data;
};

export const env = getEnv();
