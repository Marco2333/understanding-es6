///Iterators and Generators discusses the addition of iterators and generators to the language. 
///These features allow you to work with collections of data in powerful ways that were not possible in previous versions of JavaScript.
//何为迭代器
//ES5
function createIterator(items) {
	var i = 0;
	return {
		next: function() {
			var done = (i >= items.length);
			var value = !done ? items[i++] : undefined;
			return {
				done: done,
				value: value
			};

		}
	};
}

var iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"

//何为生成器
// 生成器
function* createIterator() {
		yield 1;
		yield 2;
		yield 3;
	}
	// 生成器能像正规函数那样被调用，但会返回一个迭代器
let iterator = createIterator();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3

function* createIterator(items) {
	for (let i = 0; i < items.length; i++) {
		yield items[i];
	}
}
let iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"

function* createIterator(items) {
	items.forEach(function(item) {
		// 语法错误
		yield item + 1;
	});
}

//生成器函数表达式
let createIterator = function*(items) {
	for (let i = 0; i < items.length; i++) {
		yield items[i];
	}
};
let iterator = createIterator([1, 2, 3]);
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"
// 之后的所有调用
console.log(iterator.next()); // "{ value: undefined, done: true }"

//生成器对象方法
var o = {
	createIterator: function*(items) {
		for (let i = 0; i < items.length; i++) {
			yield items[i];
		}
	}
};
let iterator = o.createIterator([1, 2, 3]);

var o = { * createIterator(items) {
		for (let i = 0; i < items.length; i++) {
			yield items[i];
		}
	}
};
let iterator = o.createIterator([1, 2, 3]);

//可迭代对象与for-of循环
let values = [1, 2, 3];
for (let num of values) {
	console.log(num);
}

//访问默认的迭代器
let values = [1, 2, 3];
let iterator = values[Symbol.iterator]();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

function isIterable(object) {
	return typeof object[Symbol.iterator] === "function";
}
console.log(isIterable([1, 2, 3])); // true
console.log(isIterable("Hello")); // true
console.log(isIterable(new Map())); // true
console.log(isIterable(new Set())); // true
console.log(isIterable(new WeakMap())); // false
console.log(isIterable(new WeakSet())); // false

//创建可迭代对象
let collection = {
	items: [],
	* [Symbol.iterator]() {
		for (let item of this.items) {
			yield item;
		}
	}

};
collection.items.push(1);
collection.items.push(2);
collection.items.push(3);
for (let x of collection) {
	console.log(x);
}


///内置的迭代器
//entries() 迭代器
let colors = ["red", "green", "blue"];
let tracking = new Set([1234, 5678, 9012]);
let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "ebook");
for (let entry of colors.entries()) {
	console.log(entry);
}
for (let entry of tracking.entries()) {
	console.log(entry);
}
for (let entry of data.entries()) {
	console.log(entry);
}
//values() 迭代器
let colors = ["red", "green", "blue"];
let tracking = new Set([1234, 5678, 9012]);
let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "ebook");
for (let value of colors.values()) {
	console.log(value);
}
for (let value of tracking.values()) {
	console.log(value);
}
for (let value of data.values()) {
	console.log(value);
}
//keys() 迭代器
let colors = ["red", "green", "blue"];
let tracking = new Set([1234, 5678, 9012]);
let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "ebook");
for (let key of colors.keys()) {
	console.log(key);
}
for (let key of tracking.keys()) {
	console.log(key);
}
for (let key of data.keys()) {
	console.log(key);
}

//集合类型的默认迭代器
let colors = ["red", "green", "blue"];
let tracking = new Set([1234, 5678, 9012]);
let data = new Map();
data.set("title", "Understanding ES6");
data.set("format", "print");
// 与使用 colors.values() 相同
for (let value of colors) {
	console.log(value);
}
// 与使用 tracking.values() 相同
for (let num of tracking) {
	console.log(num);
}
// 与使用 data.entries() 相同
for (let entry of data) {
	console.log(entry);
}


//字符串的迭代器
var message = "A 𠮷 B";
for (let c of message) {
	console.log(c);
}
//A
//(blank)
//𠮷
//(blank)
//B

//NodeList的迭代器
var divs = document.getElementsByTagName("div");
for (let div of divs) {
	console.log(div.id);
}

//扩展运算符与非数组的可迭代对象
let set = new Set([1, 2, 3, 3, 3, 4, 5]),
	array = [...set];
console.log(array); // [1,2,3,4,5]

let map = new Map([
		["name", "Nicholas"],
		["age", 25]
	]),
	array = [...map];
console.log(array); // [ ["name", "Nicholas"], ["age", 25]]

let smallNumbers = [1, 2, 3],
	bigNumbers = [100, 101, 102],
	allNumbers = [0, ...smallNumbers, ...bigNumbers];
console.log(allNumbers.length); // 7
console.log(allNumbers); // [0, 1, 2, 3, 100, 101, 102]


///迭代器的高级功能
//传递参数给迭代器
function* createIterator() {
	let first = yield 1;
	let second = yield first + 2; // 4 + 2
	yield second + 3; // 5 + 3
}
let iterator = createIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next(4)); // "{ value: 6, done: false }"
console.log(iterator.next(5)); // "{ value: 8, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

//在迭代器中抛出错误
function* createIterator() {
	let first = yield 1;
	let second = yield first + 2; // yield 4 + 2 ，然后抛出错误
	yield second + 3; // 永不会被执行
}
let iterator = createIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next(4)); // "{ value: 6, done: false }"
console.log(iterator.throw(new Error("Boom"))); // 从生成器中抛出了错误

function* createIterator() {
	let first = yield 1;
	let second;
	try {
		second = yield first + 2; // yield 4 + 2 ，然后抛出错误
	} catch (ex) {
		second = 6; // 当出错时，给变量另外赋值
	}
	yield second + 3;
}
let iterator = createIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next(4)); // "{ value: 6, done: false }"
console.log(iterator.throw(new Error("Boom"))); // "{ value: 9, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

//生成器的Return语句
function* createIterator() {
	yield 1;
	return;
	yield 2;
	yield 3;
}

let iterator = createIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

function* createIterator() {
	yield 1;
	return 42;
}
let iterator = createIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 42, done: true }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

//生成器委托
function* createNumberIterator() {
	yield 1;
	yield 2;
}

function* createColorIterator() {
	yield "red";
	yield "green";
}

function* createCombinedIterator() {
	yield * createNumberIterator();
	yield * createColorIterator();
	yield true;
}
var iterator = createCombinedIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: "red", done: false }"
console.log(iterator.next()); // "{ value: "green", done: false }"
console.log(iterator.next()); // "{ value: true, done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

//使用生成器的返回值
function* createNumberIterator() {
	yield 1;
	yield 2;
	return 3;
}

function* createRepeatingIterator(count) {
	for (let i = 0; i < count; i++) {
		yield "repeat";
	}
}

function* createCombinedIterator() {
	let result = yield * createNumberIterator();
	yield * createRepeatingIterator(result);
}

var iterator = createCombinedIterator();

console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"

//输出返回值
function* createNumberIterator() {
	yield 1;
	yield 2;
	return 3;
}

function* createRepeatingIterator(count) {
	for (let i = 0; i < count; i++) {
		yield "repeat";
	}
}

function* createCombinedIterator() {
	let result = yield * createNumberIterator();
	yield result;
	yield * createRepeatingIterator(result);
}

var iterator = createCombinedIterator();
console.log(iterator.next()); // "{ value: 1, done: false }"
console.log(iterator.next()); // "{ value: 2, done: false }"
console.log(iterator.next()); // "{ value: 3, done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: "repeat", done: false }"
console.log(iterator.next()); // "{ value: undefined, done: true }"


///异步任务运行
let fs = require("fs");
fs.readFile("config.json", function(err, contents) {
	if (err) {
		throw err;
	}

	doSomethingWith(contents);
	console.log("Done");
});

//一个简单的任务运行器
function run(taskDef) {
	// 创建迭代器，让它在别处可用
	let task = taskDef();
	// 启动任务
	let result = task.next();
	// 递归使用函数来保持对 next() 的调用
	function step() {
		// 如果还有更多要做的
		if (!result.done) {
			result = task.next();
			step();
		}
	}
	// 开始处理过程
	step();
}

run(function*() {
	console.log(1);
	yield;
	console.log(2);
	yield;
	console.log(3);
});

//带数据的任务运行
function run(taskDef) {
	// 创建迭代器，让它在别处可用
	let task = taskDef();
	// 启动任务
	let result = task.next();
	// 递归使用函数来保持对 next() 的调用
	function step() {
		// 如果还有更多要做的
		if (!result.done) {
			result = task.next(result.value);
			step();
		}
	}
	// 开始处理过程
	step();
}

run(function*() {
	let value = yield 1;
	console.log(value); // 1
	value = yield value + 3;
	console.log(value); // 4
});

//异步任务运行器
function run(taskDef) {
	// 创建迭代器，让它在别处可用
	let task = taskDef();
	// 启动任务
	let result = task.next();
	// 递归使用函数来保持对 next() 的调用
	function step() {
		// 如果还有更多要做的
		if (!result.done) {
			if (typeof result.value === "function") {
				result.value(function(err, data) {
					if (err) {
						result = task.throw(err);
						return;
					}
					result = task.next(data);
					step();
				});
			} else {
				result = task.next(result.value);
				step();
			}

		}
	}
	// 开始处理过程
	step();
}

let fs = require("fs");

function readFile(filename) {
	return function(callback) {
		fs.readFile(filename, callback);
	};
}

run(function*() {
	let contents = yield readFile("config.json");
	doSomethingWith(contents);
	console.log("Done");
});