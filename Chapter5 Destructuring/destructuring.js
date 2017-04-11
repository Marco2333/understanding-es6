///Chapter 5: Destructuring for Easier Data Access introduces object and array destructuring,
///which allow you to decompose objects and arrays using a concise syntax.
///对象解构
let node = {
	type: "Identifier",
	name: "foo"
};
let {
	type,
	name
} = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
//当使用解构来配合 var 、 let 或 const 来声明变量时，必须提供初始化器（即等号右边的值）。

//解构赋值
let node = {
		type: "Identifier",
		name: "foo"
	},
	type = "Literal",
	name = 5;
// 使用解构来分配不同的值
({
	type,
	name
} = node);
console.log(type); // "Identifier"
console.log(name); // "foo"

//解构赋值表达式的值为表达式右侧（在 = 之后）的值
let node = {
		type: "Identifier",
		name: "foo"
	},
	type = "Literal",
	name = 5;

function outputInfo(value) {
	console.log(value === node); // true
}
outputInfo({
	type,
	name
} = node);
console.log(type); // "Identifier"
console.log(name); // "foo"

//当解构赋值表达式的右侧（ = 后面的表达式）的计算结果为 null 或 undefined 时，
//会抛出错误。因为任何读取 null 或 undefined 的企图都会导致“运行时”错误（ runtime error ）。
//默认值
let node = {
	type: "Identifier",
	name: "foo"
};
let {
	type,
	name,
	value
} = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
console.log(value); // undefined

let node = {
	type: "Identifier",
	name: "foo"
};
let {
	type,
	name,
	value = true
} = node;
console.log(type); // "Identifier"
console.log(name); // "foo"
console.log(value); // true

//赋值给不同的本地变量名
let node = {
	type: "Identifier",
	name: "foo"
};
let {
	type: localType,
	name: localName
} = node;
console.log(localType); // "Identifier"
console.log(localName); // "foo"

let node = {
	type: "Identifier"
};
let {
	type: localType,
	name: localName = "bar"
} = node;
console.log(localType); // "Identifier"
console.log(localName); // "bar"

//嵌套的对象解构
let node = {
	type: "Identifier",
	name: "foo",
	loc: {
		start: {
			line: 1,
			column: 1
		},
		end: {
			line: 1,
			column: 4
		}
	}
};
let {
	loc: {
		start
	}
} = node;
console.log(start.line); // 1
console.log(start.column); // 1

let node = {
	type: "Identifier",
	name: "foo",
	loc: {
		start: {
			line: 1,
			column: 1
		},
		end: {
			line: 1,
			column: 4
		}
	}
};
// 提取 node.loc.start
let {
	loc: {
		start: localStart
	}
} = node;
console.log(localStart.line); // 1
console.log(localStart.column); // 1


///数组解构
//数组解构时，解构作用在数组内部的位置上，而不是作用在对象的具名属性上
let colors = ["red", "green", "blue"];
let [firstColor, secondColor] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"

let colors = ["red", "green", "blue"];
let [, , thirdColor] = colors;
console.log(thirdColor); // "blue"

//解构赋值
//你可以在赋值表达式中使用数组解构，但是与对象解构不同，不必将表达式包含在圆括号内
let colors = ["red", "green", "blue"],
	firstColor = "black",
	secondColor = "purple";
[firstColor, secondColor] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"

//交换两个变量的值
let a = 1,
	b = 2;
[a, b] = [b, a];

//默认值
let colors = ["red"];
let [firstColor, secondColor = "green"] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"

//嵌套的解构
let colors = ["red", ["green", "lightgreen"], "blue"];
// 随后
let [firstColor, [secondColor]] = colors;
console.log(firstColor); // "red"
console.log(secondColor); // "green"

//剩余项
let colors = ["red", "green", "blue"];
let [firstColor, ...restColors] = colors;
console.log(firstColor); // "red"
console.log(restColors.length); // 2
console.log(restColors[0]); // "green"
console.log(restColors[1]); // "blue"

//克隆数组
// 在 ES5 中克隆数组
var colors = ["red", "green", "blue"];
var clonedColors = colors.concat();
console.log(clonedColors); //"[red,green,blue]"

// 在 ES6 中克隆数组
let colors = ["red", "green", "blue"];
let [...clonedColors] = colors;
console.log(clonedColors); //"[red,green,blue]"


///混合解构
let node = {
	type: "Identifier",
	name: "foo",
	loc: {
		start: {
			line: 1,
			column: 1
		},
		end: {
			line: 1,
			column: 4
		}
	},
	range: [0, 3]
};

let {
	loc: {
		start
	},
	range: [startIndex]
} = node;
console.log(start.line); // 1
console.log(start.column); // 1
console.log(startIndex); // 0


///参数解构
//ES5
// options 上的属性表示附加参数
function setCookie(name, value, options) {
	options = options || {};
	let secure = options.secure,
		path = options.path,
		domain = options.domain,
		expires = options.expires;
	// 设置 cookie 的代码
}
// 第三个参数映射到 options
setCookie("type", "js", {
	secure: true,
	expires: 60000
});

//ES6
//参数解构提供了更清楚地标明函数期望输入的替代方案
function setCookie(name, value, {
	secure,
	path,
	domain,
	expires
}) {
	// 设置 cookie 的代码
}
setCookie("type", "js", {
	secure: true,
	expires: 60000
});

//解构的参数是必须的
// 出错！
setCookie("type", "js");

let {
	secure,
	path,
	domain,
	expires
} = options; //在赋值右侧的值为 null 或 undefined 时，解构会抛出错误

function setCookie(name, value, {
	secure,
	path,
	domain,
	expires
} = {}) {
	// ...
}

//解构参数的默认值
function setCookie(name, value, {
	secure = false,
	path = "/",
	domain = "example.com",
	expires = new Date(Date.now() + 360000000)
} = {}) {
	// ...
}