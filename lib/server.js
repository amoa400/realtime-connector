// requires
var engine = require('./protocol/engine.js');
var config = require('../config.json');
var Connection = require('./connection.js');

// 服务器
var Server = function() {
	// 变量
	this.conns = {};
	this.connsCount = 0;

	// 根据不同协议监听端口
	engine.init(this);
};

// 添加新连接
Server.prototype.addConn = function(origin, protocol, callback) {
	// 新连接
	var conn = new Connection(origin, protocol, this);

	// TODO 连接确认
	conn._ack('connack');

	// 加入结构体
	this.conns[conn.id] = conn;
	this.connsCount++;

	// 回调
	callback(null, conn);
}

// 导出
var server = module.exports = new Server();





