//Promises and Asynchronous Programming introduces promises as a new part of the language. Promises were a grassroots effort that eventually 
//took off and gained in popularity due to extensive library support. ECMAScript 6 formalizes promises and makes them available by default.
//事件模型
let button = document.getElementById("my-btn");
button.onclick = function(event) {
	console.log("Clicked");
};
//回调模式
readFile("example.txt", function(err, contents) {
	if (err) {
		throw err;
	}

	console.log(contents);
});
console.log("Hi!");

//回调地狱
method1(function(err, result) {
	if (err) {
		throw err;
	}
	method2(function(err, result) {
		if (err) {
			throw err;
		}
		method3(function(err, result) {
			if (err) {
				throw err;
			}
			method4(function(err, result) {
				if (err) {
					throw err;
				}
				method5(result);
			});
		});
	});
});

//Promise
let promise = readFile("example.txt");

promise.then(function(contents) {
	// 完成
	console.log(contents);
}, function(err) {
	// 拒绝
	console.error(err.message);
});

promise.then(function(contents) {
	// 完成
	console.log(contents);
});

promise.then(null, function(err) {
	// 拒绝
	console.error(err.message);
});

promise.catch(function(err) {
	// 拒绝
	console.error(err.message);
});
// 等同于：
promise.then(null, function(err) {
	// 拒绝
	console.error(err.message);
});

//创建未决的Promise
// Node.js 范例
let fs = require("fs");

function readFile(filename) {
	return new Promise(function(resolve, reject) {
		// 触发异步操作
		fs.readFile(filename, {
			encoding: "utf8"
		}, function(err, contents) {
			// 检查错误
			if (err) {
				reject(err);
				return;
			}
			// 读取成功
			resolve(contents);

		});
	});
}

let promise = readFile("example.txt");
// 同时监听完成与拒绝
promise.then(function(contents) {
	// 完成
	console.log(contents);
}, function(err) {
	// 拒绝
	console.error(err.message);
});

//Promise的执行器会立即执行，遭遇源代码中在其之后的任何代码
let promise = new Promise(function(resolve, reject) {
	console.log("Promise");
	resolve();
});
promise.then(function() {
	console.log("Resolved.");
});
console.log("Hi!");
// Promiselet promise = Promise.resolve(42);

promise.then(function(value) {
	console.log(value); // 42
});
// Hi!
//Resolved

//创建已决的Promise
let promise = Promise.resolve(42);
promise.then(function(value) {
	console.log(value); // 42
});

let promise = Promise.reject(42);
promise.catch(function(value) {
	console.log(value); // 42
});

//非Promise的Thenable
let thenable = {
	then: function(resolve, reject) {
		resolve(42);
	}
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
	console.log(value); // 42
});

//执行器错误
let promise = new Promise(function(resolve, reject) {
	throw new Error("Explosion!");
});
promise.catch(function(error) {
	console.log(error.message); // "Explosion!"
});

let promise = new Promise(function(resolve, reject) {
	try {
		throw new Error("Explosion!");
	} catch (ex) {
		reject(ex);
	}
});
promise.catch(function(error) {
	console.log(error.message); // "Explosion!"
});

//全局的Promise
//Nodejs
let rejected;
process.on("unhandledRejection", function(reason, promise) {
	console.log(reason.message); // "Explosion!"
	console.log(rejected === promise); // true
});
rejected = Promise.reject(new Error("Explosion!"));

let rejected;
process.on("rejectionHandled", function(promise) {
	console.log(rejected === promise); // true
});
rejected = Promise.reject(new Error("Explosion!"));
// 延迟添加拒绝处理函数
setTimeout(function() {
	rejected.catch(function(value) {
		console.log(value.message); // "Explosion!"
	});
}, 1000);

//追踪潜在的未被处理的拒绝
let possiblyUnhandledRejections = new Map();
// 当一个拒绝未被处理，将其添加到 map
process.on("unhandledRejection", function(reason, promise) {
	possiblyUnhandledRejections.set(promise, reason);
});
process.on("rejectionHandled", function(promise) {
	possiblyUnhandledRejections.delete(promise);
});
setInterval(function() {
	possiblyUnhandledRejections.forEach(function(reason, promise) {
		console.log(reason.message ? reason.message : reason);
		// 做点事来处理这些拒绝
		handleRejection(promise, reason);
	});
	possiblyUnhandledRejections.clear();
}, 60000);

//浏览器
let rejected;
window.onunhandledrejection = function(event) {
	console.log(event.type); // "unhandledrejection"
	console.log(event.reason.message); // "Explosion!"
	console.log(rejected === event.promise); // true
};
window.onrejectionhandled = function(event) {
	console.log(event.type); // "rejectionhandled"
	console.log(event.reason.message); // "Explosion!"
	console.log(rejected === event.promise); // true
};
rejected = Promise.reject(new Error("Explosion!"));

//追踪潜在的未被处理的Promise
let possiblyUnhandledRejections = new Map();
// 当一个拒绝未被处理，将其添加到 map
window.onunhandledrejection = function(event) {
	possiblyUnhandledRejections.set(event.promise, event.reason);
};
window.onrejectionhandled = function(event) {
	possiblyUnhandledRejections.delete(event.promise);
};
setInterval(function() {
	possiblyUnhandledRejections.forEach(function(reason, promise) {
		console.log(reason.message ? reason.message : reason);
		// 做点事来处理这些拒绝
		handleRejection(promise, reason);
	});
	possiblyUnhandledRejections.clear();
}, 60000);

//串联Promise
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
p1.then(function(value) {
	console.log(value);
}).then(function() {
	console.log("Finished");
});

//相当于
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = p1.then(function(value) {
	console.log(value);
})
p2.then(function() {
	console.log("Finished");
});

//捕获错误
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
p1.then(function(value) {
	throw new Error("Boom!");
}).catch(function(error) {
	console.log(error.message); // "Boom!"
});

let p1 = new Promise(function(resolve, reject) {
	throw new Error("Explosion!");
});
p1.catch(function(error) {
	console.log(error.message); // "Explosion!"
	throw new Error("Boom!");
}).catch(function(error) {
	console.log(error.message); // "Boom!"
});

//在Promise链中返回值
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
p1.then(function(value) {
	console.log(value); // "42"
	return value + 1;
}).then(function(value) {
	console.log(value); // "43"
});

let p1 = new Promise(function(resolve, reject) {
	reject(42);
});
p1.catch(function(value) {
	// 第一个完成处理函数
	console.log(value); // "42"
	return value + 1;
}).then(function(value) {
	// 第二个完成处理函数
	console.log(value); // "43"
});

//在Promise中返回Promise
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = new Promise(function(resolve, reject) {
	resolve(43);
});
p1.then(function(value) {
	// 第一个完成处理函数
	console.log(value); // 42
	return p2;
}).then(function(value) {
	// 第二个完成处理函数
	console.log(value); // 43
});

//相当于
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = new Promise(function(resolve, reject) {
	resolve(43);
});
let p3 = p1.then(function(value) {
	// 第一个完成处理函数
	console.log(value); // 42
	return p2;
});
p3.then(function(value) {
	// 第二个完成处理函数
	console.log(value); // 43
});

let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = new Promise(function(resolve, reject) {
	reject(43);
});
p1.then(function(value) {
	// 第一个完成处理函数
	console.log(value); // 42
	return p2;
}).catch(function(value) {
	// 拒绝处理函数
	console.log(value); // 43
});

//响应多个Promise
//Promise.all()方法
let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = new Promise(function(resolve, reject) {
	resolve(43);
});
let p3 = new Promise(function(resolve, reject) {
	resolve(44);
});
let p4 = Promise.all([p1, p2, p3]);
p4.then(function(value) {
	console.log(Array.isArray(value)); // true
	console.log(value[0]); // 42
	console.log(value[1]); // 43
	console.log(value[2]); // 44
});

let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = new Promise(function(resolve, reject) {
	reject(43);
});
let p3 = new Promise(function(resolve, reject) {
	resolve(44);
});
let p4 = Promise.all([p1, p2, p3]);
p4.catch(function(value) {
	console.log(Array.isArray(value)) // false
	console.log(value); // 43
});

//Promise.race()方法
let p1 = Promise.resolve(42);
let p2 = new Promise(function(resolve, reject) {
	resolve(43);
});
let p3 = new Promise(function(resolve, reject) {
	resolve(44);
});
let p4 = Promise.race([p1, p2, p3]);
p4.then(function(value) {
	console.log(value); // 42
});

//继承Promise
class MyPromise extends Promise {
	// 使用默认构造器
	success(resolve, reject) {
		return this.then(resolve, reject);
	}
	failure(reject) {
		return this.catch(reject);
	}
}
let promise = new MyPromise(function(resolve, reject) {
	resolve(42);
});
promise.success(function(value) {
	console.log(value); // 42
}).failure(function(value) {
	console.log(value);
});

let p1 = new Promise(function(resolve, reject) {
	resolve(42);
});
let p2 = MyPromise.resolve(p1);
p2.success(function(value) {
	console.log(value); // 42
});
console.log(p2 instanceof MyPromise); // true


///异步任务运行
let fs = require("fs");

function run(taskDef) {
	// 创建迭代器
	let task = taskDef();

	// 启动任务
	let result = task.next();

	// 递归使用函数来进行迭代
	(function step() {
		// 如果还有更多要做的
		if (!result.done) {

			// 决议一个 Promise ，让任务处理变简单
			let promise = Promise.resolve(result.value);
			promise.then(function(value) {
				result = task.next(value);
				step();
			}).catch(function(error) {
				result = task.throw(error);
				step();
			});
		}
	}());
}

// 定义一个函数来配合任务运行器使用
function readFile(filename) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filename, function(err, contents) {
			if (err) {
				reject(err);
			} else {
				resolve(contents);
			}
		});
	});
}

// 运行一个任务
run(function*() {
	let contents = yield readFile("config.json");
	doSomethingWith(contents);
	console.log("Done");
});