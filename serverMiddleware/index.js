// serverMiddleware/logger.js
const logger = require('./logger');

// 使用 logger 记录日志
export default function (req, res, next) {
  logger.info('Request received', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.on('finish', () => {
    // 记录响应状态码
    logger.info('Response sent', { statusCode: res.statusCode });
  });

  next();
}
