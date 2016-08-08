const log4js = require('log4js');
const fs = require('fs');
const path = require('path');

const loggerhelper = {
  objConfig: {},
  logDebug: null,
  logInfo: null,
  logWarn: null,
  logErr: null,
  // 判断日志目录是否存在，不存在时创建日志目录    
  checkAndCreateDir: function (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },
  init: function () {
    // 加载配置文件
    this.objConfig = JSON.parse(fs.readFileSync('log4js.json', 'utf8'));
    let objConfig = this.objConfig;

    // 检查配置文件所需的目录是否存在，不存在时创建  
    if (objConfig.appenders) {
      let baseDir = objConfig['customBaseDir'];
      let defaultAtt = objConfig['customDefaultAtt'];

      for (let i = 0, j = objConfig.appenders.length; i < j; i++) {
        let item = objConfig.appenders[i];
        if (item['type'] == 'console')
          continue;

        if (defaultAtt != null) {
          for (let att in defaultAtt) {
            if (item[att] == null)
              item[att] = defaultAtt[att];
          }
        }
        if (baseDir != null) {
          if (item['filename'] == null)
            item['filename'] = baseDir;
          else
            item['filename'] = baseDir + item['filename'];
        }
        let fileName = item['filename'];
        if (fileName == null)
          continue;
        let pattern = item['pattern'];
        if (pattern != null) {
          fileName += pattern;
        }
        let category = item['category'];
        if (!path.isAbsolute(fileName)) {
          fileName = path.resolve(fileName);
        }
        let basePath = path.resolve('');
        let dir = path.dirname(fileName);
        let relative = path.relative(basePath, dir);
        let dirList = relative.split(path.sep);
        for (let i = 0, j = dirList.length; i < j; i++) {
          let dirPath = ''
          for (let d = 0; d <= i; d++) {
            dirPath += dirList[d] + '/';
          }
          dirPath = path.resolve(dirPath);
          this.checkAndCreateDir(dirPath);
        }
      }
    }

    // 目录创建完毕，才加载配置，不然会出异常  
    log4js.configure(objConfig);

    this.logDebug = log4js.getLogger('debugs');
    this.logInfo = log4js.getLogger('infos') || log4js.getLogger();
    this.logWarn = log4js.getLogger('warns');
    this.logErr = log4js.getLogger('errors');
  },
  trace: function (msg) {
    if (this.logInfo) {
      this.logInfo.trace(msg);
    }
  },
  debug: function (msg) {
    if (this.logInfo) {
      this.logInfo.debug(msg);
    }
    if (this.logDebug) {
      this.logDebug.debug(msg);
    }
  },
  info: function (msg) {
    if (this.logInfo) {
      this.logInfo.info(msg);
    }
  },
  warn: function (msg) {
    if (this.logInfo) {
      this.logInfo.warn(msg);
    }
    if (this.logWarn) {
      this.logWarn.warn(msg);
    }
  },
  error: function (msg) {
    if (this.logInfo) {
      this.logInfo.error(msg);
    }
    if (this.logErr) {
      this.logErr.error(msg);
    }
  },
  fatal: function (msg) {
    if (this.logInfo) {
      this.logInfo.fatal(msg);
    }
  }
};
loggerhelper.init();

module.exports = loggerhelper;