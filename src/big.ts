/**
 * big.ts - BigInt与字节数组转换
 * 
 * 这个文件提供了在BigInt和字节数组之间进行转换的功能。
 * 
 * BigInt是JavaScript中用于表示任意精度整数的内置类型，它可以表示超过JavaScript标准Number类型能表示的范围
 * （Number最大可以精确表示到2^53-1）。这对于处理加密算法、大整数运算等场景非常有用。
 * 
 * 本模块实现了两个关键功能：
 * 1. 将BigInt转换为字节数组(Uint8Array)
 * 2. 从字节数组还原回BigInt
 * 
 * 这在需要序列化/反序列化大整数、在二进制协议中传输大整数、或者进行密码学运算时非常有用。
 */

/**
 * 将BigInt转换为字节数组
 * 
 * 这个函数接受一个BigInt值，计算需要多少个字节来表示它，然后将其转换为一个字节数组。
 * 返回的字节数组使用大端序(Big-Endian)表示，即最高位字节在前。
 * 
 * 算法步骤：
 * 1. 如果输入是负数，取其绝对值（忽略符号）
 * 2. 计算表示这个数需要的最少字节数
 * 3. 创建一个适当大小的字节数组
 * 4. 从高位到低位，依次将数字的每8位(1字节)提取出来并存入数组
 * 
 * 例如，数字300(二进制：100101100)需要2个字节表示，转换结果为[1, 44]
 * 
 * @param value 要转换的BigInt值
 * @returns 表示该BigInt的字节数组(Uint8Array)，使用大端序
 */
export function bigIntBytes(value: bigint): Uint8Array {
	// 处理负数：取绝对值
	if (value < 0n) {
		value = value * -1n;
	}
	
	// 计算需要的字节数
	let byteLength = 1;
	while (value > 2n ** BigInt(byteLength * 8) - 1n) {
		byteLength++;
	}
	
	// 创建结果数组
	const encoded = new Uint8Array(byteLength);
	
	// 填充字节数组
	for (let i = 0; i < encoded.byteLength; i++) {
		// 从高位字节开始，依次提取每个字节
		// (value >> BigInt((encoded.byteLength - i - 1) * 8))将对应位置的字节移到最低8位
		// & 0xffn 取最低8位的值(一个字节)
		encoded[i] = Number((value >> BigInt((encoded.byteLength - i - 1) * 8)) & 0xffn);
	}
	
	return encoded;
}

/**
 * 从字节数组中还原BigInt值
 * 
 * 这个函数与bigIntBytes功能相反，它接受一个字节数组，将其解释为大端序(Big-Endian)表示的整数，
 * 然后返回对应的BigInt值。
 * 
 * 算法步骤：
 * 1. 确保输入的字节数组不为空
 * 2. 初始化结果为0n(BigInt类型的0)
 * 3. 从最高位字节到最低位字节，依次将每个字节的值累加到结果中
 * 4. 每累加一个字节，将之前的结果左移8位
 * 
 * 例如，字节数组[1, 44]将被解释为数字300
 * 
 * @param bytes 表示整数的字节数组(Uint8Array)，使用大端序
 * @returns 解析出的BigInt值
 * @throws 如果输入的字节数组为空，抛出TypeError
 */
export function bigIntFromBytes(bytes: Uint8Array): bigint {
	if (bytes.byteLength < 1) {
		throw new TypeError("Empty Uint8Array");
	}
	
	let decoded = 0n; // 初始化结果为BigInt类型的0
	
	for (let i = 0; i < bytes.byteLength; i++) {
		// 从高位字节开始处理
		// 每个字节乘以对应的2^n次方(左移操作)后累加到结果
		decoded += BigInt(bytes[i]) << BigInt((bytes.byteLength - 1 - i) * 8);
	}
	
	return decoded;
}
