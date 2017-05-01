/// Chapter 2: Strings and Regular Expressions covers additional functionality for string 
/// manipulation and inspection as well as the introduction of template strings.

// 在 ES5 中，所有字符串操作都基于 16 位码元，这表示在处理包含代理对的 UTF-16 字符时会出现预期外的结果
var text = "𠮷";
console.log(text.length); // 2
console.log(/^.$/.test(text)); // false
console.log(text.charAt(0)); // ""
console.log(text.charAt(1)); // ""
console.log(text.charCodeAt(0)); // 55362
console.log(text.charCodeAt(1)); // 57271

/// codePointAt
var text = "𠮷a";

console.log(text.charCodeAt(0)); // 55362
console.log(text.charCodeAt(1)); // 57271
console.log(text.charCodeAt(2)); // 97

console.log(text.codePointAt(0)); // 134071  返回完整代码点
console.log(text.codePointAt(1)); // 57271
console.log(text.codePointAt(2)); // 97

//判断字符包含了一个还是两个码元
function is32Bit(c) {
	return c.codePointAt(0) > 0xFFFF;
}
console.log(is32Bit("𠮷")); // true
console.log(is32Bit("a")); // false


///String.fromCodePoint() 用给定的代码点来产生包含单个字符的字符串
console.log(String.fromCodePoint(134071)); // "𠮷"


///normalize
//当比较字符串时，它们必须被标准化为同一种形式
var normalized = values.map(function(text) {
	return text.normalize();
});
normalized.sort(function(first, second) {
	if (first < second) {
		return -1;
	} else if (first === second) {
		return 0;
	} else {
		return 1;
	}
});

values.sort(function(first, second) {
	var firstNormalized = first.normalize(),
		secondNormalized = second.normalize();

	if (firstNormalized < secondNormalized) {
		return -1;
	} else if (firstNormalized === secondNormalized) {
		return 0;
	} else {
		return 1;
	}
});

values.sort(function(first, second) {
	var firstNormalized = first.normalize("NFD"),
		secondNormalized = second.normalize("NFD");

	if (firstNormalized < secondNormalized) {
		return -1;
	} else if (firstNormalized === secondNormalized) {
		return 0;
	} else {
		return 1;
	}
});

'\u01D1' === '\u004F\u030C' //false
'\u01D1'.length; // 1       
'\u004F\u030C'.length; // 2

'\u01D1'.normalize() === '\u004F\u030C'.normalize() // true


///正则表达式 u 标志
//当一个正则表达式设置了 u 标志时，它的工作模式将切换到针对字符，而不是针对码元
var text = "𠮷";
console.log(text.length); // 2
console.log(/^.$/.test(text)); // false
console.log(/^.$/u.test(text)); // true

//计算代码点数量
function codePointLength(text) {
	var result = text.match(/[\s\S]/gu);
	return result ? result.length : 0;
}
console.log(codePointLength("abc")); // 3
console.log(codePointLength("𠮷bc")); // 3

//判断是否支持 u 标志
function hasRegExpU() {
	try {
		var pattern = new RegExp(".", "u");
		return true;
	} catch (ex) {
		return false;
	}
}


///字符串的其他改动
var msg = "Hello world!";

console.log(msg.startsWith("Hello")); // true
console.log(msg.endsWith("!")); // true
console.log(msg.includes("o")); // true

console.log(msg.startsWith("o")); // false
console.log(msg.endsWith("world!")); // true
console.log(msg.includes("x")); // false

console.log(msg.startsWith("o", 4)); // true
console.log(msg.endsWith("o", 8)); // true
console.log(msg.includes("o", 8)); // false
//如果向 startsWith() 、 endsWith() 或 includes() 方法传入了正则表达式而不是字符串，会抛出错误。
//这与 indexOf() 以及 lastIndexOf() 方法的表现形成了反差，它们会将正则表达式转换为字符串并搜索它。

//repeat
console.log("x".repeat(3)); // "xxx"
console.log("hello".repeat(2)); // "hellohello"
console.log("abc".repeat(4)); // "abcabcabcabc"
// indent 使用了一定数量的空格
var indent = " ".repeat(4),
	indentLevel = 0;
// 每当你增加缩进
var newIndent = indent.repeat(++indentLevel);


///正则表达式的其他改动
//y标志
var text = "hello1 hello2 hello3",
	pattern = /hello\d\s?/,
	result = pattern.exec(text),
	globalPattern = /hello\d\s?/g,
	globalResult = globalPattern.exec(text),
	stickyPattern = /hello\d\s?/y,
	stickyResult = stickyPattern.exec(text);

console.log(result[0]); // "hello1 "
console.log(globalResult[0]); // "hello1 "
console.log(stickyResult[0]); // "hello1 "

pattern.lastIndex = 1;
globalPattern.lastIndex = 1;
stickyPattern.lastIndex = 1;

result = pattern.exec(text);
globalResult = globalPattern.exec(text);
stickyResult = stickyPattern.exec(text);

console.log(result[0]); // "hello1 "
console.log(globalResult[0]); // "hello2 "
console.log(stickyResult[0]); // Uncaught TypeError: Cannot read property '0' of null

//一旦匹配操作成功，粘连标志就会将匹配结果之后的那个字符的索引值保存在 lastIndex 中；
//若匹配未成功，那么 lastIndex 的值将重置为0，全局标志的行为与其相同。
var text = "hello1 hello2 hello3",
	pattern = /hello\d\s?/,
	result = pattern.exec(text),
	globalPattern = /hello\d\s?/g,
	globalResult = globalPattern.exec(text),
	stickyPattern = /hello\d\s?/y,
	stickyResult = stickyPattern.exec(text);

console.log(result[0]); // "hello1 "
console.log(globalResult[0]); // "hello1 "
console.log(stickyResult[0]); // "hello1 "

console.log(pattern.lastIndex); // 0
console.log(globalPattern.lastIndex); // 7
console.log(stickyPattern.lastIndex); // 7

result = pattern.exec(text);
globalResult = globalPattern.exec(text);
stickyResult = stickyPattern.exec(text);

console.log(result[0]); // "hello1 "
console.log(globalResult[0]); // "hello2 "
console.log(stickyResult[0]); // "hello2 "

console.log(pattern.lastIndex); // 0
console.log(globalPattern.lastIndex); // 14
console.log(stickyPattern.lastIndex); // 14

// 1. 只有调用正则表达式对象上的方法（ 例如 exec() 与 test() 方法）， lastIndex 属性才会生效。 
// 而将正则表达式作为参数传递给字符串上的方法（ 例如 match()）， 并不会体现粘连特性。
// 2. 当使用 ^ 字符来匹配字符串的起始处时， 粘连的正则表达式只会匹配字符串的起始处（ 或者在多行模式
// 下匹配行首）。 当 lastIndex 为 0 时， ^ 不会让粘连的正则表达式与非粘连的有任何区别； 而当 lastIndex 
// 在单行模式下不对应整个字符串起始处， 或者当它在多行模式下不对应行首时， 粘连的正则表达式永远不会匹配成功。

//是否支持
function hasRegExpY() {
	try {
		var pattern = new RegExp(".", "y");
		return true;
	} catch (ex) {
		return false;
	}
}


///复制正则表达式
var re1 = /ab/i,
	re2 = new RegExp(re1);

var re1 = /ab/i,
	// ES5 中会抛出错误, ES6 中可用
	re2 = new RegExp(re1, "g");


///获取flags属性
//ES5
function getFlags(re) {
	var text = re.toString();
	return text.substring(text.lastIndexOf("/") + 1, text.length);
}
// toString() 的输出为 "/ab/g"
var re = /ab/g;
console.log(getFlags(re)); // "g"

//ES6
var re = /ab/g;
console.log(re.source); // "ab"
console.log(re.flags); // "g"


///模板字面量
//多行字符串
//ES5
var message = [
	"Multiline ",
	"string"
].join("\n");

let message = "Multiline \n" +
	"string";
//ES6
let message = `Multiline
string`;
console.log(message); // "Multiline
//  string"

let html = `
<div>
    <h1>Title</h1>
</div>`.trim();

//制造替换位
//替换位允许你将任何有效的 JS 表达式嵌入到模板字面量中，并将其结果输出为字符串的一部分。
let name = "Nicholas",
	message = `Hello, ${name}.`;
console.log(message); // "Hello, Nicholas."
//模板字面量能访问到作用域中任意的可访问变量。试图使用未定义的变量会抛出错误，无论是严格模式还是非严格模式。

let count = 10,
	price = 0.25,
	message = `${count} items cost $${(count * price).toFixed(2)}.`;
console.log(message); // "10 items cost $2.50."


///标签化模板
function passthru(literals, ...substitutions) {
	let result = "";
	// 仅使用 substitution 的元素数量来进行循环
	for (let i = 0; i < substitutions.length; i++) {
		result += literals[i];
		result += substitutions[i];
	}
	// 添加最后一个字面量
	result += literals[literals.length - 1];
	return result;
}

let count = 10,
	price = 0.25,
	message = passthru `${count} items cost $${(count * price).toFixed(2)}.`;

console.log(message); // "10 items cost $2.50."

//使用模板字面量中的原始值
let message1 = `Multiline\nstring`,
	message2 = String.raw `Multiline\nstring`;

console.log(message1); // "Multiline
//  string"
console.log(message2); // "Multiline\\nstring"


function raw(literals, ...substitutions) {
	let result = "";
	// 仅使用 substitution 的元素数量来进行循环
	for (let i = 0; i < substitutions.length; i++) {
		result += literals.raw[i]; // 改为使用原始值
		result += substitutions[i];
	}
	// 添加最后一个字面量
	result += literals.raw[literals.length - 1];
	return result;
}

let message = raw `Multiline\nstring`;

console.log(message); // "Multiline\\nstring"
console.log(message.length); // 17