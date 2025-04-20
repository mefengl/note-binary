/**
 * uint.test.ts - uint.ts 的测试文件
 * 
 * 这个文件包含了针对 `src/uint.ts` 文件中 `bigEndian` 和 `littleEndian` 对象方法的单元测试。
 * 测试的目的是确保无符号整数和字节数组之间的转换（包括读和写）在不同字节序下都能正确工作，
 * 并且能正确处理边界情况和错误情况。
 * 
 * 我们使用了 `vitest` 这个测试框架。
 * `describe` 用于将相关的测试分组，`test` 定义了具体的测试用例。
 */
import { expect, test } from "vitest";
import { bigEndian, littleEndian } from "./uint.js";
import { describe } from "vitest";

// --- 测试大端序 (Big-Endian) --- 
describe("bigEndian", () => {
	// 测试从字节数组读取8位无符号整数
	describe("bigEndian.uint8", () => {
		// 测试正常情况：读取单个字节
		test("返回正确的值", () => {
			expect(bigEndian.uint8(new Uint8Array([1]), 0)).toBe(1);
		});
		// 测试源数组包含多余字节：只读取第一个字节
		test("多余字节", () => {
			expect(bigEndian.uint8(new Uint8Array([1, 2]), 0)).toBe(1);
		});
		// 测试使用偏移量：从第二个字节开始读取
		test("偏移量", () => {
			expect(bigEndian.uint8(new Uint8Array([1, 2]), 1)).toBe(2);
		});
		// 测试错误情况：字节数不足
		test("字节数不足", () => {
			// expect(...).toThrowError() 用于检查函数是否按预期抛出了错误
			expect(() => bigEndian.uint8(new Uint8Array([]), 0)).toThrowError();
		});
		// 测试错误情况：带偏移量时字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => bigEndian.uint8(new Uint8Array([1]), 1)).toThrowError();
		});
	});

	// 测试从字节数组读取16位无符号整数 (大端序: 高位在前)
	describe("bigEndian.uint16", () => {
		// 测试正常情况：[1, 2] -> 0x0102
		test("返回正确的值", () => {
			expect(bigEndian.uint16(new Uint8Array([1, 2]), 0)).toBe(0x0102);
		});
		// 测试源数组包含多余字节：只读取前两个字节
		test("多余字节", () => {
			expect(bigEndian.uint16(new Uint8Array([1, 2, 3]), 0)).toBe(0x0102);
		});
		// 测试使用偏移量：从第二个字节开始读取 [2, 3] -> 0x0203
		test("偏移量", () => {
			expect(bigEndian.uint16(new Uint8Array([1, 2, 3]), 1)).toBe(0x0203);
		});
		// 测试错误情况：字节数不足 (需要2个，只有1个)
		test("字节数不足", () => {
			expect(() => bigEndian.uint16(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误情况：带偏移量时字节数不足 (从offset=1开始需要2个，总共只有2个)
		test("带偏移量时字节数不足", () => {
			expect(() => bigEndian.uint16(new Uint8Array([1, 2]), 1)).toThrowError();
		});
	});

	// 测试从字节数组读取32位无符号整数 (大端序)
	describe("bigEndian.uint32", () => {
		// 测试正常情况：[1, 2, 3, 4] -> 0x01020304
		test("返回正确的值", () => {
			expect(bigEndian.uint32(new Uint8Array([1, 2, 3, 4]), 0)).toBe(0x01020304);
		});
		// 测试源数组包含多余字节
		test("多余字节", () => {
			expect(bigEndian.uint32(new Uint8Array([1, 2, 3, 4, 5]), 0)).toBe(0x01020304);
		});
		// 测试使用偏移量：[2, 3, 4, 5] -> 0x02030405
		test("偏移量", () => {
			expect(bigEndian.uint32(new Uint8Array([1, 2, 3, 4, 5]), 1)).toBe(0x02030405);
		});
		// 测试错误情况：字节数不足
		test("字节数不足", () => {
			expect(() => bigEndian.uint32(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误情况：带偏移量时字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => bigEndian.uint32(new Uint8Array([1, 2, 3, 4]), 1)).toThrowError();
		});
	});

	// 测试从字节数组读取64位无符号整数 (大端序)，使用 BigInt
	describe("bigEndian.uint64", () => {
		// 测试正常情况：[1..8] -> 0x0102030405060708n (注意 'n' 表示 BigInt)
		test("返回正确的值", () => {
			expect(bigEndian.uint64(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), 0)).toBe(
				0x0102030405060708n
			);
		});
		// 测试源数组包含多余字节
		test("多余字节", () => {
			expect(bigEndian.uint64(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 0)).toBe(
				0x0102030405060708n
			);
		});
		// 测试使用偏移量：[2..9] -> 0x0203040506070809n
		test("偏移量", () => {
			expect(bigEndian.uint64(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), 1)).toBe(
				0x0203040506070809n
			);
		});
		// 测试错误情况：字节数不足
		test("字节数不足", () => {
			expect(() => bigEndian.uint64(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误情况：带偏移量时字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => bigEndian.uint64(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), 1)).toThrowError();
		});
	});

	// 测试将8位无符号整数写入字节数组
	describe("bigEndian.putUint8", () => {
		// 测试正常情况：写入值 1
		test("写入正确的值", () => {
			const data = new Uint8Array(1);
			bigEndian.putUint8(data, 1, 0);
			expect(data).toStrictEqual(new Uint8Array([1]));
		});
		// 测试目标数组空间过大：只写入第一个字节
		test("目标数组空间过大", () => {
			const data = new Uint8Array(2);
			bigEndian.putUint8(data, 1, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 0])); // 未写入的位置保持为0
		});
		// 测试使用偏移量：写入第二个字节
		test("偏移量", () => {
			const data = new Uint8Array(2);
			bigEndian.putUint8(data, 1, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 1]));
		});
		// 测试错误情况：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => bigEndian.putUint8(data, 1, 0)).toThrow();
		});
		// 测试错误情况：带偏移量时空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(1);
			expect(() => bigEndian.putUint8(data, 1, 1)).toThrow();
		});
	});

	// 测试将16位无符号整数写入字节数组 (大端序)
	describe("bigEndian.putUint16", () => {
		// 测试正常情况：写入 258 (0x0102) -> [1, 2]
		test("写入正确的值", () => {
			const data = new Uint8Array(2);
			bigEndian.putUint16(data, 258, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(3);
			bigEndian.putUint16(data, 258, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2, 0]));
		});
		// 测试使用偏移量：从 offset=1 开始写入 -> [0, 1, 2]
		test("偏移量", () => {
			const data = new Uint8Array(3);
			bigEndian.putUint16(data, 258, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 1, 2]));
		});
		// 测试错误情况：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => bigEndian.putUint16(data, 1, 0)).toThrow();
		});
		// 测试错误情况：带偏移量时空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(2);
			expect(() => bigEndian.putUint16(data, 258, 1)).toThrow();
		});
	});

	// 测试将32位无符号整数写入字节数组 (大端序)
	describe("bigEndian.putUint32", () => {
		// 测试正常情况：写入 16909060 (0x01020304) -> [1, 2, 3, 4]
		test("写入正确的值", () => {
			const data = new Uint8Array(4);
			bigEndian.putUint32(data, 16909060, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2, 3, 4]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(5);
			bigEndian.putUint32(data, 16909060, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2, 3, 4, 0]));
		});
		// 测试使用偏移量：从 offset=1 开始写入 -> [0, 1, 2, 3, 4]
		test("偏移量", () => {
			const data = new Uint8Array(5);
			bigEndian.putUint32(data, 16909060, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 1, 2, 3, 4]));
		});
		// 测试错误情况：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => bigEndian.putUint32(data, 1, 0)).toThrow();
		});
		// 测试错误情况：带偏移量时空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(4);
			expect(() => bigEndian.putUint32(data, 16909060, 1)).toThrow();
		});
	});

	// 测试将64位无符号整数写入字节数组 (大端序)，使用 BigInt
	describe("bigEndian.putUint64", () => {
		// 测试正常情况：写入 0x0102030405060708n -> [1..8]
		test("写入正确的值", () => {
			const data = new Uint8Array(8);
			bigEndian.putUint64(data, 0x0102030405060708n, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(9);
			bigEndian.putUint64(data, 0x0102030405060708n, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 0]));
		});
		// 测试使用偏移量：从 offset=1 开始写入 -> [0, 1..8]
		test("偏移量", () => {
			const data = new Uint8Array(9);
			bigEndian.putUint64(data, 0x0102030405060708n, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8]));
		});
		// 测试错误情况：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => bigEndian.putUint64(data, 1n, 0)).toThrow();
		});
		// 测试错误情况：带偏移量时空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(8);
			expect(() => bigEndian.putUint64(data, 0x0102030405060708n, 1)).toThrow();
		});
	});
});

describe("littleEndian", () => {
	// 小端序的测试结构与大端序类似，但期望的字节顺序相反
	describe("littleEndian.uint8", () => {
		// 测试正常情况
		test("返回正确的值", () => {
			expect(littleEndian.uint8(new Uint8Array([1]), 0)).toBe(1);
		});
		// 测试多余字节
		test("多余字节", () => {
			expect(littleEndian.uint8(new Uint8Array([1, 2]), 0)).toBe(1);
		});
		// 测试偏移量
		test("偏移量", () => {
			expect(littleEndian.uint8(new Uint8Array([1, 2]), 1)).toBe(2);
		});
		// 测试错误：字节数不足
		test("字节数不足", () => {
			expect(() => littleEndian.uint8(new Uint8Array([]), 0)).toThrowError();
		});
		// 测试错误：带偏移量字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => littleEndian.uint8(new Uint8Array([1]), 1)).toThrowError();
		});
	});

	describe("littleEndian.uint16", () => {
		// 测试正常情况：[2, 1] -> 0x0102
		test("返回正确的值", () => {
			expect(littleEndian.uint16(new Uint8Array([2, 1]), 0)).toBe(0x0102);
		});
		// 测试多余字节
		test("多余字节", () => {
			expect(littleEndian.uint16(new Uint8Array([2, 1, 3]), 0)).toBe(0x0102);
		});
		// 测试偏移量：从 offset=1 开始读取 [1, 3] -> 0x0301
		test("偏移量", () => {
			expect(littleEndian.uint16(new Uint8Array([2, 1, 3]), 1)).toBe(0x0301);
		});
		// 测试错误：字节数不足
		test("字节数不足", () => {
			expect(() => littleEndian.uint16(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误：带偏移量字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => littleEndian.uint16(new Uint8Array([1, 2]), 1)).toThrowError();
		});
	});

	describe("littleEndian.uint32", () => {
		// 测试正常情况：[4, 3, 2, 1] -> 0x01020304
		test("返回正确的值", () => {
			expect(littleEndian.uint32(new Uint8Array([4, 3, 2, 1]), 0)).toBe(0x01020304);
		});
		// 测试多余字节
		test("多余字节", () => {
			expect(littleEndian.uint32(new Uint8Array([4, 3, 2, 1, 5]), 0)).toBe(0x01020304);
		});
		// 测试偏移量：从 offset=1 开始读取 [3, 2, 1, 5] -> 0x05010203
		test("偏移量", () => {
			expect(littleEndian.uint32(new Uint8Array([4, 3, 2, 1, 5]), 1)).toBe(0x05010203);
		});
		// 测试错误：字节数不足
		test("字节数不足", () => {
			expect(() => littleEndian.uint32(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误：带偏移量字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => littleEndian.uint32(new Uint8Array([1, 2, 3, 4]), 1)).toThrowError();
		});
	});

	describe("littleEndian.uint64", () => {
		// 测试正常情况：[8..1] -> 0x0102030405060708n
		test("返回正确的值", () => {
			expect(littleEndian.uint64(new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]), 0)).toBe(
				0x0102030405060708n
			);
		});
		// 测试多余字节
		test("多余字节", () => {
			expect(littleEndian.uint64(new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1, 9]), 0)).toBe(
				0x0102030405060708n
			);
		});
		// 测试偏移量：从 offset=1 开始读取 [7..1, 9] -> 0x0901020304050607n
		test("偏移量", () => {
			expect(littleEndian.uint64(new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1, 9]), 1)).toBe(
				0x0901020304050607n
			);
		});
		// 测试错误：字节数不足
		test("字节数不足", () => {
			expect(() => littleEndian.uint64(new Uint8Array([1]), 0)).toThrowError();
		});
		// 测试错误：带偏移量字节数不足
		test("带偏移量时字节数不足", () => {
			expect(() => littleEndian.uint64(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]), 1)).toThrowError();
		});
	});

	describe("littleEndian.putUint8", () => {
		// 测试正常情况
		test("写入正确的值", () => {
			const data = new Uint8Array(1);
			littleEndian.putUint8(data, 1, 0);
			expect(data).toStrictEqual(new Uint8Array([1]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(2);
			littleEndian.putUint8(data, 1, 0);
			expect(data).toStrictEqual(new Uint8Array([1, 0]));
		});
		// 测试偏移量
		test("偏移量", () => {
			const data = new Uint8Array(2);
			littleEndian.putUint8(data, 1, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 1]));
		});
		// 测试错误：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => littleEndian.putUint8(data, 1, 0)).toThrow();
		});
		// 测试错误：带偏移量空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(1);
			expect(() => littleEndian.putUint8(data, 1, 1)).toThrow();
		});
	});

	describe("littleEndian.putUint16", () => {
		// 测试正常情况：写入 258 (0x0102) -> [2, 1]
		test("写入正确的值", () => {
			const data = new Uint8Array(2);
			littleEndian.putUint16(data, 258, 0);
			expect(data).toStrictEqual(new Uint8Array([2, 1]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(3);
			littleEndian.putUint16(data, 258, 0);
			expect(data).toStrictEqual(new Uint8Array([2, 1, 0]));
		});
		// 测试偏移量：从 offset=1 开始写入 -> [0, 2, 1]
		test("偏移量", () => {
			const data = new Uint8Array(3);
			littleEndian.putUint16(data, 258, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 2, 1]));
		});
		// 测试错误：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => littleEndian.putUint16(data, 1, 0)).toThrow();
		});
		// 测试错误：带偏移量空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(2);
			expect(() => littleEndian.putUint16(data, 258, 1)).toThrow();
		});
	});

	describe("littleEndian.putUint32", () => {
		// 测试正常情况：写入 16909060 (0x01020304) -> [4, 3, 2, 1]
		test("写入正确的值", () => {
			const data = new Uint8Array(4);
			littleEndian.putUint32(data, 16909060, 0);
			expect(data).toStrictEqual(new Uint8Array([4, 3, 2, 1]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(5);
			littleEndian.putUint32(data, 16909060, 0);
			expect(data).toStrictEqual(new Uint8Array([4, 3, 2, 1, 0]));
		});
		// 测试偏移量：从 offset=1 开始写入 -> [0, 4, 3, 2, 1]
		test("偏移量", () => {
			const data = new Uint8Array(5);
			littleEndian.putUint32(data, 16909060, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 4, 3, 2, 1]));
		});
		// 测试错误：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => littleEndian.putUint32(data, 1, 0)).toThrow();
		});
		// 测试错误：带偏移量空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(4);
			expect(() => littleEndian.putUint32(data, 16909060, 1)).toThrow();
		});
	});

	describe("littleEndian.putUint64", () => {
		// 测试正常情况：写入 0x0102030405060708n -> [8..1]
		test("写入正确的值", () => {
			const data = new Uint8Array(8);
			littleEndian.putUint64(data, 0x0102030405060708n, 0);
			expect(data).toStrictEqual(new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1]));
		});
		// 测试目标数组空间过大
		test("目标数组空间过大", () => {
			const data = new Uint8Array(9);
			littleEndian.putUint64(data, 0x0102030405060708n, 0);
			expect(data).toStrictEqual(new Uint8Array([8, 7, 6, 5, 4, 3, 2, 1, 0]));
		});
		// 测试偏移量：从 offset=1 开始写入 -> [0, 8..1]
		test("偏移量", () => {
			const data = new Uint8Array(9);
			littleEndian.putUint64(data, 0x0102030405060708n, 1);
			expect(data).toStrictEqual(new Uint8Array([0, 8, 7, 6, 5, 4, 3, 2, 1]));
		});
		// 测试错误：空间不足
		test("空间不足", () => {
			const data = new Uint8Array(0);
			expect(() => littleEndian.putUint64(data, 1n, 0)).toThrow();
		});
		// 测试错误：带偏移量空间不足
		test("带偏移量时空间不足", () => {
			const data = new Uint8Array(8);
			expect(() => littleEndian.putUint64(data, 0x0102030405060708n, 1)).toThrow();
		});
	});
});
