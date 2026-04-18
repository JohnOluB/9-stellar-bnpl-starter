/**
 * Utilities for handling USDC amounts on Stellar.
 * USDC has 7 decimal places (stroops) on Stellar.
 */

const STROOP_DECIMALS = 7;
const STROOPS_PER_USDC = BigInt(10 ** STROOP_DECIMALS);

/**
 * Converts a USDC amount to stroops (bigint).
 */
export function toStroops(amount: number | string): bigint {
      const value = typeof amount === 'number' ? amount.toFixed(STROOP_DECIMALS) : amount;
      const [integers, decimals = ''] = value.split('.');
      const stroopsStr = integers + decimals.padEnd(STROOP_DECIMALS, '0').slice(0, STROOP_DECIMALS);
      return BigInt(stroopsStr);
}

/**
 * Converts stroops to a human-readable USDC amount.
 */
export function fromStroops(stroops: bigint | string): number {
      const value = typeof stroops === 'string' ? BigInt(stroops) : stroops;
      return Number(value) / Number(STROOPS_PER_USDC);
}

/**
 * Formats a USDC amount for display.
 */
export function formatUSDC(amount: number, decimals: number = 2): string {
      return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
      }).format(amount);
}

/**
 * Formats stroops for display.
 */
export function formatStroops(stroops: bigint | string): string {
      return formatUSDC(fromStroops(stroops));
}

/**
 * Validates if a number is a valid USDC amount (max 7 decimals).
 */
export function isValidUSDCAmount(amount: number): boolean {
      if (amount <= 0) return false;
      const parts = amount.toString().split('.');
      return !parts[1] || parts[1].length <= STROOP_DECIMALS;
}
