///Proxies and the Reflection API introduces the formalized reflection API for JavaScript 
///and the new proxy object that allows you to intercept every operation performed on an 
///object. Proxies give developers unprecedented control over objects and, as such, 
///unlimited possibilities for defining new interaction patterns.
//创建一个简单的代理
let target = {};
let proxy = new Proxy(target, {});
proxy.name = "proxy";
console.log(proxy.name); // "proxy"
console.log(target.name); // "proxy"
target.name = "target";
console.log(proxy.name); // "target"
console.log(target.name); // "target"

//使用set陷阱函数验证属性值
let target = {
	name: "target"
};

let proxy = new Proxy(target, {
	set(trapTarget, key, value, receiver) {

		// 忽略已有属性，避免影响它们
		if (!trapTarget.hasOwnProperty(key)) {
			if (isNaN(value)) {
				throw new TypeError("Property must be a number.");
			}
		}

		// 添加属性
		return Reflect.set(trapTarget, key, value, receiver);
	}
});
// 添加一个新属性
proxy.count = 1;
console.log(proxy.count); // 1
console.log(target.count); // 1
// 你可以为 name 赋一个非数值类型的值，因为该属性已经存在
proxy.name = "proxy";
console.log(proxy.name); // "proxy"
console.log(target.name); // "proxy"
// 抛出错误
proxy.anotherName = "proxy";

//使用get函数进行对象外形验证
let proxy = new Proxy({}, {
	get(trapTarget, key, receiver) {
		if (!(key in receiver)) {
			throw new TypeError("Property " + key + " doesn't exist.");
		}

		return Reflect.get(trapTarget, key, receiver);
	}
});
// 添加属性的功能正常
proxy.name = "proxy";
console.log(proxy.name); // "proxy"
// 读取不存在属性会抛出错误
console.log(proxy.nme); // 抛出错误

//使用has陷阱函数隐藏属性
let target = {
	name: "target",
	value: 42
};
let proxy = new Proxy(target, {
	has(trapTarget, key) {
		if (key === "value") {
			return false;
		} else {
			return Reflect.has(trapTarget, key);
		}
	}
});
console.log("value" in proxy); // false
console.log("name" in proxy); // true
console.log("toString" in proxy); // true

//使用deleteProperty陷阱函数避免属性被删除
let target = {
	name: "target",
	value: 42
};
Object.defineProperty(target, "name", {
	configurable: false
});
console.log("value" in target); // true
let result1 = delete target.value;
console.log(result1); // true
console.log("value" in target); // false
// 注：下一行代码在严格模式下会抛出错误
let result2 = delete target.name;
console.log(result2); // false
console.log("name" in target); // true

let target = {
	name: "target",
	value: 42
};
let proxy = new Proxy(target, {
	deleteProperty(trapTarget, key) {
		if (key === "value") {
			return false;
		} else {
			return Reflect.deleteProperty(trapTarget, key);
		}
	}
});
// 尝试删除 proxy.value
console.log("value" in proxy); // true
let result1 = delete proxy.value;
console.log(result1); // false
console.log("value" in proxy); // true
// 尝试删除 proxy.name
console.log("name" in proxy); // true
let result2 = delete proxy.name;
console.log(result2); // true
console.log("name" in proxy); // false

//原型代理的陷阱函数
//原型代理的陷阱函数如何工作
let target = {};
let proxy = new Proxy(target, {
	getPrototypeOf(trapTarget) {
		return null;
	},
	setPrototypeOf(trapTarget, proto) {
		return false;
	}
});

let targetProto = Object.getPrototypeOf(target);
let proxyProto = Object.getPrototypeOf(proxy);

console.log(targetProto === Object.prototype); // true
console.log(proxyProto === Object.prototype); // false
console.log(proxyProto); // null

// 成功
Object.setPrototypeOf(target, {});
// 抛出错误
Object.setPrototypeOf(proxy, {});


let target = {};
let proxy = new Proxy(target, {
	getPrototypeOf(trapTarget) {
		return Reflect.getPrototypeOf(trapTarget);
	},
	setPrototypeOf(trapTarget, proto) {
		return Reflect.setPrototypeOf(trapTarget, proto);
	}
});

let targetProto = Object.getPrototypeOf(target);
let proxyProto = Object.getPrototypeOf(proxy);

console.log(targetProto === Object.prototype); // true
console.log(proxyProto === Object.prototype); // true

// 成功
Object.setPrototypeOf(target, {});
// 同样成功
Object.setPrototypeOf(proxy, {});

//对象可扩展性的陷阱函数
let target = {};
let proxy = new Proxy(target, {
	isExtensible(trapTarget) {
		return Reflect.isExtensible(trapTarget);
	},
	preventExtensions(trapTarget) {
		return Reflect.preventExtensions(trapTarget);
	}
});

console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true

Object.preventExtensions(proxy);

console.log(Object.isExtensible(target)); // false
console.log(Object.isExtensible(proxy)); // false


let target = {};
let proxy = new Proxy(target, {
	isExtensible(trapTarget) {
		return Reflect.isExtensible(trapTarget);
	},
	preventExtensions(trapTarget) {
		return false
	}
});

console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true

Object.preventExtensions(proxy);

console.log(Object.isExtensible(target)); // true
console.log(Object.isExtensible(proxy)); // true

//属性描述符的陷阱函数
let proxy = new Proxy({}, {
	defineProperty(trapTarget, key, descriptor) {
		return Reflect.defineProperty(trapTarget, key, descriptor);
	},
	getOwnPropertyDescriptor(trapTarget, key) {
		return Reflect.getOwnPropertyDescriptor(trapTarget, key);
	}
});

Object.defineProperty(proxy, "name", {
	value: "proxy"
});

console.log(proxy.name); // "proxy"

let descriptor = Object.getOwnPropertyDescriptor(proxy, "name");

console.log(descriptor.value); // "proxy"

//阻值Object.defineProperty()
let proxy = new Proxy({}, {
	defineProperty(trapTarget, key, descriptor) {

		if (typeof key === "symbol") {
			return false;
		}

		return Reflect.defineProperty(trapTarget, key, descriptor);
	}
});

Object.defineProperty(proxy, "name", {
	value: "proxy"
});

console.log(proxy.name); // "proxy"

let nameSymbol = Symbol("name");

// 抛出错误
Object.defineProperty(proxy, nameSymbol, {
	value: "proxy"
});

//描述符对象的限制
let proxy = new Proxy({}, {
	defineProperty(trapTarget, key, descriptor) {
		console.log(descriptor.value); // "proxy"
		console.log(descriptor.name); // undefined

		return Reflect.defineProperty(trapTarget, key, descriptor);
	}
});
Object.defineProperty(proxy, "name", {
	value: "proxy",
	name: "custom"
});

let proxy = new Proxy({}, {
	getOwnPropertyDescriptor(trapTarget, key) {
		return {
			name: "proxy"
		};
	}
});
// 抛出错误
let descriptor = Object.getOwnPropertyDescriptor(proxy, "name");

//ownKeys陷阱函数
let proxy = new Proxy({}, {
	ownKeys(trapTarget) {
		return Reflect.ownKeys(trapTarget).filter(key => {
			return typeof key !== "string" || key[0] !== "_";
		});
	}
});

let nameSymbol = Symbol("name");

proxy.name = "proxy";
proxy._name = "private";
proxy[nameSymbol] = "symbol";

let names = Object.getOwnPropertyNames(proxy),
	keys = Object.keys(proxy);
symbols = Object.getOwnPropertySymbols(proxy);

console.log(names.length); // 1
console.log(names[0]); // "proxy"

console.log(keys.length); // 1
console.log(keys[0]); // "proxy"

console.log(symbols.length); // 1
console.log(symbols[0]); // "Symbol(name)"

//使用apply与construct陷阱函数的函数代理
let target = function() {
		return 42
	},
	proxy = new Proxy(target, {
		apply: function(trapTarget, thisArg, argumentList) {
			return Reflect.apply(trapTarget, thisArg, argumentList);
		},
		construct: function(trapTarget, argumentList) {
			return Reflect.construct(trapTarget, argumentList);
		}
	});

// 使用了函数的代理，其目标对象会被视为函数
console.log(typeof proxy); // "function"

console.log(proxy()); // 42

var instance = new proxy();
console.log(instance instanceof proxy); // true
console.log(instance instanceof target); // true

//验证函数的参数
// 将所有参数相加
function sum(...values) {
	return values.reduce((previous, current) => previous + current, 0);
}
let sumProxy = new Proxy(sum, {
	apply: function(trapTarget, thisArg, argumentList) {
		argumentList.forEach((arg) => {
			if (typeof arg !== "number") {
				throw new TypeError("All arguments must be numbers.");
			}
		});
		return Reflect.apply(trapTarget, thisArg, argumentList);
	},
	construct: function(trapTarget, argumentList) {
		throw new TypeError("This function can't be called with new.");
	}
});
console.log(sumProxy(1, 2, 3, 4)); // 10
// 抛出错误
console.log(sumProxy(1, "2", 3, 4));
// 同样抛出错误
let result = new sumProxy();

function Numbers(...values) {
	this.values = values;
}
let NumbersProxy = new Proxy(Numbers, {
	apply: function(trapTarget, thisArg, argumentList) {
		throw new TypeError("This function must be called with new.");
	},
	construct: function(trapTarget, argumentList) {
		argumentList.forEach((arg) => {
			if (typeof arg !== "number") {
				throw new TypeError("All arguments must be numbers.");
			}
		});

		return Reflect.construct(trapTarget, argumentList);
	}
});
let instance = new NumbersProxy(1, 2, 3, 4);
console.log(instance.values); // [1,2,3,4]
// 抛出错误
NumbersProxy(1, 2, 3, 4);

//调用构造器而无需使用new
function Numbers(...values) {

	if (typeof new.target === "undefined") {
		throw new TypeError("This function must be called with new.");
	}

	this.values = values;
}

let NumbersProxy = new Proxy(Numbers, {
	apply: function(trapTarget, thisArg, argumentsList) {
		return Reflect.construct(trapTarget, argumentsList);
	}
});

let instance = NumbersProxy(1, 2, 3, 4);
console.log(instance.values); // [1,2,3,4]

//重写抽象基础类的构造器
class AbstractNumbers {
	constructor(...values) {
		if (new.target === AbstractNumbers) {
			throw new TypeError("This function must be inherited from.");
		}

		this.values = values;
	}
}
class Numbers extends AbstractNumbers {}
let instance = new Numbers(1, 2, 3, 4);
console.log(instance.values); // [1,2,3,4]
// 抛出错误
new AbstractNumbers(1, 2, 3, 4);

let AbstractNumbersProxy = new Proxy(AbstractNumbers, {
	construct: function(trapTarget, argumentList) {
		return Reflect.construct(trapTarget, argumentList, function() {});
	}
});

let instance = new AbstractNumbersProxy(1, 2, 3, 4);
console.log(instance.values); // [1,2,3,4]

//可被调用的类构造器
class Person {
	constructor(name) {
		this.name = name;
	}
}

let PersonProxy = new Proxy(Person, {
	apply: function(trapTarget, thisArg, argumentList) {
		return new trapTarget(...argumentList);
	}
});

let me = PersonProxy("Nicholas");
console.log(me.name); // "Nicholas"
console.log(me instanceof Person); // true
console.log(me instanceof PersonProxy); // true

//可撤销的代理
let target = {
	name: "target"
};
let {
	proxy,
	revoke
} = Proxy.revocable(target, {});

console.log(proxy.name); // "target"
revoke();
// 抛出错误
console.log(proxy.name);

//解决数组的问题
//在添加新元素是增加长度属性
//在减少长度属性时移除元素
function toUint32(value) {
	return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
	let numericKey = toUint32(key);
	return String(numericKey) == key && numericKey < (Math.pow(2, 32) - 1);
}

function createMyArray(length = 0) {
	return new Proxy({
		length
	}, {
		set(trapTarget, key, value) {

			let currentLength = Reflect.get(trapTarget, "length");

			// 特殊情况
			if (isArrayIndex(key)) {
				let numericKey = Number(key);

				if (numericKey >= currentLength) {
					Reflect.set(trapTarget, "length", numericKey + 1);
				}
			} else if (key === "length") {

				if (value < currentLength) {
					for (let index = currentLength - 1; index >= value; index--) {
						Reflect.deleteProperty(trapTarget, index);
					}
				}

			}

			// 无论键的类型是什么，都要执行这行代码
			return Reflect.set(trapTarget, key, value);
		}
	});
}

let colors = createMyArray(3);
console.log(colors.length); // 3

colors[0] = "red";
colors[1] = "green";
colors[2] = "blue";
colors[3] = "black";

console.log(colors.length); // 4

colors.length = 2;

console.log(colors.length); // 2
console.log(colors[3]); // undefined
console.log(colors[2]); // undefined
console.log(colors[1]); // "green"
console.log(colors[0]); // "red"

//实现MyArray类
function toUint32(value) {
	return Math.floor(Math.abs(Number(value))) % Math.pow(2, 32);
}

function isArrayIndex(key) {
	let numericKey = toUint32(key);
	return String(numericKey) == key && numericKey < (Math.pow(2, 32) - 1);
}

class MyArray {
	constructor(length = 0) {
		this.length = length;

		return new Proxy(this, {
			set(trapTarget, key, value) {

				let currentLength = Reflect.get(trapTarget, "length");

				// 特殊情况
				if (isArrayIndex(key)) {
					let numericKey = Number(key);

					if (numericKey >= currentLength) {
						Reflect.set(trapTarget, "length", numericKey + 1);
					}
				} else if (key === "length") {

					if (value < currentLength) {
						for (let index = currentLength - 1; index >= value; index--) {
							Reflect.deleteProperty(trapTarget, index);
						}
					}

				}

				// 无论键的类型是什么，都要执行这行代码
				return Reflect.set(trapTarget, key, value);
			}
		});

	}
}


let colors = new MyArray(3);
console.log(colors instanceof MyArray); // true

console.log(colors.length); // 3

colors[0] = "red";
colors[1] = "green";
colors[2] = "blue";
colors[3] = "black";

console.log(colors.length); // 4

colors.length = 2;

console.log(colors.length); // 2
console.log(colors[3]); // undefined
console.log(colors[2]); // undefined
console.log(colors[1]); // "green"
console.log(colors[0]); // "red"

//将代理对象作为原型使用
let target = {};
let newTarget = Object.create(new Proxy(target, {

	// 永远不会被调用
	defineProperty(trapTarget, name, descriptor) {

		// 如果被调用就会引发错误
		return false;
	}
}));

Object.defineProperty(newTarget, "name", {
	value: "newTarget"
});

console.log(newTarget.name); // "newTarget"
console.log(newTarget.hasOwnProperty("name")); // true


//在原型上使用get陷阱函数
let target = {};
let thing = Object.create(new Proxy(target, {
	get(trapTarget, key, receiver) {
		throw new ReferenceError(`${key} doesn't exist`);
	}
}));

thing.name = "thing";

console.log(thing.name); // "thing"

// 抛出错误
let unknown = thing.unknown;


//在原型上使用set陷阱函数
let target = {};
let thing = Object.create(new Proxy(target, {
	set(trapTarget, key, value, receiver) {
		return Reflect.set(trapTarget, key, value, receiver);
	}
}));

console.log(thing.hasOwnProperty("name")); // false

// 触发了 `set` 代理陷阱
thing.name = "thing";

console.log(thing.name); // "thing"
console.log(thing.hasOwnProperty("name")); // true

// 没有触发 `set` 代理陷阱
thing.name = "boo";

console.log(thing.name); // "boo"


//在原型上使用has陷阱函数
let target = {};
let thing = Object.create(new Proxy(target, {
	has(trapTarget, key) {
		return Reflect.has(trapTarget, key);
	}
}));

// 触发了 `has` 代理陷阱
console.log("name" in thing); // false

thing.name = "thing";

// 没有触发 `has` 代理陷阱
console.log("name" in thing); // true


//将代理作为类的原型
function NoSuchProperty() {
	// empty
}

NoSuchProperty.prototype = new Proxy({}, {
	get(trapTarget, key, receiver) {
		throw new ReferenceError(`${key} doesn't exist`);
	}
});

class Square extends NoSuchProperty {
	constructor(length, width) {
		super();
		this.length = length;
		this.width = width;
	}
}

let shape = new Square(2, 6);

let area1 = shape.length * shape.width;
console.log(area1); // 12

// 由于 "wdth" 不存在而抛出了错误
let area2 = shape.length * shape.wdth;


function NoSuchProperty() {
	// empty
}

// 对于将要用作原型的代理，存储对其的一个引用
let proxy = new Proxy({}, {
	get(trapTarget, key, receiver) {
		throw new ReferenceError(`${key} doesn't exist`);
	}
});

NoSuchProperty.prototype = proxy;

class Square extends NoSuchProperty {
	constructor(length, width) {
		super();
		this.length = length;
		this.width = width;
	}
}

let shape = new Square(2, 6);

let shapeProto = Object.getPrototypeOf(shape);

console.log(shapeProto === proxy); // false

let secondLevelProto = Object.getPrototypeOf(shapeProto);

console.log(secondLevelProto === proxy); // true


function NoSuchProperty() {
	// empty
}

NoSuchProperty.prototype = new Proxy({}, {
	get(trapTarget, key, receiver) {
		throw new ReferenceError(`${key} doesn't exist`);
	}
});

class Square extends NoSuchProperty {
	constructor(length, width) {
		super();
		this.length = length;
		this.width = width;
	}

	getArea() {
		return this.length * this.width;
	}
}

let shape = new Square(2, 6);

let area1 = shape.length * shape.width;
console.log(area1); // 12

let area2 = shape.getArea();
console.log(area2); // 12

// 由于 "wdth" 不存在而抛出了错误
let area3 = shape.length * shape.wdth;