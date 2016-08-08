(function (global, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    if (typeof jQuery === 'undefined') {
      throw 'LoginManager requires jQuery to be loaded first';
    }
    global.LoginManager = factory(jQuery);
  }
}(this, function ($) {
  var o = {
    domain: '{{MAIN_DOMAIN}}',
    origin: '{{USER_ORIGIN}}',
    ptlogin: '{{PTLOGIN_URL}}'
  };

  //{{ 给老子打包清空
  o.domain = 'localhost';
  o.origin = 'https://user-dev.36b.me';
  o.ptlogin = 'http://localhost:15310/ptlogin';
  // 清空到此 }}//

  document.domain = o.domain;

  var LoginManager = {
    // 用户信息
    userInfo: null,

    /**
     * 获取cookie
     * @param  {string} key 键
     * @return {string}     值
     */
    getCookie: function (key) {
      var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
      if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },

    /**
     * 设置cookie
     * @param {srting} key      键
     * @param {string} value    值
     * @param {number} days     天
     */
    setCookie: function (key, value, days) {
      var days = days || 30;
      var exp = new Date();
      exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = key + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';domain=' + o.domain + ';path=/';
    },

    /**
     * 删除cookie
     * @param  {string} key 键
     */
    delCookie: function (key) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(key);
      if (cval != null) {
        document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString() + ';domain=' + o.domain;
      }
    },

    /**
     * 获取url参数
     * @param  {string} key 参数名
     * @return {string}     参数值
     */
    getUrlParam: function (key) {
      return decodeURI(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURI(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    },

    /**
     * 用户登录
     * @param {object} params 登录参数
     *   username     账号
     *   password     密码
     *   validatecode 验证码
     * @return {undefined}
     */
    login: function (params) {
      $.ajax({
        url: o.origin + '/user/login/byemail',
        data: {
          email: params.username,
          pwd: params.password,
          validatecode: params.validatecode
        },
        dataType: 'jsonp',
        jsonp: 'function',
        success: function (result) {
          if (result.status == 1) {
            LoginManager.userInfo = result.data;
            LoginManager.setCookie('USER_INFO', JSON.stringify(result.data), 1);
          }
          if ($.type(params.success) == 'function') {
            params.success(result);
          }
        }
      });
    },

    /**
     * 使用QQ登录
     * @param  {string} surl 登录成功后的返回路径
     * @return {string}      跳转QQ登录路径
     */
    loginByQQ: function (surl) {
      return o.origin + '/user/login/go2qq?sUrl=' + encodeURIComponent(surl);
    },

    /**
     * 使用微信登录
     * @param  {string} surl 登录成功后的返回返回路径
     * @return {string}      跳转微信登录路径
     */
    loginByWeixin: function (surl) {
      return o.origin + '/user/login/go2weixin?sUrl=' + encodeURIComponent(surl);
    },

    /**
     * 弹窗快速登录
     * @return {undefined}
     */
    loginByDialog: function () {
      var $body = $('body');
      var $wrap = $('#xlogin_wrap');
      var surl = encodeURIComponent(location.href);
      if ($wrap.length === 0) {
        var $backdrop = $('<div id="xlogin_backdrop"></div>');
        var $iframe = $('<iframe id="xlogin_iframe" scrolling="no" width="100%" height="100%" frameborder="0" src=""></iframe>');
        $wrap = $('<div id="xlogin_wrap"></div>');
        $iframe.attr('src', o.ptlogin + '?surl=' + surl);
        $backdrop.css({
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 99999,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#000',
          filter: 'alpha(opacity=50)',
          opacity: .5
        });
        $wrap.css({
          position: 'fixed',
          left: '50%',
          top: '50%',
          zIndex: 100000,
          width: '400px',
          height: '400px',
          marginLeft: '-200px',
          marginTop: '-200px',
          backgroundColor: '#fff'
        });
        LoginManager.needCode({
          yes: function () {
            $wrap.css({
              height: '430px',
              marginTop: '-215px'
            });
          }
        });
        $body.append($backdrop);
        $wrap.append($iframe);
        $body.append($wrap);
      } else {
        $('#xlogin_backdrop').show();
        $wrap.show();
      }
    },

    /**
     * 关闭弹窗
     * @return {undefined}
     */
    closeDialog: function () {
      $('#xlogin_backdrop').hide();
      $('#xlogin_wrap').hide();
    },

    /**
     * 用户注销
     * @param  {object} params 注销参数
     * @return {undefined}
     */
    logout: function (params) {
      $.ajax({
        url: o.origin + '/user/login/out',
        dataType: 'jsonp',
        jsonp: 'function',
        success: function (result) {
          if (result.status == 1) {
            LoginManager.userInfo = null;
            LoginManager.delCookie('USER_INFO');
          }
          if ($.type(params.success) == 'function') {
            params.success(result);
          }
        }
      });
    },

    /**
     * 用户是否登录
     * @return {Boolean} 登录状态
     */
    isLogined: function (callback) {
      $.ajax({
        url: o.origin + '/user/info/all',
        dataType: 'jsonp',
        jsonp: 'function',
        success: function (result) {
          if (result.status == 1) {
            LoginManager.userInfo = result.data;
            LoginManager.setCookie('USER_INFO', JSON.stringify(result.data), 1);
          }
          if ($.type(callback) == 'function') {
            callback(result.status == 1);
          }
        }
      });
    },

    /**
     * 获取用户信息
     * @param  {Function} callback 成功回调函数
     * @return {undefined}
     */
    getUserInfo: function (callback) {
      var info = LoginManager.getCookie('USER_INFO');
      if (info) {
        LoginManager.userInfo = JSON.parse(info);
        if ($.type(callback) == 'function') {
          callback(JSON.parse(info));
        }
      } else {
        $.ajax({
          url: o.origin + '/user/info/all',
          dataType: 'jsonp',
          jsonp: 'function',
          success: function (result) {
            if (result.status == 1) {
              LoginManager.userInfo = result.data;
              LoginManager.setCookie('USER_INFO', JSON.stringify(result.data), 1);
            }
            if ($.type(callback) == 'function') {
              callback(result.data);
            }
          }
        });
      }
    },

    /**
     * 是否需要验证码
     * @return {Boolean} 是或否
     */
    needCode: function (params) {
      $.ajax({
        url: o.origin + '/user/login/needvalidatecode',
        dataType: 'jsonp',
        jsonp: 'function',
        success: function (result) {
          if (result.status == 1) {
            if ($.type(params.yes) == 'function') {
              params.yes();
            }
          } else {
            if ($.type(params.no) == 'function') {
              params.no();
            }
          }
        }
      });
    },

    /**
     * 获取验证码
     * @return {[type]} [description]
     */
    getCode: function () {
      return o.origin + '/user/validatecode/image?_=' + (new Date()).getTime();
    }
  };

  return LoginManager;
}));