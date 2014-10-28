/*
	send:
		connack
		suback
		unsuback
		puback
		pingresp
		publish
*/

// requires
// ...

// 连接
var Connection = module.exports = function(protocol, origin, server) {
	// 常量
	this.server = server;
	this.protocol = protocol;
	this.origin = origin;
	this.token = (protocol === 'engine') ? origin.request._query.token : '';
	this.pingTimeoutNum = 60000;

	// 变量
	this.id = this._getId();
	this.status = 'open';
	this.pingTimeout = setTimeout(this.onDisconnect.bind(this), this.pingTimeoutNum);
}

// 发布消息
Connection.prototype.publish = function(topic, message) {
	this._send({
		cmd: 'publish',
		id: message.id,
		user: message.user,
		topic: message.topic,
		content: message.content
	});
}

// 接收订阅
Connection.prototype.onSubscribe = function(message) {
	this._ack('suback', message.id);

	var self = this;
	this._isReceived(this.token, message.id, function(err, received) {
		if (err) {
			return;
		}
		if (received) return;
		self._setReceived(self.token, message.id);
		self._enqueue({
			token: self.token,
			cmd: 'subscribe',
			topic: message.topic
		});
	});
}

// 接收取消订阅
Connection.prototype.onUnsubscribe = function(message) {
	this._ack('unsuback', message.id);

	var self = this;
	this._isReceived(this.token, message.id, function(err, received) {
		if (err) {
			return;
		}
		if (received) return;
		self._setReceived(self.token, message.id);
		self._enqueue({
			token: self.token,
			cmd: 'unsubscribe',
			topic: message.topic
		});
	});
}

// 接收消息
Connection.prototype.onPublish = function(message) {
	this._ack('puback', message.id);

	var self = this;
	this._isReceived(this.token, message.id, function(err, received) {
		if (err) {
			return;
		}
		if (received) return;
		self._setReceived(self.token, message.id);
		self._enqueue({
			token: self.token,
			cmd: 'publish',
			topic: message.topic,
			content: message.content
		});
	});
}

// 心跳探测
Connection.prototype.onPingreq = function(message) {
	this._ack('pingresp', message.id);

	clearTimeout(this.pingTimeout);
	this.pingTimeout = setTimeout(this.onDisconnect.bind(this), this.pingTimeoutNum);
}

// 接收消息确认
Connection.prototype.onPuback = function(message) {
	// TODO
	// 消费标记
}

// 断开连接
Connection.prototype.onDisconnect = function() {
	if (this.status === 'closed') return;

	this.status = 'closed';
	this.server.conns[this.id] = null;
	this.server.connsCount--;
	this.server = null;
	this.received = null;
	clearTimeout(this.pingTimeout);

	if (this.protocol === 'engine') {
		this.origin.close();
		this.origin = null;
	} else {
		// TODO mqtt
	}
}

// 错误
Connection.prototype.onError = function() {
	// TODO
	// 记录日志...
}

// =======================================================================================================

// 回应请求
Connection.prototype._ack = function(cmd, id) {
	this._send({
		cmd: cmd,
		messageId: id,
	});
}

// 发送消息给客户端
Connection.prototype._send = function(message) {
	if (this.protocol === 'engine') {
		this.origin.send(JSON.stringify(message));
	}
}

// 发送消息给逻辑层
Connection.prototype._enqueue = function(message) {
	// TODO
	console.log(message);
}

// 获取随机编号
Connection.prototype._getId = function() {
	var id = '';
	for (var i = 0; i < 16; i++) {
		id += String.fromCharCode(65 + parseInt(Math.random() * 26));
	}
	return id;
}

// 检测是否收到消息
Connection.prototype._isReceived = function(token, id, callback) {
	// TODO
	callback(null, false);
}

// 设置消息已收到
Connection.prototype._setReceived = function(token, id) {
	// TODO
	// ...
}


