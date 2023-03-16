import { jest } from '@jest/globals';
import voucherRepository from 'repositories/voucherRepository';
import voucherService from 'services/voucherService';

describe("Voucher service unit tests", () => {
    it("should check if the Voucher already exists", () => {
        const voucher = {
            code: "AAA",
            discount: 10
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            };
        });

        const promise = voucherService.createVoucher(voucher.code, voucher.discount);
        expect(promise).rejects.toEqual({ message: "Voucher already exist.", type: "conflict" });
    });

    it("should create a voucher", () => {
        const voucher = {
            code: "BBB",
            discount: 10
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return undefined;
        });
        jest.spyOn(voucherRepository, "createVoucher").mockImplementationOnce((): any => { voucher.code, voucher.discount });

        const result = voucherService.createVoucher(voucher.code, voucher.discount);
        expect(result).resolves.toEqual(true);
    });

    it("should return an error when receiving a non-existent voucher", () => {
        const voucher = {
            code: "CCC",
            discount: 10
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return undefined;
        });
        const amount = 100;
        const promise = voucherService.applyVoucher(voucher.code, amount);
        expect(promise).rejects.toEqual({ message: "Voucher does not exist.", type: "conflict" });
    });

    it("should check if the amount doesn't offers discount", async () => {
        const voucher = {
            code: "AAA",
            discount: 10
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            };
        });
        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { });
        const amount = 99;
        const order = await voucherService.applyVoucher(voucher.code, amount);
        expect(order.amount).toBe(amount);
        expect(order.discount).toBe(voucher.discount);
        expect(order.finalAmount).toBe(amount);
        expect(order.applied).toBe(false);
    });

    it("should check if the amount doesn't offers discount",async () => {
        const voucher = {
            code: "AAA",
            discount: 10
        }
        jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
            return {
                id: 1,
                code: voucher.code,
                discount: voucher.discount,
                used: false
            };        
        });
        const amount = 101;
        jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => { });
        const order = await voucherService.applyVoucher(voucher.code, amount);
        expect(order.amount).toBe(amount);
        expect(order.discount).toBe(voucher.discount);
        expect(order.finalAmount).toBe(amount-(amount*(voucher.discount/100)));
        expect(order.applied).toBe(true);
    });
});