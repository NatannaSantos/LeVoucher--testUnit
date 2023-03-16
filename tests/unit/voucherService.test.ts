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
                id:1,
                code: voucher.code,
                discount: voucher.discount,
                used:false
            };
        });
       
        const promise = voucherService.createVoucher(voucher.code, voucher.discount);
        expect(promise).rejects.toEqual({message:"Voucher already exist.",type:"conflict"});
        //toEqual({message:"Voucher already exist.", type:"conflict"});
    });
});