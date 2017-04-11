//Chapter 3: Functions in ECMAScript 6 discusses the various changes to functions. 
//This includes the arrow function form, default parameters, rest parameters, and more.
//扩展的对象功能

//对象字面量语法的扩展
//属性初始化器的速记法
//ES5
function createPerson(name, age) {
	return {
		name: name,
		age: age
	}
}
//ES6
function createPerson(name, age) {
	return {
		name,
		age
	}
}

//方法简写
//ES5
var person = {
	name: 'Marco',
	getName: function() {
		console.log(this.name);
	}
};
//ES6
var person = {
	name: 'Marco',
	getName() {
		console.log(this.name);
	}
};


//需计算属性名
//ES5
var person = {},
	lastName = "last name";

person["first name"] = "Nicholas";
person[lastName] = "Zakas";
console.log(person["first name"]); // "Nicholas"
console.log(person[lastName]); // "Zakas"

var person = {
	"first name": "Nicholas"
};
console.log(person["first name"]); // "Nicholas"

//ES6
var lastName = "last name";
var person = {
	"first name": "Nicholas",
	[lastName]: "Zakas"
};
console.log(person["first name"]); // "Nicholas"
console.log(person[lastName]); // "Zakas"

var suffix = " name";
var person = {
	["first" + suffix]: "Nicholas",
	["last" + suffix]: "Zakas"
};
console.log(person["first name"]); // "Nicholas"
console.log(person["last name"]); // "Zakas"


///新的方法
//Object.is() 方法
console.log(+0 == -0); // true
console.log(+0 === -0); // true
console.log(Object.is(+0, -0)); // false

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Object.is(NaN, NaN)); // true

console.log(5 == 5); // true
console.log(5 == "5"); // true
console.log(5 === 5); // true
console.log(5 === "5"); // false
console.log(Object.is(5, 5)); // true
console.log(Object.is(5, "5")); // false

//Object.assign() 方法
//js库
function mixin(receiver, supplier) {
	Object.keys(supplier).forEach(function(key) {
		receiver[key] = supplier[key];
	});
	return receiver;
}
//ES6
var receiver = {};

Object.assign(receiver, {
	type: "js",
	name: "file.js"
}, {
	type: "css"
});
console.log(receiver.type); // "css"
console.log(receiver.name); // "file.js"

//需要记住 Object.assign() 并未在接收者上创建访问器属性，即使供应者拥有访问器属性。
//由于 Object.assign() 使用赋值运算符，供应者的访问器属性就会转变成接收者的数据属性
var receiver = {},
	supplier = {
		get name() {
			return "file.js"
		}
	};

Object.assign(receiver, supplier);

var descriptor = Object.getOwnPropertyDescriptor(receiver, "name");

console.log(descriptor.value); // "file.js"
console.log(descriptor.get); // undefined

//重复的对象字面量属性
//ES5
"use strict";
var person = {
	name: "Nicholas",
	name: "Greg" // 在 ES5 严格模式中是语法错误
};
//ES6
"use strict";
var person = {
	name: "Nicholas",
	name: "Greg" // 在 ES6 严格模式中不会出错
};
console.log(person.name); // "Greg"

//自有属性的枚举顺序
//1.自有属性枚举时基本顺序如下：
//1.所有的数字类型键，按升序排列。
//2.所有的字符串类型键，按被添加到对象的顺序排列。
//3.所有的符号类型（详见第六章）键，也按添加顺序排列。
var obj = {
	a: 1,
	0: 1,
	c: 1,
	2: 1,
	b: 1,
	1: 1
};
obj.d = 1;
console.log(Object.getOwnPropertyNames(obj).join("")); // "012acbd"


///更强大的原型
//修改对象的原型
let person = {
	getGreeting() {
		return "Hello";
	}
};
let dog = {
	getGreeting() {
		return "Woof";
	}
};

// 原型为 person
let friend = Object.create(person);
console.log(friend.getGreeting()); // "Hello"
console.log(Object.getPrototypeOf(friend) === person); // true

// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof"
console.log(Object.getPrototypeOf(friend) === dog); // true

//使用 super 引用的简单原型访问
//super是指向当前对象的原型的一个指针 Object.getPrototypeOf(this)
let person = {
	getGreeting() {
		return "Hello";
	}
};
let dog = {
	getGreeting() {
		return "Woof";
	}
};
let friend = {
	getGreeting() {
		return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
	}
};
// 将原型设置为 person
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(Object.getPrototypeOf(friend) === person); // true
// 将原型设置为 dog
Object.setPrototypeOf(friend, dog);
console.log(friend.getGreeting()); // "Woof, hi!"
console.log(Object.getPrototypeOf(friend) === dog); // true

//使用super
let friend = {
	getGreeting() {
		// 这相当于上个例子中的：
		// Object.getPrototypeOf(this).getGreeting.call(this)
		return super.getGreeting() + ", hi!";
	}
};

//你能使用 super 引用来调用对象原型上的任何方法，只要这个引用是位于简写的方法之内。
//试图在方法简写之外的情况使用 super 会导致语法错误
let friend = {
	getGreeting: function() {
		// 语法错误
		return super.getGreeting() + ", hi!";
	}
};

//当使用多级继承时， super 引用就是非常强大的，因为这种情况下 Object.getPrototypeOf() 不再适用于所有场景
let person = {
	getGreeting() {
		return "Hello";
	}
};

// 原型为 person
let friend = {
	getGreeting() {
		return Object.getPrototypeOf(this).getGreeting.call(this) + ", hi!";
	}
};
Object.setPrototypeOf(friend, person);
// 原型为 friend
let relative = Object.create(friend);
console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(relative.getGreeting()); // error!     //riend.getGreeting().call() 调用就会导致进程开始反复进行递归调用，直到发生堆栈错误

//使用super
let person = {
	getGreeting() {
		return "Hello";
	}
};
// 原型为 person
let friend = {
	getGreeting() {
		return super.getGreeting() + ", hi!";
	}
};
Object.setPrototypeOf(friend, person);

// 原型为 friend
let relative = Object.create(friend);
console.log(person.getGreeting()); // "Hello"
console.log(friend.getGreeting()); // "Hello, hi!"
console.log(relative.getGreeting()); // "Hello, hi!"

//正式的“方法”定义
//方法是一个拥有 [[HomeObject]] 内部属性的函数，此内部属性指向该方法所属的对象
let person = {
	// 方法
	getGreeting() {
		return "Hello";
	}
};
// 并非方法
function shareGreeting() {
	return "Hi!";
}

//任何对 super 的引用都会使用 [[HomeObject]] 属性来判断要做什么。第一步是在 [[HomeObject]] 
//上调用 Object.getPrototypeOf() 来获取对原型的引用；接下来，在该原型上查找同名函数；最后，创建 this 绑定并调用该方法。
let person = {
	getGreeting() {
		return "Hello";
	}
};

// 原型为 person
let friend = {
	getGreeting() {
		return super.getGreeting() + ", hi!";
	}
};
Object.setPrototypeOf(friend, person);
console.log(friend.getGreeting()); // "Hello, hi!"
//此时 friend.getGreeting() 的[[HomeObject]] 值是 friend， 并且 friend 的原型是 person， 
//因此 super.getGreeting() 就等价于 person.getGreeting.call(this)。