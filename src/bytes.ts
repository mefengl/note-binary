/**
 * bytes.ts - 字节操作工具
 * 
 * 这个文件包含处理二进制数据的基本函数和类。在计算机中，所有数据最终都是以二进制形式存储的，
 * 而字节（byte）是处理二进制数据的基本单位，1字节=8位(bit)，可以表示0-255的数值。
 * 
 * 本模块使用JavaScript的Uint8Array类型来表示字节数组，它是一种专门用于存储8位无符号整数（即0-255范围内的数字）的类型化数组。
 * 
 * 主要包含的功能：
 * 1. 比较两个字节数组是否相同
 * 2. 连接两个字节数组
 * 3. 动态缓冲区实现，方便进行字节操作
 */

/**
 * 比较两个字节数组是否完全相同
 * 
 * 这个函数会检查两个Uint8Array是否包含完全相同的字节序列。
 * 首先比较长度，如果长度不同，则数组一定不同；
 * 然后逐字节比较，如果有任何一个字节不同，则数组不同。
 * 
 * 应用场景：比如验证哈希值、校验和、或验证加密操作结果是否符合预期等。
 * 
 * @param a 第一个字节数组
 * @param b 第二个字节数组
 * @returns 如果两个数组完全相同返回true，否则返回false
 */
export function compareBytes(a: Uint8Array, b: Uint8Array): boolean {
	if (a.byteLength !== b.byteLength) {
		return false;
	}
	for (let i = 0; i < b.byteLength; i++) {
		if (a[i] !== b[i]) {
			return false;
		}
	}
	return true;
}

/**
 * 连接两个字节数组成为一个新的字节数组
 * 
 * 这个函数会创建一个新的字节数组，其中包含参数a的所有字节，后跟参数b的所有字节。
 * 
 * 例如：
 * 如果a = [1, 2, 3]，b = [4, 5]
 * 则结果为 [1, 2, 3, 4, 5]
 * 
 * 应用场景：合并消息头和消息体、拼接多段数据等。
 * 
 * @param a 第一个字节数组
 * @param b 第二个字节数组
 * @returns 连接后的新字节数组
 */
export function concatenateBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
	const result = new Uint8Array(a.byteLength + b.byteLength);
	result.set(a);
	result.set(b, a.byteLength);
	return result;
}

/**
 * 动态缓冲区类
 * 
 * 这是一个可以动态增长的字节缓冲区实现。普通的Uint8Array一旦创建，大小就不能改变。
 * 而DynamicBuffer类提供了一个可以根据需要自动扩容的缓冲区，类似于ArrayList或Vector的概念。
 * 
 * 工作原理：
 * - 当缓冲区容量不足时，会自动扩容（通常是将容量翻倍）
 * - 扩容时会创建新的更大的缓冲区，并把原有数据复制过去
 * 
 * 应用场景：当你不知道最终需要多少字节空间，或者需要逐步构建二进制数据时特别有用，
 * 比如构建网络协议消息、序列化对象、或者动态生成二进制文件格式等。
 */
export class DynamicBuffer {
	/**
	 * 内部存储数据的Uint8Array
	 */
	private value: Uint8Array;
	
	/**
	 * 当前缓冲区的总容量（可以存储的最大字节数）
	 */
	public capacity: number;
	
	/**
	 * 当前已使用的字节数
	 */
	public length = 0;

	/**
	 * 创建一个新的动态缓冲区
	 * 
	 * @param capacity 初始容量（字节数）
	 */
	constructor(capacity: number) {
		this.value = new Uint8Array(capacity);
		this.capacity = capacity;
	}

	/**
	 * 写入一组字节到缓冲区
	 * 
	 * 如果当前容量不足，会自动扩容，直到能够容纳新数据。
	 * 扩容策略是容量翻倍，这样可以减少频繁扩容带来的性能开销。
	 * 
	 * @param bytes 要写入的字节数组
	 */
	public write(bytes: Uint8Array): void {
		if (this.length + bytes.byteLength <= this.capacity) {
			this.value.set(bytes, this.length);
			this.length += bytes.byteLength;
			return;
		}
		while (this.length + bytes.byteLength > this.capacity) {
			if (this.capacity === 0) {
				this.capacity = 1;
			} else {
				this.capacity = this.capacity * 2;
			}
		}
		const newValue = new Uint8Array(this.capacity);
		newValue.set(this.value.subarray(0, this.length));
		newValue.set(bytes, this.length);
		this.value = newValue;
		this.length += bytes.byteLength;
	}

	/**
	 * 写入单个字节到缓冲区
	 * 
	 * 与write方法类似，但优化用于写入单个字节的场景。
	 * 如果容量不足，同样会自动扩容。
	 * 
	 * @param byte 要写入的字节值（0-255之间的整数）
	 */
	public writeByte(byte: number): void {
		if (this.length + 1 <= this.capacity) {
			this.value[this.length] = byte;
			this.length++;
			return;
		}
		if (this.capacity === 0) {
			this.capacity = 1;
		} else {
			this.capacity = this.capacity * 2;
		}
		const newValue = new Uint8Array(this.capacity);
		newValue.set(this.value.subarray(0, this.length));
		newValue[this.length] = byte;
		this.value = newValue;
		this.length++;
	}

	/**
	 * 将缓冲区的内容读入到指定的目标数组中
	 * 
	 * 目标数组必须有足够的空间，否则会抛出错误。
	 * 
	 * @param target 目标Uint8Array，用于接收数据
	 * @throws 如果目标数组空间不足，会抛出TypeError
	 */
	public readInto(target: Uint8Array): void {
		if (target.byteLength < this.length) {
			throw new TypeError("Not enough space");
		}
		target.set(this.value.subarray(0, this.length));
	}

	/**
	 * 获取缓冲区当前的有效内容
	 * 
	 * 返回一个新的Uint8Array，只包含已写入的有效数据。
	 * 这个方法会创建一个新的数组，原始数据不会被修改。
	 * 
	 * @returns 包含缓冲区有效内容的新Uint8Array
	 */
	public bytes(): Uint8Array {
		return this.value.slice(0, this.length);
	}

	/**
	 * 清空缓冲区
	 * 
	 * 这个方法只是重置length为0，而不是真正地清除数据或释放内存。
	 * 原来的数据虽然还在内存中，但因为length为0，所以在逻辑上这些数据不再可访问。
	 * 这样设计可以避免频繁地创建新的Uint8Array，提高性能。
	 */
	public clear(): void {
		this.length = 0;
	}
}
