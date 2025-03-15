/**
 * uint.ts - 无符号整数与字节数组的转换
 * 
 * 这个文件实现了在字节数组和无符号整数之间进行转换的功能，同时处理了大端序(Big-Endian)和小端序(Little-Endian)的编码方式。
 * 
 * 什么是字节序？
 * 字节序是指多字节数据在内存中的存储顺序。比如数字258的十六进制表示是0x0102，它需要两个字节来存储：
 * - 大端序(Big-Endian)：高位字节在前，低位字节在后，即 [0x01, 0x02]
 * - 小端序(Little-Endian)：低位字节在前，高位字节在后，即 [0x02, 0x01]
 * 
 * 为什么字节序很重要？
 * 不同的计算机系统可能使用不同的字节序。在网络传输中，通常使用大端序(也称为"网络字节序")，而许多处理器(如x86)在内存中使用小端序。
 * 当在不同系统间传输数据或读写二进制文件时，了解并正确处理字节序非常重要。
 * 
 * 本模块提供了两种字节序的实现，以及用于二进制数据处理的工具函数。
 */

/**
 * 大端序(Big-Endian)实现类
 * 
 * 大端序是指高位字节在前，低位字节在后的存储方式。
 * 例如，十六进制数0x12345678在内存中按字节的存储顺序为：12 34 56 78
 * 
 * 这种字节序在网络传输中很常见，因此也被称为"网络字节序"。
 */
class BigEndian implements ByteOrder {
	/**
	 * 从字节数组中读取8位无符号整数(0-255)
	 * 
	 * 对于单个字节的数据，大小端序没有区别
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 8位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint8(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 1) {
			throw new TypeError("Insufficient bytes");
		}
		return data[offset];
	}

	/**
	 * 从字节数组中读取16位无符号整数(0-65535)
	 * 
	 * 大端序中，高位字节在前
	 * 例如：[0x12, 0x34] 被解析为 0x1234 (十进制: 4660)
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 16位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint16(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 2) {
			throw new TypeError("Insufficient bytes");
		}
		return (data[offset] << 8) | data[offset + 1];
	}

	/**
	 * 从字节数组中读取32位无符号整数(0-4294967295)
	 * 
	 * 大端序中按字节顺序：byte0 byte1 byte2 byte3
	 * 例如：[0x12, 0x34, 0x56, 0x78] 被解析为 0x12345678
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 32位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint32(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 4) {
			throw new TypeError("Insufficient bytes");
		}
		let result = 0;
		for (let i = 0; i < 4; i++) {
			// 将每个字节移动到正确的位置并与结果进行按位或操作
			// 第一个字节移动24位，第二个字节移动16位，以此类推
			result |= data[offset + i] << (24 - i * 8);
		}
		return result;
	}

	/**
	 * 从字节数组中读取64位无符号整数(0-18446744073709551615)
	 * 
	 * 由于JavaScript中普通number类型最大只能精确表示到2^53-1，
	 * 所以这里使用BigInt类型来存储64位无符号整数
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 64位无符号整数(BigInt类型)
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint64(data: Uint8Array, offset: number): bigint {
		if (data.byteLength < offset + 8) {
			throw new TypeError("Insufficient bytes");
		}
		let result = 0n; // 使用BigInt类型
		for (let i = 0; i < 8; i++) {
			// 与uint32类似，但使用BigInt进行计算
			result |= BigInt(data[offset + i]) << BigInt(56 - i * 8);
		}
		return result;
	}

	/**
	 * 将8位无符号整数写入字节数组
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的8位无符号整数(0-255)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint8(target: Uint8Array, value: number, offset: number): void {
		if (target.length < offset + 1) {
			throw new TypeError("Not enough space");
		}
		if (value < 0 || value > 255) {
			throw new TypeError("Invalid uint8 value");
		}
		target[offset] = value;
	}

	/**
	 * 将16位无符号整数写入字节数组
	 * 
	 * 大端序中，高位字节在前
	 * 例如：数字0x1234将被写入为[0x12, 0x34]
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的16位无符号整数(0-65535)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint16(target: Uint8Array, value: number, offset: number): void {
		if (target.length < offset + 2) {
			throw new TypeError("Not enough space");
		}
		if (value < 0 || value > 65535) {
			throw new TypeError("Invalid uint16 value");
		}
		// 高8位放在第一个字节
		target[offset] = value >> 8;
		// 低8位放在第二个字节
		target[offset + 1] = value & 0xff;
	}

	/**
	 * 将32位无符号整数写入字节数组
	 * 
	 * 例如：数字0x12345678将被写入为[0x12, 0x34, 0x56, 0x78]
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的32位无符号整数(0-4294967295)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint32(target: Uint8Array, value: number, offset: number): void {
		if (target.length < offset + 4) {
			throw new TypeError("Not enough space");
		}
		if (value < 0 || value > 4294967295) {
			throw new TypeError("Invalid uint32 value");
		}
		for (let i = 0; i < 4; i++) {
			// 从最高位字节开始，依次写入每个字节
			target[offset + i] = (value >> ((3 - i) * 8)) & 0xff;
		}
	}

	/**
	 * 将64位无符号整数写入字节数组
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的64位无符号整数(BigInt类型)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint64(target: Uint8Array, value: bigint, offset: number): void {
		if (target.length < offset + 8) {
			throw new TypeError("Not enough space");
		}
		if (value < 0 || value > 18446744073709551615n) {
			throw new TypeError("Invalid uint64 value");
		}
		for (let i = 0; i < 8; i++) {
			// 从最高位字节开始，依次写入每个字节
			target[offset + i] = Number((value >> BigInt((7 - i) * 8)) & 0xffn);
		}
	}
}

/**
 * 小端序(Little-Endian)实现类
 * 
 * 小端序是指低位字节在前，高位字节在后的存储方式。
 * 例如，十六进制数0x12345678在内存中按字节的存储顺序为：78 56 34 12
 * 
 * 这种字节序在现代大多数处理器(如x86、x86_64和ARM)的内存中使用。
 */
class LittleEndian implements ByteOrder {
	/**
	 * 从字节数组中读取8位无符号整数(0-255)
	 * 
	 * 对于单个字节的数据，大小端序没有区别
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 8位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint8(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 1) {
			throw new TypeError("Insufficient bytes");
		}
		return data[offset];
	}

	/**
	 * 从字节数组中读取16位无符号整数(0-65535)
	 * 
	 * 小端序中，低位字节在前
	 * 例如：[0x34, 0x12] 被解析为 0x1234 (十进制: 4660)
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 16位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint16(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 2) {
			throw new TypeError("Insufficient bytes");
		}
		// 与大端序相反，这里是低位字节在前，高位字节在后
		return data[offset] | (data[offset + 1] << 8);
	}

	/**
	 * 从字节数组中读取32位无符号整数(0-4294967295)
	 * 
	 * 小端序中按字节顺序：byte3 byte2 byte1 byte0
	 * 例如：[0x78, 0x56, 0x34, 0x12] 被解析为 0x12345678
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 32位无符号整数
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint32(data: Uint8Array, offset: number): number {
		if (data.byteLength < offset + 4) {
			throw new TypeError("Insufficient bytes");
		}
		let result = 0;
		for (let i = 0; i < 4; i++) {
			// 第一个字节为最低8位，第二个字节左移8位，以此类推
			result |= data[offset + i] << (i * 8);
		}
		return result;
	}

	/**
	 * 从字节数组中读取64位无符号整数(0-18446744073709551615)
	 * 
	 * 由于JavaScript中普通number类型最大只能精确表示到2^53-1，
	 * 所以这里使用BigInt类型来存储64位无符号整数
	 * 
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 * @returns 64位无符号整数(BigInt类型)
	 * @throws 如果字节数不足，抛出TypeError
	 */
	public uint64(data: Uint8Array, offset: number): bigint {
		if (data.byteLength < offset + 8) {
			throw new TypeError("Insufficient bytes");
		}
		let result = 0n; // 使用BigInt类型
		for (let i = 0; i < 8; i++) {
			// 小端序：第一个字节是最低8位
			result |= BigInt(data[offset + i]) << BigInt(i * 8);
		}
		return result;
	}

	/**
	 * 将8位无符号整数写入字节数组
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的8位无符号整数(0-255)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint8(target: Uint8Array, value: number, offset: number): void {
		if (target.length < 1 + offset) {
			throw new TypeError("Insufficient space");
		}
		if (value < 0 || value > 255) {
			throw new TypeError("Invalid uint8 value");
		}
		target[offset] = value;
	}

	/**
	 * 将16位无符号整数写入字节数组
	 * 
	 * 小端序中，低位字节在前
	 * 例如：数字0x1234将被写入为[0x34, 0x12]
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的16位无符号整数(0-65535)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint16(target: Uint8Array, value: number, offset: number): void {
		if (target.length < 2 + offset) {
			throw new TypeError("Insufficient space");
		}
		if (value < 0 || value > 65535) {
			throw new TypeError("Invalid uint16 value");
		}
		// 低8位放在第一个字节
		target[offset] = value & 0xff;
		// 高8位放在第二个字节
		target[offset + 1] = value >> 8;
	}

	/**
	 * 将32位无符号整数写入字节数组
	 * 
	 * 例如：数字0x12345678将被写入为[0x78, 0x56, 0x34, 0x12]
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的32位无符号整数(0-4294967295)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint32(target: Uint8Array, value: number, offset: number): void {
		if (target.length < 4 + offset) {
			throw new TypeError("Insufficient space");
		}
		if (value < 0 || value > 4294967295) {
			throw new TypeError("Invalid uint32 value");
		}
		for (let i = 0; i < 4; i++) {
			// 从最低位字节开始，依次写入每个字节
			target[offset + i] = (value >> (i * 8)) & 0xff;
		}
	}

	/**
	 * 将64位无符号整数写入字节数组
	 * 
	 * @param target 目标字节数组
	 * @param value 要写入的64位无符号整数(BigInt类型)
	 * @param offset 偏移位置
	 * @throws 如果空间不足或值无效，抛出TypeError
	 */
	public putUint64(target: Uint8Array, value: bigint, offset: number): void {
		if (target.length < 8 + offset) {
			throw new TypeError("Insufficient space");
		}
		if (value < 0 || value > 18446744073709551615n) {
			throw new TypeError("Invalid uint64 value");
		}
		for (let i = 0; i < 8; i++) {
			// 从最低位字节开始，依次写入每个字节
			target[offset + i] = Number((value >> BigInt(i * 8)) & 0xffn);
		}
	}
}

/**
 * 大端序实例
 * 用于以大端序(高位字节在前)读取和写入无符号整数
 */
export const bigEndian = new BigEndian();

/**
 * 小端序实例
 * 用于以小端序(低位字节在前)读取和写入无符号整数
 */
export const littleEndian = new LittleEndian();

/**
 * 字节序接口
 * 
 * 这个接口定义了在字节数组和无符号整数之间转换的方法。
 * 通过这个统一接口，代码可以在不关心底层字节序的情况下处理二进制数据，
 * 只需使用正确的实现（bigEndian或littleEndian）即可。
 */
export interface ByteOrder {
	/**
	 * 从字节数组读取8位无符号整数
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 */
	uint8(data: Uint8Array, offset: number): number;
	
	/**
	 * 从字节数组读取16位无符号整数
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 */
	uint16(data: Uint8Array, offset: number): number;
	
	/**
	 * 从字节数组读取32位无符号整数
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 */
	uint32(data: Uint8Array, offset: number): number;
	
	/**
	 * 从字节数组读取64位无符号整数
	 * @param data 源字节数组
	 * @param offset 偏移位置
	 */
	uint64(data: Uint8Array, offset: number): bigint;
	
	/**
	 * 将8位无符号整数写入字节数组
	 * @param target 目标字节数组
	 * @param value 要写入的值
	 * @param offset 偏移位置
	 */
	putUint8(target: Uint8Array, value: number, offset: number): void;
	
	/**
	 * 将16位无符号整数写入字节数组
	 * @param target 目标字节数组
	 * @param value 要写入的值
	 * @param offset 偏移位置
	 */
	putUint16(target: Uint8Array, value: number, offset: number): void;
	
	/**
	 * 将32位无符号整数写入字节数组
	 * @param target 目标字节数组
	 * @param value 要写入的值
	 * @param offset 偏移位置
	 */
	putUint32(target: Uint8Array, value: number, offset: number): void;
	
	/**
	 * 将64位无符号整数写入字节数组
	 * @param target 目标字节数组
	 * @param value 要写入的值
	 * @param offset 偏移位置
	 */
	putUint64(target: Uint8Array, value: bigint, offset: number): void;
}
