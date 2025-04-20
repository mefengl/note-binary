/**
 * bytes.test.ts - bytes.ts 的测试文件
 * 
 * 这个文件包含了针对 `src/bytes.ts` 文件中函数的单元测试。
 * 测试的目的是确保 `bytes.ts` 里的代码在各种情况下都能正确工作。
 * 我们使用了 `vitest` 这个测试框架来编写和运行测试。
 * 
 * 每个 `test(...)` 或 `describe(...)` 块都代表一个或一组测试用例。
 * 在每个测试用例中，我们会调用 `bytes.ts` 中的函数，然后使用 `expect(...).toBe(...)` 或 `expect(...).toStrictEqual(...)` 
 * 来检查函数的返回值是否符合我们的预期。
 */
import { describe, expect, test } from "vitest";

import { compareBytes, concatenateBytes, DynamicBuffer } from "./bytes.js";

// 测试 compareBytes 函数
test("compareBytes()", () => {
	// 生成一个包含32个随机字节的数组
	const randomBytes = new Uint8Array(32);
	// 使用浏览器的 crypto API 来填充随机数，这是一种安全的随机数生成方式
	crypto.getRandomValues(randomBytes);
	// 期望：比较同一个数组，结果应该是 true (相同)
	expect(compareBytes(randomBytes, randomBytes)).toBe(true);

	// 再生成一个包含32个随机字节的数组
	const anotherRandomBytes = new Uint8Array(32);
	crypto.getRandomValues(anotherRandomBytes);
	// 期望：比较两个不同的随机数组，结果应该是 false (不同)
	// 思考：虽然两个数组长度相同，但内容几乎不可能完全一样
	expect(compareBytes(randomBytes, anotherRandomBytes)).toBe(false);

	// 期望：比较两个长度不同的空数组和非空数组，结果应该是 false (不同)
	// 思考：compareBytes 首先会检查长度，长度不同直接返回 false
	expect(compareBytes(new Uint8Array(0), new Uint8Array(1))).toBe(false);
});

// 测试 concatenateBytes 函数
test("concatenateBytes()", () => {
	// 定义两个简单的字节数组
	const a = new Uint8Array([0, 1]);
	const b = new Uint8Array([2, 3, 4]);
	// 期望：连接 a 和 b，结果应该是 [0, 1, 2, 3, 4]
	// toStrictEqual 会检查数组的内容和类型是否完全相等
	expect(concatenateBytes(a, b)).toStrictEqual(new Uint8Array([0, 1, 2, 3, 4]));
});

// 使用 describe 对 DynamicBuffer 类的测试进行分组
describe("DynamicBuffer", () => {
	// 测试 DynamicBuffer 的 write 方法
	test("DynamicBuffer.write()", () => {
		// 创建一个初始容量为 0 的动态缓冲区
		const buffer = new DynamicBuffer(0);
		// 写入一个字节 [0x01]
		buffer.write(new Uint8Array([0x01]));
		// 期望：缓冲区内容为 [0x01]
		expect(buffer.bytes()).toStrictEqual(new Uint8Array([0x01]));

		// 写入一个包含100个0字节的数组
		buffer.write(new Uint8Array(100));
		// 期望：由于写入了100个字节，总长度为101，超过了初始容量。
		// 缓冲区会自动扩容，根据扩容策略（通常是翻倍），容量会变成大于等于101的2的幂次方，这里是128。
		expect(buffer.capacity).toStrictEqual(128);
		// 期望：缓冲区内容是 [0x01] 后面跟着100个0
		expect(buffer.bytes()).toStrictEqual(new Uint8Array([0x01, ...new Uint8Array(100)]));

		// 再写入27个0字节
		buffer.write(new Uint8Array(27));
		// 期望：总长度变为 1 + 100 + 27 = 128
		expect(buffer.length).toStrictEqual(128);
		// 期望：容量正好是128，不需要再次扩容
		expect(buffer.capacity).toStrictEqual(128);
	});

	// 测试 DynamicBuffer 的 writeByte 方法
	test("DynamicBuffer.writeByte()", () => {
		// 创建一个初始容量为 0 的动态缓冲区
		const buffer = new DynamicBuffer(0);
		// 写入单个字节 0x01
		buffer.writeByte(0x01);
		// 期望：缓冲区内容为 [0x01]
		expect(buffer.bytes()).toStrictEqual(new Uint8Array([0x01]));

		// 再依次写入三个字节 0x02, 0x03, 0x04
		buffer.writeByte(0x02);
		buffer.writeByte(0x03);
		buffer.writeByte(0x04);
		// 期望：总共写入了4个字节，缓冲区容量会自动扩容到4
		// 思考：每次写入单个字节时，如果容量不足也会触发扩容
		expect(buffer.capacity).toBe(4);
		// 期望：缓冲区内容为 [0x01, 0x02, 0x03, 0x04]
		expect(buffer.bytes()).toStrictEqual(new Uint8Array([0x01, 0x02, 0x03, 0x04]));
	});
});
