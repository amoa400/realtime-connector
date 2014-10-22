var co = require('co');
var thunkify = require('thunkify');

var plus = function(a, b, callback) {
	callback(null, a + b);
}

var minus = function*(a, b) {
	return a - b;
}

co(function*(a, b) {
	var plusRes = yield thunkify(plus)(a, b);
	var minusRes = yield minus(a, b);

	console.log(plusRes);
	console.log(minusRes);

	return '1';
})(10, 8, function(err, res) {
	console.log(err);
	console.log(res);
});

