/**
 * big.test.ts - big.ts 的测试文件
 * 
 * 这个文件包含了针对 `src/big.ts` 文件中函数的单元测试。
 * 这些函数主要处理 JavaScript 的 BigInt 类型（大整数）和字节数组 (Uint8Array) 之间的转换。
 * BigInt 可以表示任意大的整数，这在处理密码学、大数运算等场景中非常有用。
 * 
 * 测试的目的是确保：
 * 1. `bigIntBytes` 能将 BigInt 正确地转换为大端序（Big-Endian）的字节数组。
 * 2. `bigIntFromBytes` 能将大端序的字节数组正确地转换回 BigInt。
 * 3. 能够处理正数和非常大的数字。
 * 
 * 注意：这里的转换遵循大端序（Big-Endian）的约定，即最重要的字节（MSB）存储在最低的地址。
 */
import { test, expect } from "vitest";
import { bigIntBytes, bigIntFromBytes } from "./big.js";

// 测试 bigIntBytes() 函数：将 BigInt 转换为字节数组
test("bigIntBytes()", () => {
	// 测试用例 1: 最小的正 BigInt (1n)
	// 预期输出: [0x01] (一个字节表示)
	expect(bigIntBytes(1n)).toStrictEqual(new Uint8Array([0x01]));

	// 测试用例 2: 一个字节能表示的最大无符号整数 (255n, 0xFF)
	// 预期输出: [0xFF]
	expect(bigIntBytes(255n)).toStrictEqual(new Uint8Array([0xff]));

	// 测试用例 3: 刚好超过一个字节能表示的最大值 (256n, 0x0100)
	// 预期输出: [0x01, 0x00] (两个字节表示，大端序)
	expect(bigIntBytes(256n)).toStrictEqual(new Uint8Array([0x01, 0x00]));

	// 测试用例 4: 负数 (注意：当前实现似乎将负数视为正数处理，只取绝对值)
	// 输入: -256n
	// 预期输出: [0x01, 0x00] (与 256n 结果相同)
	expect(bigIntBytes(-256n)).toStrictEqual(new Uint8Array([0x01, 0x00]));

	// 测试用例 5: 一个非常大的 BigInt
	// 这个数字需要多个字节来表示
	expect(
		bigIntBytes(5476057457410545405175640567415649081748931656501235026509713265394n)
	).toStrictEqual(
		// 预期输出: 对应的多字节大端序表示
		new Uint8Array([
			0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
			0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
		])
	);
});

// 测试 bigIntFromBytes() 函数：将字节数组转换为 BigInt
test("bigIntFromBytes()", () => {
	// 测试用例 1: 单字节 [0x01]
	// 预期输出: 1n
	expect(bigIntFromBytes(new Uint8Array([0x01]))).toBe(1n);

	// 测试用例 2: 单字节 [0xFF]
	// 预期输出: 255n
	expect(bigIntFromBytes(new Uint8Array([0xff]))).toBe(255n);

	// 测试用例 3: 双字节 [0x01, 0x00] (大端序)
	// 预期输出: 256n
	expect(bigIntFromBytes(new Uint8Array([0x01, 0x00]))).toBe(256n);

	// 测试用例 4: 多字节表示的大数 (与上面的 bigIntBytes 测试用例 5 对应)
	expect(
		bigIntFromBytes(
			// 输入: 多字节大端序表示
			new Uint8Array([
				0x33, 0xff, 0x8e, 0xec, 0x07, 0x9c, 0x46, 0x65, 0x7a, 0x20, 0xb5, 0xd4, 0xb4, 0x7d, 0xf6,
				0xb0, 0x59, 0xca, 0x46, 0xb4, 0x4b, 0xfa, 0xae, 0x0d, 0x3b, 0xf6, 0x52, 0xf2
			])
		)
	)
	// 预期输出: 对应的 BigInt 值
	.toBe(5476057457410545405175640567415649081748931656501235026509713265394n);
});
