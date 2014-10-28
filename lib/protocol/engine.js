// requires
var engine = require('engine.io');
var config = require('../../config.json');

exports.init = function(realtime) {
	var server = engine.listen(config.engine.port);
	
	// 新连接
	server.on('connection', function(conn) {
		// 添加到上层服务器中
		realtime.addConn('engine', conn, function(err, res) {
			// 收到消息
			conn.on('message', function(message) {
				// TODO DELETE
				// 模仿移动端的不稳定性
				//if (parseInt(Math.random() * 10) < 5) return;

				message = JSON.parse(message);

				switch (message.cmd) {
					case 'subscribe':
						res.onSubscribe(message);
						break;
					case 'unsubscribe':
						res.onUnsubscribe(message);
						break;
					case 'publish':
						res.onPublish(message);
						break;
					case 'pingreq':
						res.onPingreq(message);
						break;
					case 'puback':
						res.onPuback(message);
						break;
					default:
						// do nothing
				}
			});

			// 收到错误
			conn.on('error', res.onError.bind(res));

			// 关闭连接
			conn.on('close', res.onDisconnect.bind(res));
		});
	});
}
