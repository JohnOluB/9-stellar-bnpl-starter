import { describe, it, expect } from 'vitest';
import { toStroops, fromStroops, formatUSDC, formatStroops, isValidUSDCAmount } from '../../src/utils/usdcHelpers';

describe('USDC Utility Helpers', () => {
      describe('toStroops', () => {
              it('should convert integer USDC to stroops', () => {
                        expect(toStroops(10)).toBe(10000000n);
                        expect(toStroops("10")).toBe(10000000n);
              });

                   it('should convert decimal USDC to stroops', () => {
                             expect(toStroops(10.5)).toBe(10500000n);
                   });
      });

           describe('fromStroops', () => {
                   it('should convert stroops to USDC number', () => {
                             expect(fromStroops(10000000n)).toBe(1);
                   });
           });

           describe('formatUSDC', () => {
                   it('should format numbers with default decimals', () => {
                             // Intl format results depend on environment; using regex for robustness
                            expect(formatUSDC(1234.56)).toMatch(/1,234\.56/);
                   });

                        it('should respect custom decimals', () => {
                                  expect(formatUSDC(1234.567, 3)).toMatch(/1,234\.567/);
                        });
           });

           describe('formatStroops', () => {
                   it('should format stroops as currency', () => {
                             expect(formatStroops(10000000n)).toMatch(/1\.00/);
                   });
           });

           describe('isValidUSDCAmount', () => {
                   it('should return true for valid amounts', () => {
                             expect(isValidUSDCAmount(10)).toBe(true);
                             expect(isValidUSDCAmount(10.1234567)).toBe(true);
                   });

                        it('should return false for invalid amounts', () => {
                                  expect(isValidUSDCAmount(-1)).toBe(false);
                                  expect(isValidUSDCAmount(10.12345678)).toBe(false);
                        });
           });
});
