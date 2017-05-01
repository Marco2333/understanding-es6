///Symbols and Symbol Properties introduces the concept of symbols, a new way to define properties. 
///Symbols are a new primitive type that can be used to obscure (but not hide) object properties and methods.
//创建符号值
let firstName = Symbol()
let person = {};
person[firstName] = "Marcohan";
console.log(person[firstName]); // MarcoHan
//由于符号值是基本类型的值，因此调用 new Symbol() 将会抛出错误

//接受参数可以用于调试
let firstName = Symbol("first name");
let person = {};
person[firstName] = "Nicholas";
console.log("first name" in person); // false
console.log(person[firstName]); // "Nicholas"
console.log(firstName); // "Symbol(first name)"

//使用符号值
let firstName = Symbol("first name");
// 使用一个需计算字面量属性
let person = {
	[firstName]: "Nicholas"
};
// 让该属性变为只读
Object.defineProperty(person, firstName, {
	writable: false
});
let lastName = Symbol("last name");
Object.defineProperties(person, {
	[lastName]: {
		value: "Zakas",
		writable: false
	}
});

console.log(person[firstName]); // "Nicholas"
console.log(person[lastName]); // "Zakas"

//共享符号值
let uid = Symbol.for("uid");
let object = {
	[uid]: "12345"
};
console.log(object[uid]); // "12345"
console.log(uid); // "Symbol(uid)"
let uid2 = Symbol.for("uid");
console.log(uid === uid2); // true
console.log(object[uid2]); // "12345"
console.log(uid2); // "Symbol(uid)"

//查找全局符号注册表中对应符号的键值
let uid = Symbol.for("uid");
console.log(Symbol.keyFor(uid)); // "uid"
let uid2 = Symbol.for("uid");
console.log(Symbol.keyFor(uid2)); // "uid"
let uid3 = Symbol("uid");
console.log(Symbol.keyFor(uid3)); // undefined

//符号的转换
//符号值不能转换为字符串或数值型；符号值在逻辑运算时会被认为等价于true
let uid = Symbol.for("uid"),
	desc = String(uid);
console.log(desc); // "Symbol(uid)"

let uid = Symbol.for("uid"),
	desc = uid + ""; // 引发错误！

let uid = Symbol.for("uid"),
	sum = uid / 1; // 引发错误！

//检索符号属性
let uid = Symbol.for("uid");
let object = {
	[uid]: "12345"
};
let symbols = Object.getOwnPropertySymbols(object);
console.log(symbols.length); // 1
console.log(symbols[0]); // "Symbol(uid)"
console.log(object[symbols[0]]); // "12345"

///
//使用知名符号暴露内部方法
//重写知名符号所定义的方法，会把一个普通对象改变成奇异对象，因为它改变了一些默认的内部行为。
//这并不会对你的代码造成实际影响，它只是改变了规范所描述的对象特征。
//Symbol.hasInstance属性
obj instanceof Array;
//等价于：
Array[Symbol.hasInstance](obj);

//任意对象都不会被判断为该函数的一个实例
function MyObject() {
	// ...
}
Object.defineProperty(MyObject, Symbol.hasInstance, {
	value: function(v) {
		return false;
	}
});
let obj = new MyObject();
console.log(obj instanceof MyObject); // false

//基于条件判断一个值是否应该被判断为某个类的实例
function SpecialNumber() {
	// empty
}
Object.defineProperty(SpecialNumber, Symbol.hasInstance, {
	value: function(v) {
		return (v instanceof Number) && (v >= 1 && v <= 100);
	}
});
let two = new Number(2),
	zero = new Number(0);
console.log(two instanceof SpecialNumber); // true
console.log(zero instanceof SpecialNumber); // false

//Symbol.isConcatSpreadable
let colors1 = ["red", "green"],
	colors2 = colors1.concat(["blue", "black"]);
console.log(colors2.length); // 4
console.log(colors2); // ["red","green","blue","black"]

//非数组的参数
let colors1 = ["red", "green"],
	colors2 = colors1.concat(["blue", "black"], "brown");
console.log(colors2.length); // 5
console.log(colors2); // ["red","green","blue","black","brown"]

let collection = {
	0: "Hello",
	1: "world",
	length: 2,
	[Symbol.isConcatSpreadable]: true
};
let messages = ["Hi"].concat(collection);
console.log(messages.length); // 3
console.log(messages); // ["hi","Hello","world"]

//Symbol.match 、 Symbol.replace 、 Symbol.search 与 Symbol.split
// 有效等价于 /^.{10}$/
let hasLengthOf10 = {
	[Symbol.match]: function(value) {
		return value.length === 10 ? [value.substring(0, 10)] : null;
	},
	[Symbol.replace]: function(value, replacement) {
		return value.length === 10 ?
			replacement + value.substring(10) : value;
	},
	[Symbol.search]: function(value) {
		return value.length === 10 ? 0 : -1;
	},
	[Symbol.split]: function(value) {
		return value.length === 10 ? ["", ""] : [value];
	}
};

let message1 = "Hello world", // 11 characters
	message2 = "Hello John"; // 10 characters

let match1 = message1.match(hasLengthOf10),
	match2 = message2.match(hasLengthOf10);
console.log(match1); // null
console.log(match2); // ["Hello John"]

let replace1 = message1.replace(hasLengthOf10, "Howdy!"),
	replace2 = message2.replace(hasLengthOf10, "Howdy!");
console.log(replace1); // "Hello world"
console.log(replace2); // "Howdy!"

let search1 = message1.search(hasLengthOf10),
	search2 = message2.search(hasLengthOf10);
console.log(search1); // -1
console.log(search2); // 0

let split1 = message1.split(hasLengthOf10),
	split2 = message2.split(hasLengthOf10);
console.log(split1); // ["Hello world"]
console.log(split2); // ["", ""]

//Symbol.toPrimitive
function Temperature(degrees) {
	this.degrees = degrees;
}
Temperature.prototype[Symbol.toPrimitive] = function(hint) {
	switch (hint) {
		case "string":
			return this.degrees + "\u00b0"; // 温度符号
		case "number":
			return this.degrees;
		case "default":
			return this.degrees + " degrees";
	}
};

let freezing = new Temperature(32);
console.log(freezing + "!"); // "32 degrees!"
console.log(freezing / 2); // 16
console.log(String(freezing)); // "32°"

//Symbol.toStringTag
function Person(name) {
	this.name = name;
}
Person.prototype[Symbol.toStringTag] = "Person";

let me = new Person("Nicholas");
console.log(me.toString()); // "[object Person]"
console.log(Object.prototype.toString.call(me)); // "[object Person]"

function Person(name) {
	this.name = name;
}
Person.prototype[Symbol.toStringTag] = "Person";
Person.prototype.toString = function() {
	return this.name;
};

let me = new Person("Nicholas");
console.log(me.toString()); // "Nicholas"
console.log(Object.prototype.toString.call(me)); // "[object Person]"

//改变原生对象的字符串标签
Array.prototype[Symbol.toStringTag] = "Magic";
let values = [];
console.log(Object.prototype.toString.call(values)); // "[object Magic]"

//Symbol.unscopables
// 默认内置在 ES6 中
Array.prototype[Symbol.unscopables] = Object.assign(Object.create(null), {
	copyWithin: true,
	entries: true,
	fill: true,
	find: true,
	findIndex: true,
	keys: true,
	values: true
});