import { z } from 'zod';

const contractIdSchema = z.string().regex(/^C[A-Z2-7]{55}$/, "Invalid Soroban Contract ID");

const envSchema = z.object({
  SOROBAN_RPC_URL: z.string().url(),
  NETWORK_PASSPHRASE: z.string().min(1),
  CREDIT_LINE_CONTRACT_ID: contractIdSchema,
  REPAYMENT_CONTRACT_ID: contractIdSchema,
  ESCROW_CONTRACT_ID: contractIdSchema,
  USDC_CONTRACT_ID: contractIdSchema,
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_NETWORK: z.enum(['testnet', 'mainnet']).default('testnet'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
