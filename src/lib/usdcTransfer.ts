import { Asset, Operation } from '@stellar/stellar-sdk';
import { env } from '../env';

/**
 * Builds a USDC payment operation for Stellar Classic.
 * @param destination The receiver's public key
 * @param amount The amount in USDC (string format)
 * @param source Optional source account
 * @returns A payment operation
 */
export function buildUSDCPayment(destination: string, amount: string, source?: string) {
    return Operation.payment({
          destination,
          asset: new Asset('USDC', env.USDC_CONTRACT_ID),
          amount,
          source,
    });
}
