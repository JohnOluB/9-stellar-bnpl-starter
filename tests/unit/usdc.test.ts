import { describe, it, expect } from 'vitest';
import { toStroops, fromStroops, formatUSDC } from '../../src/utils/usdcHelpers';

describe('USDC Utility Helpers', () => {
    describe('toStroops', () => {
          it('should convert integer USDC to stroops', () => {
                  expect(toStroops(10)).toBe(10000000n);
                  expect(toStroops("10")).toBe(10000000n);
          });

                 it('should convert decimal USDC to stroops', () => {
                         expect(toStroops(10.5)).toBe(10500000n);
                         expect(toStroops("10.5")).toBe(10500000n);
                 });

                 it('should handle small amounts', () => {
                         expect(toStroops(0.0000001)).toBe(1n);
                         expect(toStroops("0.0000001")).toBe(1n);
                 });

                 it('should handle large amounts', () => {
                         expect(toStroops(1000000)).toBe(10000000000000n);
                 });
    });

           describe('fromStroops', () => {
                 it('should convert stroops to USDC number', () => {
                         expect(fromStroops(10000000n)).toBe(1);
                         expect(fromStroops("10000000")).toBe(1);
                 });

                        it('should handle decimal stroops', () => {
                                expect(fromStroops(10500000n)).toBe(10.5);
                        });
           });

           describe('formatUSDC', () => {
                 it('should format numbers correctly', () => {
                         expect(formatUSDC(1234.56)).toMatch(/\$1,234.56/);
                         expect(formatUSDC(10)).toMatch(/\$10.00/);
                 });
           });
});
