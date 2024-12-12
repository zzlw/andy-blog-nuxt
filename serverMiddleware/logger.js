// npm install winston

const winston = require('winston');

// 获取环境变量
const isProduction = process.env.NODE_ENV === 'production';
const logDirectory = 'logs';  // 日志存储目录

// 确保日志目录存在
const fs = require('fs');
const path = require('path');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const transports = [
    // 文件输出：保存应用日志到文件
    new winston.transports.File({
        filename: path.join(logDirectory, 'app.log'),
        format: winston.format.combine(
          winston.format.timestamp(),  // 添加时间戳
          winston.format.json()        // 输出为 JSON 格式
        ),
        level: 'info',
      }),
  ];

  if (!isProduction) {
    transports.push(
      // 控制台输出，生产环境加颜色，开发环境详细日志
    new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),  // 控制台输出日志上色
          winston.format.printf(({ timestamp, level, message, stack }) => {
            return `${timestamp} ${level}: ${message} ${stack || ''}`;  // 自定义控制台输出格式
          })
        ),
        level: 'debug', // 根据环境设置日志级别
      }),
    )
  }

// 创建日志记录器
const logger = winston.createLogger({ transports });

// 示例日志记录
logger.info('Application started');
logger.warn('This is a warning');
logger.error('This is an error log');
logger.debug('This is a debug message');  // 仅在开发环境下会输出

module.exports = logger;
