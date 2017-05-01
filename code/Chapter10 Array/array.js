/// Improved Array Capabilities details the changes to native arrays and the interesting new ways they can be used in JavaScript.
///增强的数组功能
//创建数组
//ES5
let items = new Array(2);
console.log(items.length); // 2
console.log(items[0]); // undefined
console.log(items[1]); // undefined

items = new Array("2");
console.log(items.length); // 1
console.log(items[0]); // "2"

items = new Array(1, 2);
console.log(items.length); // 2
console.log(items[0]); // 1
console.log(items[1]); // 2

items = new Array(3, "2");
console.log(items.length); // 2
console.log(items[0]); // 3
console.log(items[1]); // "2"

//ES6
let items = Array.of(1, 2);
console.log(items.length); // 2
console.log(items[0]); // 1
console.log(items[1]); // 2

items = Array.of(2);
console.log(items.length); // 1
console.log(items[0]); // 2

items = Array.of("2");
console.log(items.length); // 1
console.log(items[0]); // "2"

//Array.from()方法
//ES5
function makeArray(arrayLike) {
	var result = [];

	for (var i = 0, len = arrayLike.length; i < len; i++) {
		result.push(arrayLike[i]);
	}

	return result;
}

function doSomething() {
	var args = makeArray(arguments);

	// 使用 args
}

//slice
function makeArray(arrayLike) {
	return Array.prototype.slice.call(arrayLike);
}

function doSomething() {
	var args = makeArray(arguments);

	// 使用 args
}

//ES6
function doSomething() {
	var args = Array.from(arguments);

	// 使用 args
}

//映射转换
function translate() {
	return Array.from(arguments, (value) => value + 1);
}
let numbers = translate(1, 2, 3);
console.log(numbers); // 2,3,4

let helper = {
	diff: 1,

	add(value) {
		return value + this.diff;
	}
};

function translate() {
	return Array.from(arguments, helper.add, helper);
}
let numbers = translate(1, 2, 3);
console.log(numbers); // 2,3,4

//在可迭代对象上使用
let numbers = { * [Symbol.iterator]() {
		yield 1;
		yield 2;
		yield 3;
	}
};
let numbers2 = Array.from(numbers, (value) => value + 1);
console.log(numbers2); // 2,3,4


///所有数组上的新方法
//find() 和 findIndex()
let numbers = [25, 30, 35, 40, 45];
console.log(numbers.find(n => n > 33)); // 35
console.log(numbers.findIndex(n => n > 33)); // 2

//fill()方法
let numbers = [1, 2, 3, 4];
numbers.fill(1);
console.log(numbers.toString()); // 1,1,1,1

let numbers = [1, 2, 3, 4];
numbers.fill(1, 2);
console.log(numbers.toString()); // 1,2,1,1
numbers.fill(0, 1, 3);
console.log(numbers.toString()); // 1,0,0,1

//copyWithin()方法
let numbers = [1, 2, 3, 4];
// 从索引 2 的位置开始粘贴
// 从数组索引 0 的位置开始复制数据
numbers.copyWithin(2, 0);
console.log(numbers.toString()); // 1,2,1,2

let numbers = [1, 2, 3, 4];
// 从索引 2 的位置开始粘贴
// 从数组索引 0 的位置开始复制数据
// 在遇到索引 1 时停止复制
numbers.copyWithin(2, 0, 1);
console.log(numbers.toString()); // 1,2,1,4

//数组缓冲区
let buffer = new ArrayBuffer(10); // 分配了 10 个字节
console.log(buffer.byteLength); // 10

let buffer = new ArrayBuffer(10); // 分配了 10 个字节
let buffer2 = buffer.slice(4, 6);
console.log(buffer2.byteLength); // 2

//使用视图操作数组缓冲区
let buffer = new ArrayBuffer(10),
	view = new DataView(buffer);

let buffer = new ArrayBuffer(10),
	view = new DataView(buffer, 5, 2); // 包含位置 5 与位置 6 的字节

//获取视图信息
let buffer = new ArrayBuffer(10),
	view1 = new DataView(buffer), // 包含所有字节
	view2 = new DataView(buffer, 5, 2); // 包含位置 5 与位置 6 的字节

console.log(view1.buffer === buffer); // true
console.log(view2.buffer === buffer); // true
console.log(view1.byteOffset); // 0
console.log(view2.byteOffset); // 5
console.log(view1.byteLength); // 10
console.log(view2.byteLength); // 2

let buffer = new ArrayBuffer(2),
	view = new DataView(buffer);
view.setInt8(0, 5);
view.setInt8(1, -1);
console.log(view.getInt8(0)); // 5
console.log(view.getInt8(1)); // -1

let buffer = new ArrayBuffer(2),
	view = new DataView(buffer);
view.setInt8(0, 5);
view.setInt8(1, -1);
console.log(view.getInt16(0)); // 1535
console.log(view.getInt8(0)); // 5
console.log(view.getInt8(1)); // -1

//创建特定类型视图
let buffer = new ArrayBuffer(10),
	view1 = new Int8Array(buffer),
	view2 = new Int8Array(buffer, 5, 2);
console.log(view1.buffer === buffer); // true
console.log(view2.buffer === buffer); // true
console.log(view1.byteOffset); // 0
console.log(view2.byteOffset); // 5
console.log(view1.byteLength); // 10
console.log(view2.byteLength); // 2

let ints = new Int16Array(2),
	floats = new Float32Array(5);
console.log(ints.byteLength); // 4
console.log(ints.length); // 2
console.log(floats.byteLength); // 20
console.log(floats.length); // 5

let ints1 = new Int16Array([25, 50]),
	ints2 = new Int32Array(ints1);
console.log(ints1.buffer === ints2.buffer); // false
console.log(ints1.byteLength); // 4
console.log(ints1.length); // 2
console.log(ints1[0]); // 25
console.log(ints1[1]); // 50
console.log(ints2.byteLength); // 8
console.log(ints2.length); // 2
console.log(ints2[0]); // 25
console.log(ints2[1]); // 50

//类型化数组和常规数组的相似点
//相同的迭代器
let ints = new Int16Array([25, 50]),
	intsArray = [...ints];
console.log(intsArray instanceof Array); // true
console.log(intsArray[0]); // 25
console.log(intsArray[1]); // 50

//类型化数组和常规数组的区别
let ints = new Int16Array([25, 50]);
console.log(ints instanceof Array); // false
console.log(Array.isArray(ints)); // false、

//行为差异
let ints = new Int16Array([25, 50]);
console.log(ints.length); // 2
console.log(ints[0]); // 25
console.log(ints[1]); // 50
ints[2] = 5;
console.log(ints.length); // 2
console.log(ints[2]); // undefined

let ints = new Int16Array([25, 50]),
	mapped = ints.map(v => "hi");
console.log(mapped.length); // 2
console.log(mapped[0]); // 0
console.log(mapped[1]); // 0
console.log(mapped instanceof Int16Array); // true
console.log(mapped instanceof Array); // false

//附加的方法
let ints = new Int16Array(4);
ints.set([25, 50]);
ints.set([75, 100], 2);
console.log(ints.toString()); // 25,50,75,100

let ints = new Int16Array([25, 50, 75, 100]),
	subints1 = ints.subarray(),
	subints2 = ints.subarray(2),
	subints3 = ints.subarray(1, 3);
console.log(subints1.toString()); // 25,50,75,100
console.log(subints2.toString()); // 75,100
console.log(subints3.toString()); // 50,75