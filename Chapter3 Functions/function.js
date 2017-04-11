/// Chapter 3: Functions in ECMAScript 6 discusses the various changes to functions. This includes 
///  the arrow function form, default parameters, rest parameters, and more.
//带参数默认值的函数
//ES5
function makeRequest(url, timeout, callback) {
	timeout = timeout || 2000;
	callback = callback || function() {};

	// 函数的剩余部分
}

function makeRequest(url, timeout, callback) {
	timeout = (typeof timeout !== "undefined") ? timeout : 2000;
	callback = (typeof callback !== "undefined") ? callback : function() {};

	// 函数的剩余部分
}
//ES6
function makeRequest(url, timeout = 2000, callback = function() {}) {
	// 函数的剩余部分
}
//参数默认值如何影响 arguments 对象
//在 ES5 的非严格模式下， arguments 对象会反映出具名参数的变化。
function mixArgs(first, second) {
	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
	first = "c";
	second = "d";
	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
}

mixArgs("a", "b"); //true true true true

//在 ES5 的严格模式下，关于 arguments 对象的这种混乱情况被消除了，它不再反映出具名参数的变化
function mixArgs(first, second) {
	"use strict";

	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
	first = "c";
	second = "d"
	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
}

mixArgs("a", "b"); //true true false false

// 然而在使用 ES6 参数默认值的函数中， arguments 对象的表现总是会与 ES5 的严格模式一致，
// 无论此时函数是否明确运行在严格模式下。参数默认值的存在触发了 arguments 对象与具名参数的分离。
// 非严格模式
function mixArgs(first, second = "b") {
	console.log(arguments.length);
	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
	first = "c";
	second = "d"
	console.log(first === arguments[0]);
	console.log(second === arguments[1]);
}

mixArgs("a"); // 1 true false false false

///参数默认值表达式
function getValue() {
	return 5;
}

function add(first, second = getValue()) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 6

// 函数可变
let value = 5;

function getValue() {
	return value++;
}

function add(first, second = getValue()) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 6
console.log(add(1)); // 7

//将前面的参数作为后面参数的默认值
function add(first, second = first) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 2

//将 first 作为参数传递给一个函数来产生 second 参数的值
function getValue(value) {
	return value + 5;
}

function add(first, second = getValue(first)) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 7

//前面的参数不能访问后面的参数
function add(first = second, second) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(undefined, 1)); // 抛出错误


///参数默认值的暂时性死区
//与 let 声明相似，函数每个参数都会创建一个新的标识符绑定，它在初始化之前不允许被访问，否则会抛出
//错误。参数初始化会在函数被调用时进行，无论是给参数传递了一个值、还是使用了参数的默认值。
function getValue(value) {
	return value + 5;
}

function add(first, second = getValue(first)) {
	return first + second;
}
console.log(add(1, 1)); // 2
console.log(add(1)); // 7

// JS 调用 add(1, 1) 可表示为
let first = 1;
let second = 1;

// JS 调用 add(1) 可表示为
let first = 1;
let second = getValue(first);

//反过来会报错
function add(first = second, second) {
	return first + second;
}

console.log(add(1, 1)); // 2
console.log(add(undefined, 1)); // 抛出错误

// JS 调用 add(1, 1) 可表示为
let first = 1;
let second = 1;

// JS 调用 add(1) 可表示为
let first = second;
let second = 1;


///使用不具名参数
//ES5
function pick(object) {
	let result = Object.create(null);
	// 从第二个参数开始处理
	for (let i = 1, len = arguments.length; i < len; i++) {
		result[arguments[i]] = object[arguments[i]];
	}
	return result;
}

let book = {
	title: "Understanding ES6",
	author: "Nicholas C. Zakas",
	year: 2015
};
let bookData = pick(book, "author", "year");

console.log(bookData.author); // "Nicholas C. Zakas"
console.log(bookData.year); // 2015

//ES6 剩余参数
function pick(object, ...keys) {
	let result = Object.create(null);

	for (let i = 0, len = keys.length; i < len; i++) {
		result[keys[i]] = object[keys[i]];
	}

	return result;
}
//函数的 length 属性用于指示具名参数的数量，而剩余参数对其毫无影响

//剩余参数的限制条件
//函数只能有一个剩余参数，并且它必须被放在最后
//剩余参数不能在对象字面量的 setter 属性中使用
// 语法错误：不能在剩余参数后使用具名参数
function pick(object, ...keys, last) {
	let result = Object.create(null);

	for (let i = 0, len = keys.length; i < len; i++) {
		result[keys[i]] = object[keys[i]];
	}

	return result;
}

let object = {
	// 语法错误：不能在 setter 中使用剩余参数
	set name(...value) {
		// 一些操作
	}
};

//arguments 对象总能正确反映被传入函数的参数，而无视剩余参数的使用
function checkArgs(...args) {
	console.log(args.length);
	console.log(arguments.length);
	console.log(args[0], arguments[0]);
	console.log(args[1], arguments[1]);
}

checkArgs("a", "b"); //2 2 a a b b


///函数构造器的增强能力
var add = new Function("first", "second = first",
	"return first + second");

console.log(add(1, 1)); // 2
console.log(add(1)); // 2

var pickFirst = new Function("...args", "return args[0]");
console.log(pickFirst(1, 2)); // 1


///扩展运算符
//ES5
let values = [25, 50, 75, 100]
console.log(Math.max.apply(Math, values)); // 100

//ES6
let values = [25, 50, 75, 100];
// 等价于 console.log(Math.max(25, 50, 75, 100));
console.log(Math.max(...values)); // 100

let values = [-25, -50, -75, -100];
console.log(Math.max(...values, 0)); // 0


///函数的名称属性
function doSomething() {
	// ...
}

var doAnotherThing = function() {
	// ...
};

console.log(doSomething.name); // "doSomething"
console.log(doAnotherThing.name); // "doAnotherThing"

var doSomething = function() {
	// ...
};
console.log(doSomething.bind().name); // "bound doSomething"
console.log((new Function()).name); // "anonymous"
var doSomething = function doSomethingElse() {
	// ...
};

var person = {
	get firstName() {
		return "Nicholas"
	},
	sayName: function() {
		console.log(this.name);
	}
}
console.log(doSomething.name); // "doSomethingElse"
console.log(person.sayName.name); // "sayName"

var descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log(descriptor.get.name); // "get firstName"

///在 ES5 中判断函数如何被调用
function Person(name) {
	if (this instanceof Person) {
		this.name = name; // 使用 new
	} else {
		throw new Error("You must use new with Person.")
	}
}

var person = new Person("Nicholas");
var notAPerson = Person("Nicholas"); // 抛出错误

//此方法并不可靠
var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael"); // 奏效了！

//new.target 元属性
function Person(name) {
	if (typeof new.target !== "undefined") {
		this.name = name; // 使用 new
	} else {
		throw new Error("You must use new with Person.")
	}
}

var person = new Person("Nicholas");
var notAPerson = Person.call(person, "Michael"); // 出错！

//检查 new.target 是否被使用特定构造器进行了调用
function Person(name) {
	if (new.target === Person) {
		this.name = name; // 使用 new
	} else {
		throw new Error("You must use new with Person.")
	}
}

function AnotherPerson(name) {
	Person.call(this, name);
}

var person = new Person("Nicholas");
var anotherPerson = new AnotherPerson("Nicholas"); // 出错！
//在函数之外使用 new.target 会有语法错误。


///块级函数
"use strict";
if (true) {
	// 在 ES5 会抛出语法错误， ES6 则不会
	function doSomething() {
		// ...
	}
}

//ES6  严格模式
"use strict";
if (true) {
	console.log(typeof doSomething); // "function"
	function doSomething() {
		// ...
	}
	doSomething();
}
console.log(typeof doSomething); // "undefined"

"use strict";
if (true) {
	console.log(typeof doSomething); // 抛出错误
	let doSomething = function() {
		// ...
	}
	doSomething();
}
console.log(typeof doSomething);

//非严格模式的块级函数
// ES6 behavior
if (true) {
	console.log(typeof doSomething); // "function"
	function doSomething() {
		// ...
	}
	doSomething();
}
console.log(typeof doSomething); // "function"


////箭头函数
//一个参数
var reflect = value => value;
// 有效等价于：
var reflect = function(value) {
	return value;
};

//多于一个参数
var sum = (num1, num2) => num1 + num2;
// 有效等价于：
var sum = function(num1, num2) {
	return num1 + num2;
};

//没有参数
var getName = () => "Nicholas";
// 有效等价于：
var getName = function() {
	return "Nicholas";
};

//当你想使用更传统的函数体、也就是可能包含多个语句的时候，需要将函数体用一对花括号进行包裹，并明确定义一个返回值
var sum = (num1, num2) => {
	return num1 + num2;
};
// 有效等价于：
var sum = function(num1, num2) {
	return num1 + num2;
};

//空函数
var doNothing = () => {};
// 有效等价于：
var doNothing = function() {};

//若箭头函数想要从函数体内向外返回一个对象字面量，就必须将该字面量包裹在圆括号内
var getTempItem = id => ({
	id: id,
	name: "Temp"
});
// 有效等价于：
var getTempItem = function(id) {
	return {
		id: id,
		name: "Temp"
	};
};


///创建立即调用函数表达式
let person = function(name) {
	return {
		getName: function() {
			return name;
		}
	};
}("Nicholas");
console.log(person.getName()); // "Nicholas"

let person = ((name) => {
	return {
		getName: function() {
			return name;
		}
	};
})("Nicholas");
console.log(person.getName()); // "Nicholas"


///没有 this 绑定
var PageHandler = {
	id: "123456",
	init: function() {
		document.addEventListener("click", function(event) {
			this.doSomething(event.type); // 错误
		}, false);
	},
	doSomething: function(type) {
		console.log("Handling " + type + " for " + this.id);
	}
};

//bind
var PageHandler = {
	id: "123456",
	init: function() {
		document.addEventListener("click", (function(event) {
			this.doSomething(event.type); // 没有错误
		}).bind(this), false);
	},
	doSomething: function(type) {
		console.log("Handling " + type + " for " + this.id);
	}
};

//箭头函数
//箭头函数没有 this 绑定，意味着箭头函数内部的 this 值只能通过查找作用域链来确定。
//如果箭头函数被包含在一个非箭头函数内，那么 this 值就会与该函数的相等；否则， this 值就会是 undefined 。
var PageHandler = {
	id: "123456",
	init: function() {
		document.addEventListener("click",
			event => this.doSomething(event.type), false);
	},
	doSomething: function(type) {
		console.log("Handling " + type + " for " + this.id);
	}
};

//不能new
var MyType = () => {},
	object = new MyType(); // 错误：你不能对箭头函数使用 'new'


///没有 arguments 绑定
//尽管箭头函数没有自己的 arguments 对象，但仍然能访问包含它的函数的 arguments 对象。
function createArrowFunctionReturningFirstArg() {
	return () => arguments[0];
}
var arrowFunction = createArrowFunctionReturningFirstArg(5);
console.log(arrowFunction()); // 5


///识别箭头函数
var comparator = (a, b) => a - b;
console.log(typeof comparator); // "function"
console.log(comparator instanceof Function); // true

var sum = (num1, num2) => num1 + num2;
console.log(sum.call(null, 1, 2)); // 3
console.log(sum.apply(null, [1, 2])); // 3

var boundSum = sum.bind(null, 1, 2);
console.log(boundSum()); // 3


///尾调用优化
//在 ES5 引擎中实现的尾调用，其处理就像其他函数调用一样：一个新的栈帧（ stack frame ）
//被创建并推到调用栈之上，用于表示该次函数调用。这意味着之前每个栈帧都被保留在内存中，当调用栈太大时会出问题
//ES6 在严格模式下力图为特定尾调用减少调用栈的大小（非严格模式的尾调用则保持不变）。
//尾调用优化条件
//尾调用不能引用当前栈帧中的变量（意味着该函数不能是闭包）；
//进行尾调用的函数在尾调用返回结果后不能做额外操作；
//尾调用的结果作为当前函数的返回值。
"use strict";

function doSomething() {
	// 被优化
	return doSomethingElse();
}

"use strict";

function doSomething() {
	// 未被优化：缺少 return
	doSomethingElse();
}

"use strict";

function doSomething() {
	// 未被优化：在返回之后还要执行加法
	return 1 + doSomethingElse();
}

"use strict";

function doSomething() {
	// 未被优化：调用并不在尾部
	var result = doSomethingElse();
	return result;
}

"use strict";

function doSomething() {
	var num = 1,
		func = () => num;
	// 未被优化：此函数是闭包
	return func();
}


//如何控制尾调用优化  （主要在递归函数中）
function factorial(n) {
	if (n <= 1) {
		return 1;
	} else {
		// 未被优化：在返回之后还要执行乘法
		// 如果 n 是一个大数字，那么调用栈的大小会增长，并且可能导致堆栈溢出。
		return n * factorial(n - 1);
	}
}

function factorial(n, p = 1) {
	if (n <= 1) {
		return 1 * p;
	} else {
		let result = n * p;
		// 被优化
		return factorial(n - 1, result);
	}
}
//尾调用优化是你在书写任意递归函数时都需要考虑的因素，因为它能提供显著的性能提升，尤其是被应用到计算复杂度很高的函数时。