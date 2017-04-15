///Sets and Maps details the new collection types of Set, WeakSet, Map, and WeakMap. These types expand on the 
///usefulness of arrays by adding semantics, de-duping, and memory management designed specifically for JavaScript.
//ES5中的Set和Map
let set = Object.create(null);
set.foo = true;
// 检查属性的存在性
if (set.foo) {
	// 一些操作
}

let map = Object.create(null);
map.foo = "bar";
// 提取一个值
let value = map.foo;
console.log(value); // "bar"

//变通方法的问题
let map = Object.create(null);
map[5] = "foo";
console.log(map["5"]); // "foo"

let map = Object.create(null),
	key1 = {},
	key2 = {};
map[key1] = "foo";
console.log(map[key2]); // "foo"


///Set
let set = new Set();
set.add(5);
set.add("5");
console.log(set.size); // 2

let set = new Set(),
	key1 = {},
	key2 = {};
set.add(key1);
set.add(key2);
console.log(set.size); // 2

let set = new Set();
set.add(5);
set.add("5");
console.log(set.has(5)); // true
console.log(set.has(6)); // false

let set = new Set();
set.add(5);
set.add("5");
console.log(set.has(5)); // true
set.delete(5);
console.log(set.has(5)); // false
console.log(set.size); // 1
set.clear();
console.log(set.has("5")); // false
console.log(set.size); // 0

let set = new Set([1, 2]);
set.forEach(function(value, key, ownerSet) {
	console.log(key + " " + value);
	console.log(ownerSet === set);
}); //1 1 true 2 2 true

//指定this
let set = new Set([1, 2]);
let processor = {
	output(value) {
		console.log(value);
	},
	process(dataSet) {
		dataSet.forEach(function(value) {
			this.output(value);
		}, this);
	}
};
processor.process(set);

let set = new Set([1, 2]);
let processor = {
	output(value) {
		console.log(value);
	},
	process(dataSet) {
		dataSet.forEach((value) => this.output(value));
	}
};
processor.process(set);

//Set转换为数组
let set = new Set([1, 2, 3, 3, 3, 4, 5]),
	array = [...set];
console.log(array); // [1,2,3,4,5]

function eliminateDuplicates(items) {
	return [...new Set(items)];
}
let numbers = [1, 2, 3, 3, 3, 4, 5],
	noDuplicates = eliminateDuplicates(numbers);
console.log(noDuplicates); // [1,2,3,4,5]

//WeakSet
let set = new Set(),
	key = {};
set.add(key);
console.log(set.size); // 1
// 取消原始引用
key = null;
console.log(set.size); // 1
// 重新获得原始引用
key = [...set][0];

let set = new WeakSet(),
	key = {};
// 将对象加入 set
set.add(key);
console.log(set.has(key)); // true
set.delete(key);
console.log(set.has(key)); // false

let key1 = {},
	key2 = {},
	set = new WeakSet([key1, key2]);
console.log(set.has(key1)); // true
console.log(set.has(key2)); // true

let set = new WeakSet(),
	key = {};
// 将对象加入 set
set.add(key);
console.log(set.has(key)); // true
// 移除对于键的最后一个强引用，同时从 Weak Set 中移除
key = null;


///Map
let map = new Map();
map.set("title", "Understanding ES6");
map.set("year", 2016);
console.log(map.get("title")); // "Understanding ES6"
console.log(map.get("year")); // 2016

let map = new Map(),
	key1 = {},
	key2 = {};
map.set(key1, 5);
map.set(key2, 42);
console.log(map.get(key1)); // 5
console.log(map.get(key2)); // 42

let map = new Map();
map.set("name", "Nicholas");
map.set("age", 25);
console.log(map.size); // 2
console.log(map.has("name")); // true
console.log(map.get("name")); // "Nicholas"
console.log(map.has("age")); // true
console.log(map.get("age")); // 25
map.delete("name");
console.log(map.has("name")); // false
console.log(map.get("name")); // undefined
console.log(map.size); // 1
map.clear();
console.log(map.has("name")); // false
console.log(map.get("name")); // undefined
console.log(map.has("age")); // false
console.log(map.get("age")); // undefined
console.log(map.size); // 0

//Map的初始化
let map = new Map([
	["name", "Nicholas"],
	["age", 25]
]);
console.log(map.has("name")); // true
console.log(map.get("name")); // "Nicholas"
console.log(map.has("age")); // true
console.log(map.get("age")); // 25
console.log(map.size); // 2

let map = new Map([
	["name", "Nicholas"],
	["age", 25]
]);
map.forEach(function(value, key, ownerMap) {
	console.log(key + " " + value);
	console.log(ownerMap === map);
});

//Weak Map
let map = new WeakMap(),
	element = document.querySelector(".element");
map.set(element, "Original");
let value = map.get(element);
console.log(value); // "Original"
// 移除元素
element.parentNode.removeChild(element);
element = null;
// 该 Weak Map 在此处为空

let key1 = {},
	key2 = {},
	map = new WeakMap([
		[key1, "Hello"],
		[key2, 42]
	]);
console.log(map.has(key1)); // true
console.log(map.get(key1)); // "Hello"
console.log(map.has(key2)); // true
console.log(map.get(key2)); // 42

let map = new WeakMap(),
	element = document.querySelector(".element");
map.set(element, "Original");
console.log(map.has(element)); // true
console.log(map.get(element)); // "Original"
map.delete(element);
console.log(map.has(element)); // false
console.log(map.get(element)); // undefined

//对象的私有数据
//ES5
function Person(name) {
	this._name = name;
}
Person.prototype.getName = function() {
	return this._name;
};

var Person = (function() {
	var privateData = {},
		privateId = 0;

	function Person(name) {
		Object.defineProperty(this, "_id", {
			value: privateId++
		});

		privateData[this._id] = {
			name: name
		};
	}
	Person.prototype.getName = function() {
		return privateData[this._id].name;
	};
	return Person;
}());

//ES6
let Person = (function() {
	let privateData = new WeakMap();

	function Person(name) {
		privateData.set(this, {
			name: name
		});
	}
	Person.prototype.getName = function() {
		return privateData.get(this).name;
	};
	return Person;
}());