///Chapter 13: Encapsulating Code with Modules details the official module format for JavaScript. 
///The intent is that these modules can replace the numerous ad-hoc module definition formats that have appeared over the years.

//基本的导出
// 导出数据
export var color = "red";
export let name = "Nicholas";
export const magicNumber = 7;
// 导出函数
export function sum(num1, num2) {
	return num1 + num1;
}
// 导出类
export class Rectangle {
	constructor(length, width) {
		this.length = length;
		this.width = width;
	}
}
// 此函数为模块私有
function subtract(num1, num2) {
	return num1 - num2;
}
// 定义一个函数……
function multiply(num1, num2) {
	return num1 * num2;
}
// ……稍后将其导出
export {
	multiply
};

//基本的导入
import {
	identifier1,
	identifier2
} from "./example.js";

// 单个导入
import {
	sum
} from "./example.js";
console.log(sum(1, 2)); // 3
sum = 1; // 出错

// 多个导入
import {
	sum,
	multiply,
	magicNumber
} from "./example.js";
console.log(sum(1, magicNumber)); // 8
console.log(multiply(1, 2)); // 2

// 完全导入
import * as example from "./example.js";
console.log(example.sum(1,
	example.magicNumber)); // 8
console.log(example.multiply(1, 2)); // 2

//导入绑定的一个微妙怪异点
export var name = "Nicholas";
export function setName(newName) {
	name = newName;
}

import {
	name,
	setName
} from "./example.js";
console.log(name); // "Nicholas"
setName("Greg");
console.log(name); // "Greg"

//重命名导入与导出
function sum(num1, num2) {
	return num1 + num2;
}
export {
	sum as add
};

import {
	add as sum
} from "./example.js";
console.log(typeof add); // "undefined"
console.log(sum(1, 2)); // 3

//模块的默认值
export default function(num1, num2) {
	return num1 + num2;
}

function sum(num1, num2) {
	return num1 + num2;
}
export default sum;

function sum(num1, num2) {
	return num1 + num2;
}
export {
	sum as
	default
};

// 导入默认值
import sum from "./example.js";
console.log(sum(1, 2)); // 3

export let color = "red";
export default function(num1, num2) {
	return num1 + num2;
}

import sum, {
	color
} from "./example.js";
console.log(sum(1, 2)); // 3
console.log(color); // "red"

// 等价于上个例子
import {
	default as sum,
	color
} from "example";
console.log(sum(1, 2)); // 3
console.log(color); // "red"

//绑定的再导出
import {
	sum
} from "./example.js";
export {
	sum
}
export {
	sum
}
from "./example.js";
export {
	sum as add
}
from "./example.js";
export * from "./example.js";

//无绑定的导入
import "./example.js";


///在Web浏览器中使用模块
<!-- load a module JavaScript file -->
<script type="module" src="module.js"></script>

// <!-- include a module inline -->
// <script type = "module">
// 	import {
// 		sum
// 	} from "./example.js";
// let result = sum(1, 2); </script>

//Web浏览器中的模块加载次序
// <!-- this will execute first -->
// <script type="module" src="module1.js"></script>

// <!-- this will execute second -->
// <script type="module">
// import { sum } from "./example.js";
// let result = sum(1, 2);
// </script>

// <!-- this will execute third -->
// <script type="module" src="module2.js"></script>

//浏览器模块说明符方案
// 从 https://www.example.com/modules/example1.js 导入
import {
	first
} from "./example1.js";
// 从 from https://www.example.com/example2.js 导入
import {
	second
} from "../example2.js";
// 从 from https://www.example.com/example3.js 导入
import {
	third
} from "/example3.js";
// 从 from https://www2.example.com/example4.js 导入
import {
	fourth
} from "https://www2.example.com/example4.js";

// 无效：没有以 / 、 ./ 或 ../ 开始
import {
	first
} from "example.js";
// 无效：没有以 / 、 ./ 或 ../ 开始
import {
	second
} from "example/index.js";