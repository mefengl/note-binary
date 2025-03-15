/**
 * index.ts - 库主入口文件
 * 
 * 这个文件是@oslojs/binary库的主入口点，它汇总并导出了库中所有的公共API。
 * 通过这个文件，使用者可以访问库中提供的所有功能。
 * 
 * 这个库主要提供了以下几类功能：
 * 
 * 1. 字节操作：
 *   - compareBytes: 比较两个字节数组是否相同
 *   - concatenateBytes: 连接两个字节数组
 *   - DynamicBuffer: 动态增长的字节缓冲区
 *   
 * 2. 字节序和无符号整数转换：
 *   - bigEndian: 大端序(高位字节在前)处理器
 *   - littleEndian: 小端序(低位字节在前)处理器
 *   - ByteOrder: 字节序接口类型定义
 *   
 * 3. 位操作：
 *   - rotl32/rotl64: 32位/64位数字向左循环移位
 *   - rotr32/rotr64: 32位/64位数字向右循环移位
 *   
 * 4. BigInt操作：
 *   - bigIntBytes: 将BigInt转换为字节数组
 *   - bigIntFromBytes: 从字节数组中还原BigInt值
 * 
 * 使用这个库可以方便地进行二进制数据处理、字节转换、位操作等底层操作，
 * 适用于实现加密算法、二进制协议、网络通信等场景。
 */

// 导出字节序相关组件
export { bigEndian, littleEndian } from "./uint.js";
export type { ByteOrder } from "./uint.js";

// 导出字节操作相关组件
export { compareBytes, concatenateBytes, DynamicBuffer } from "./bytes.js";

// 导出位操作相关函数
export { rotl32, rotr32, rotl64, rotr64 } from "./bits.js";

// 导出BigInt相关函数
export { bigIntBytes, bigIntFromBytes } from "./big.js";
