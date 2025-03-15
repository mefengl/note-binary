# @oslojs/binary

**Documentation: https://binary.oslojs.dev**

## 代码阅读推荐顺序（中文）

这个库主要用于处理二进制数据。如果你想了解代码的实现细节，建议按照以下顺序阅读源代码：

1. [src/bytes.ts](./src/bytes.ts) - 基础字节操作和动态缓冲区实现
2. [src/uint.ts](./src/uint.ts) - 无符号整数与字节数组间的转换，大小端字节序处理
3. [src/bits.ts](./src/bits.ts) - 位操作，包括循环左移和循环右移
4. [src/big.ts](./src/big.ts) - BigInt与字节数组间的转换
5. [src/index.ts](./src/index.ts) - 导出接口汇总

对应的测试文件：

- [src/bytes.test.ts](./src/bytes.test.ts)
- [src/uint.test.ts](./src/uint.test.ts)
- [src/bits.test.ts](./src/bits.test.ts)
- [src/big.test.ts](./src/big.test.ts)

---

A JavaScript library for working with binary data by [Oslo](https://oslojs.dev).

Alongside [`@oslojs/encoding`](https://encoding.oslojs.dev) and [`@oslojs/crypto`](https://crypto.oslojs.dev), it aims to provide a basic toolbox for implementing auth and auth-related standards.

## Installation

```
npm i @oslojs/binary
```
