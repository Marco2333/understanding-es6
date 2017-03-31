/// Chapter 1: How Block Bindings Work talks about let and const, the block-level replacement for var.
/// 块级绑定

///var 声明与变量提升  hoisting
function getValue(condition) {
	if (condition) {
		var value = "blue";
		// 其他代码
		return value;
	} else {
		// value 在此处可访问，值为 undefined
		return null;
	}
	// value 在此处可访问，值为 undefined
}

// JS 引擎在后台对 getValue 函数进行了调整
function getValue(condition) {
	var value;
	if (condition) {
		value = "blue";
		// 其他代码
		return value;
	} else {
		return null;
	}
}

///块级声明 （让所声明的变量在指定块的作用域外无法被访问）

//let 声明
function getValue(condition) {
	if (condition) {
		let value = "blue";
		// 其他代码
		return value;
	} else {
		// value 在此处不可用
		return null;
	}
	// value 在此处不可用
}

//禁止重复声明
var count = 30;
let count = 40; // 语法错误

//在嵌套的作用域内使用 let 声明一个同名的新变量，则不会抛出错误
var count = 30;
if (condition) {
	//在 if 代码块内部，这个新变量会屏蔽全局的 count 变量，从而在局部阻止对于后者的访问
	let count = 40; // 不会抛出错误
	// 其他代码
}

let b = 1; {
	let b = 1; // 不会抛出错误
}


///常量声明
//所有的 const 变量都需要在声明时进行初始化，并且不能改变
// 有效的常量
const maxItems = 30;
// 语法错误：未进行初始化
const name;

if (condition) {
	const maxItems = 5;
	// 其他代码
}
// maxItems 在此处无法访问

//使用 const 声明对象
//const 声明会阻止对于变量绑定与变量自身值的修改，这意味着const声明并不会阻止对变量成员的修改。
//const 阻止的是对于变量绑定的修改，而不阻止对成员值的修改
const person = {
	name: "Nicholas"
};
// 工作正常
person.name = "Greg";
// 抛出错误
person = {
	name: "Greg"
};


///暂时性死区
//使用 let 或 const 声明的变量，在达到声明处之前都是无法访问的，试图访问会导致一个引用错误，
//即使在通常是安全的操作时（例如使用 typeof 运算符），也是如此。示例如下：
if (condition) {
	console.log(typeof value); // 引用错误
	let value = "blue";
}
//当 JS 引擎检视接下来的代码块并发现变量声明时，它会在面对 var 的情况下将声明提升到
//函数或全局作用域的顶部, 而面对let 或const 时会将声明放在暂时性死区内。 
//任何在暂时性死区内访问变量的企图都会导致“ 运行时” 错误（ runtime error）。 
//只有执行到变量的声明语句时， 该变量才会从暂时性死区内被移除并可以安全使用。
console.log(typeof value); // "undefined"

if (condition) {
	let value = "blue";
}


///循环中的块级绑定
for (var i = 0; i < 10; i++) {
	process(items[i]);
}
// i 在此处仍然可被访问
console.log(i); // 10

for (let i = 0; i < 10; i++) {
	process(items[i]);
}
console.log(i); // i 在此处不可访问，抛出错误


///循环内的函数
//let 声明通过有效模仿上例中 IIFE 的作用而简化了循环。在每次迭代中，
//都会创建一个新的同名变量并对其进行初始化。
var funcs = [];
for (let i = 0; i < 10; i++) {
	funcs.push(function() {
		console.log(i);
	});
}
funcs.forEach(function(func) {
	func(); // 从 0 到 9 依次输出
});
//在循环中let 声明每次都创建了一个新的 i 变量， 因此在循环内部创建的函数获得了各自的 i 副本， 
//而每个 i 副本的值都在每次循环迭代声明变量的时候被确定了

//每次循环，一个新的 key 变量绑定就被创建，因此每个函数都能够拥有它自身的 key 变量副本
var funcs = [],
	object = {
		a: true,
		b: true,
		c: true
	};
for (let key in object) {
	funcs.push(function() {
		console.log(key);
	});
}
funcs.forEach(function(func) {
	func(); // 依次输出 "a"、 "b"、 "c"
});

//需要重点了解的是： let 声明在循环内部的行为是在规范中特别定义的，而与不提升变量声明的特征没有必然联系。
//事实上，在早期 let 的实现中并没有这种行为，它是后来才添加的。


///循环内的常量声明
var funcs = [];
// 在一次迭代后抛出错误
for (const i = 0; i < 10; i++) {
	funcs.push(function() {
		console.log(i);
	});
}

//另一方面， const 变量在 for-in 或 for-of 循环中使用时，与 let 变量效果相同。因此下面代码不会导致出错：
var funcs = [],
	object = {
		a: true,
		b: true,
		c: true
	};

// 不会导致错误
for (const key in object) {
	funcs.push(function() {
		console.log(key); // key 的值在循环内不能被更改
	});
}

funcs.forEach(function(func) {
	func(); // 依次输出 "a"、 "b"、 "c"
});
// const 能够在 for-in 与 for-of 循环内工作，是因为循环为每次迭代创建了一个新的变量绑定，
// 而不是试图去修改已绑定的变量的值


///全局块级绑定
// 当在全局作用域上使用 var 时，它会创建一个新的全局变量，并成为全局对象（ 在浏览器中是 window） 
// 一个属性。 这意味着使用 var 可能会无意覆盖一个已有的全局属性
// 在浏览器中
var RegExp = "Hello!";
console.log(window.RegExp); // "Hello!"

var ncz = "Hi!";
console.log(window.ncz); // "Hi!"

// 全局作用域上使用 let 或 const，虽然在全局作用域上会创建新的绑定，但不会有任何属性被添加到全局对象上。 
// 这也就意味着你不能使用 let 或 const 来覆盖一个全局变量， 你只能将其屏蔽。
// 在浏览器中
let RegExp = "Hello!";
console.log(RegExp); // "Hello!"
console.log(window.RegExp === RegExp); // false

const ncz = "Hi!";
console.log(ncz); // "Hi!"
console.log("ncz" in window); // false

// ES6 的发展阶段，被广泛认可的变量声明方式是：默认情况下应当使用 let 而不是 var 。
// 对于多数 JS 开发者来说， let 的行为方式正是 var 本应有的方式，因此直接用 let 替代 var 更符合逻辑。

// 然而，随着更多的开发者迁移到 ES6 上，一种替代方案变得更为流行，那就是在默认情况下使用
// const 、并且只在知道变量值需要被更改的情况下才使用 let 。理论依据是大部分变量在初始化
// 之后都不应当被修改，因为预期外的改动是 bug 的源头之一。

//块级绑定当前的最佳实践就是：在默认情况下使用 const ，而只在你知道变量值需要被更改的情况下才使用 let 。
//这在代码中能确保基本层次的不可变性，有助于防止某些类型的错误。