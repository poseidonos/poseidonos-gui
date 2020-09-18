import formatBytes, {formatNanoSeconds} from "./index";

describe("formatBytes", () => {
    it("should return 0 when zero is passed", () => {
        const value = formatBytes(0);
        expect(value).toBe('0 Bytes');
    });

    it("should not return decimal places when the second parameter passed is less than zero", () => {
        const value = formatBytes(1500, -1);
        expect(value).toBe('1 KB');
    });

    it("should return millisecond values", () => {
        const value = formatNanoSeconds(1000000);
        expect(value).toBe('1 ms');
    });
})