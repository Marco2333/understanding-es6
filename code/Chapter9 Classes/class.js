///Introducing JavaScript Classes introduces the first formal concept of classes in JavaScript. 
///Often a point of confusion for those coming from other languages, the addition of class syntax in JavaScript 
///makes the language more approachable to others and more concise for enthusiasts.
//ES5中的仿类解构
function PersonType(name) {
	this.name = name;
}
PersonType.prototype.sayName = function() {
	console.log(this.name);
};
let person = new PersonType("Nicholas");
person.sayName(); // 输出 "Nicholas"
console.log(person instanceof PersonType); // true
console.log(person instanceof Object); // true

//类的声明
class PersonClass {
	// 等价于 PersonType 构造器
	constructor(name) {
			this.name = name;
		}
		// 等价于 PersonType.prototype.sayName
	sayName() {
		console.log(this.name);
	}
}
let person = new PersonClass("Nicholas");
person.sayName(); // 输出 "Nicholas"
console.log(person instanceof PersonClass); // true
console.log(person instanceof Object); // true
console.log(typeof PersonClass); // "function"
console.log(typeof PersonClass.prototype.sayName); // "function"

//未使用类语法的代码
// 直接等价于 PersonClass
let PersonType2 = (function() {
	"use strict";
	const PersonType2 = function(name) {
		// 确认函数被调用时使用了 new
		if (typeof new.target === "undefined") {
			throw new Error("Constructor must be called with new.");
		}
		this.name = name;
	}
	Object.defineProperty(PersonType2.prototype, "sayName", {
		value: function() {
			// 确认函数被调用时没有使用 new
			if (typeof new.target !== "undefined") {
				throw new Error("Method cannot be called with new.");
			}
			console.log(this.name);
		},
		enumerable: false,
		writable: true,
		configurable: true
	});
	return PersonType2;
}());

class Foo {
	constructor() {
		Foo = "bar"; // 执行时抛出错误
	}
}
// 但在类声明之后没问题
Foo = "baz";

//基本的类表达式
let PersonClass = class {
	// 等价于 PersonType 构造器
	constructor(name) {
			this.name = name;
		}
		// 等价于 PersonType.prototype.sayName
	sayName() {
		console.log(this.name);
	}
};
let person = new PersonClass("Nicholas");
person.sayName(); // 输出 "Nicholas"
console.log(person instanceof PersonClass); // true
console.log(person instanceof Object); // true
console.log(typeof PersonClass); // "function"
console.log(typeof PersonClass.prototype.sayName); // "function"

//具名类表达式
let PersonClass = class PersonClass2 {
	// 等价于 PersonType 构造器
	constructor(name) {
			this.name = name;
		}
		// 等价于 PersonType.prototype.sayName
	sayName() {
		console.log(this.name);
	}
};

console.log(typeof PersonClass); // "function"
console.log(typeof PersonClass2); // "undefined"

//未使用类语法的代码
// 直接等价于 PersonClass 具名的类表达式
let PersonClass = (function() {
	"use strict";
	const PersonClass2 = function(name) {

		// 确认函数被调用时使用了 new
		if (typeof new.target === "undefined") {
			throw new Error("Constructor must be called with new.");
		}

		this.name = name;
	}
	Object.defineProperty(PersonClass2.prototype, "sayName", {
		value: function() {

			// 确认函数被调用时没有使用 new
			if (typeof new.target !== "undefined") {
				throw new Error("Method cannot be called with new.");
			}

			console.log(this.name);
		},
		enumerable: false,
		writable: true,
		configurable: true
	});
	return PersonClass2;
}());

//作为一级公民的类
function createObject(classDef) {
	return new classDef();
}
let obj = createObject(class {
	sayHi() {
		console.log("Hi!");
	}
});
obj.sayHi(); // "Hi!"

let person = new class {
	constructor(name) {
		this.name = name;
	}
	sayName() {
		console.log(this.name);
	}

}("Nicholas");
person.sayName(); // "Nicholas"

//访问器属性
class CustomHTMLElement {
	constructor(element) {
		this.element = element;
	}
	get html() {
		return this.element.innerHTML;
	}
	set html(value) {
		this.element.innerHTML = value;
	}
}
var descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, "html");
console.log("get" in descriptor); // true
console.log("set" in descriptor); // true
console.log(descriptor.enumerable); // false

//未使用类语法的代码
//直接等价于上个范例
let CustomHTMLElement = (function() {
	"use strict";
	const CustomHTMLElement = function(element) {
		// 确认函数被调用时使用了 new
		if (typeof new.target === "undefined") {
			throw new Error("Constructor must be called with new.");
		}

		this.element = element;
	}
	Object.defineProperty(CustomHTMLElement.prototype, "html", {
		enumerable: false,
		configurable: true,
		get: function() {
			return this.element.innerHTML;
		},
		set: function(value) {
			this.element.innerHTML = value;
		}
	});
	return CustomHTMLElement;
}());

//需计算的成员名
let methodName = "sayName";
class PersonClass {
	constructor(name) {
		this.name = name;
	}

	[methodName]() {
		console.log(this.name);
	}
}
let me = new PersonClass("Nicholas");
me.sayName(); // "Nicholas"

let propertyName = "html";
class CustomHTMLElement {
	constructor(element) {
		this.element = element;
	}
	get[propertyName]() {
		return this.element.innerHTML;
	}
	set[propertyName](value) {
		this.element.innerHTML = value;
	}
}

//生成器方法
class Collection {
	constructor() {
		this.items = [];
	}

	* [Symbol.iterator]() {
		yield * this.items.values();
	}
}
var collection = new Collection();
collection.items.push(1);
collection.items.push(2);
collection.items.push(3);
for (let x of collection) {
	console.log(x);
}
// 输出：
// 1
// 2
// 3

//静态成员
//ES5
function PersonType(name) {
	this.name = name;
}
// 静态方法
PersonType.create = function(name) {
	return new PersonType(name);
};
// 实例方法
PersonType.prototype.sayName = function() {
	console.log(this.name);
};
var person = PersonType.create("Nicholas");

//ES6
class PersonClass {
	// 等价于 PersonType 构造器
	constructor(name) {
			this.name = name;
		}
		// 等价于 PersonType.prototype.sayName
	sayName() {
			console.log(this.name);
		}
		// 等价于 PersonType.create
	static create(name) {
		return new PersonClass(name);
	}
}
let person = PersonClass.create("Nicholas");

//使用派生类进行继承
//ES5
function Rectangle(length, width) {
	this.length = length;
	this.width = width;
}
Rectangle.prototype.getArea = function() {
	return this.length * this.width;
};

function Square(length) {
	Rectangle.call(this, length, length);
}
Square.prototype = Object.create(Rectangle.prototype, {
	constructor: {
		value: Square,
		enumerable: true,
		writable: true,
		configurable: true
	}
});
var square = new Square(3);
console.log(square.getArea()); // 9
console.log(square instanceof Square); // true
console.log(square instanceof Rectangle); // true

//ES6
class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}

	getArea() {
		return this.length * this.width;
	}
}
class Square extends Rectangle {
	constructor(length) {
		// 与 Rectangle.call(this, length, length) 相同
		super(length, length);
	}
}
var square = new Square(3);
console.log(square.getArea()); // 9
console.log(square instanceof Square); // true
console.log(square instanceof Rectangle); // true

class Square extends Rectangle {
	// 没有构造器
}
// 等价于：
class Square extends Rectangle {
	constructor(...args) {
		super(...args);
	}
}

//屏蔽类方法
class Square extends Rectangle {
	constructor(length) {
		super(length, length);
	}

	// 重写并屏蔽 Rectangle.prototype.getArea()
	getArea() {
		return this.length * this.length;
	}
}

class Square extends Rectangle {
	constructor(length) {
		super(length, length);
	}

	// 重写、屏蔽并调用了 Rectangle.prototype.getArea()
	getArea() {
		return super.getArea();
	}
}

//继承静态成员
class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}

	getArea() {
		return this.length * this.width;
	}

	static create(length, width) {
		return new Rectangle(length, width);
	}
}
class Square extends Rectangle {
	constructor(length) {

		// 与 Rectangle.call(this, length, length) 相同
		super(length, length);
	}
}
var rect = Square.create(3, 4);
console.log(rect instanceof Rectangle); // true
console.log(rect.getArea()); // 12
console.log(rect instanceof Square); // false

//从表达式中派生类
function Rectangle(length, width) {
	this.length = length;
	this.width = width;
}
Rectangle.prototype.getArea = function() {
	return this.length * this.width;
};
class Square extends Rectangle {
	constructor(length) {
		super(length, length);
	}
}
var x = new Square(3);
console.log(x.getArea()); // 9
console.log(x instanceof Rectangle); // true

function Rectangle(length, width) {
	this.length = length;
	this.width = width;
}
Rectangle.prototype.getArea = function() {
	return this.length * this.width;
};

function getBase() {
	return Rectangle;
}
class Square extends getBase() {
	constructor(length) {
		super(length, length);
	}
}
var x = new Square(3);
console.log(x.getArea()); // 9
console.log(x instanceof Rectangle); // true


let SerializableMixin = {
	serialize() {
		return JSON.stringify(this);
	}
};
let AreaMixin = {
	getArea() {
		return this.length * this.width;
	}
};

function mixin(...mixins) {
	var base = function() {};
	Object.assign(base.prototype, ...mixins);
	return base;
}
class Square extends mixin(AreaMixin, SerializableMixin) {
	constructor(length) {
		super();
		this.length = length;
		this.width = length;
	}
}
var x = new Square(3);
console.log(x.getArea()); // 9
console.log(x.serialize()); // "{"length":3,"width":3}"

//继承内置对象
// 内置数组的行为
var colors = [];
colors[0] = "red";
console.log(colors.length); // 1
colors.length = 0;
console.log(colors[0]); // undefined

// 在 ES5 中尝试继承数组
function MyArray() {
	Array.apply(this, arguments);
}
MyArray.prototype = Object.create(Array.prototype, {
	constructor: {
		value: MyArray,
		writable: true,
		configurable: true,
		enumerable: true
	}
});
var colors = new MyArray();
colors[0] = "red";
console.log(colors.length); // 0
colors.length = 0;
console.log(colors[0]); // "red"

class MyArray extends Array {
	// 空代码块
}
var colors = new MyArray();
colors[0] = "red";
console.log(colors.length); // 1
colors.length = 0;
console.log(colors[0]); // undefined

//Symbol.species 属性
class MyArray extends Array {
	// 空代码块
}
let items = new MyArray(1, 2, 3, 4),
	subitems = items.slice(1, 3);
console.log(items instanceof MyArray); // true
console.log(subitems instanceof MyArray); // true

// 几个内置类型使用 species 的方式类似于此
class MyClass {
	static get[Symbol.species]() {
		return this;
	}

	constructor(value) {
		this.value = value;
	}

	clone() {
		return new this.constructor[Symbol.species](this.value);
	}
}

class MyClass {
	static get[Symbol.species]() {
		return this;
	}

	constructor(value) {
		this.value = value;
	}

	clone() {
		return new this.constructor[Symbol.species](this.value);
	}
}
class MyDerivedClass1 extends MyClass {
	// 空代码块
}
class MyDerivedClass2 extends MyClass {
	static get[Symbol.species]() {
		return MyClass;
	}
}
let instance1 = new MyDerivedClass1("foo"),
	clone1 = instance1.clone(),
	instance2 = new MyDerivedClass2("bar"),
	clone2 = instance2.clone();
console.log(clone1 instanceof MyClass); // true
console.log(clone1 instanceof MyDerivedClass1); // true
console.log(clone2 instanceof MyClass); // true
console.log(clone2 instanceof MyDerivedClass2); // false

class MyArray extends Array {
	static get[Symbol.species]() {
		return Array;
	}
}
let items = new MyArray(1, 2, 3, 4),
	subitems = items.slice(1, 3);
console.log(items instanceof MyArray); // true
console.log(subitems instanceof Array); // true
console.log(subitems instanceof MyArray); // false

//在类构造器中使用new.target
class Rectangle {
	constructor(length, width) {
		console.log(new.target === Rectangle);
		this.length = length;
		this.width = width;
	}
}
// new.target 就是 Rectangle
var obj = new Rectangle(3, 4); // 输出 true

class Rectangle {
	constructor(length, width) {
		console.log(new.target === Rectangle);
		this.length = length;
		this.width = width;
	}
}
class Square extends Rectangle {
	constructor(length) {
		super(length, length)
	}
}
// new.target 就是 Square
var obj = new Square(3); // 输出 false

//静态的基类
class Shape {
	constructor() {
		if (new.target === Shape) {
			throw new Error("This class cannot be instantiated directly.")
		}
	}
}
class Rectangle extends Shape {
	constructor(length, width) {
		super();
		this.length = length;
		this.width = width;
	}
}
var x = new Shape(); // 抛出错误
var y = new Rectangle(3, 4); // 没有错误
console.log(y instanceof Shape); // true