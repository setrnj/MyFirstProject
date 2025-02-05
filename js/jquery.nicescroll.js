/* jquery.nicescroll
-- version 3.7.6
-- copyright 2017-07-19 InuYaksa*2017
-- licensed under the MIT
--
-- https://nicescroll.areaaperta.com/
-- https://github.com/inuyaksa/jquery.nicescroll
--
*/

/* jshint expr: true */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD模块定义
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS模块定义
    module.exports = factory(require('jquery'));
  } else {
    // 浏览器全局变量
    factory(jQuery);
  }
}(function (jQuery) {
  
  "use strict"; // 严格模式使代码更安全

  // 全局变量和常量初始化
  var domfocus = false,
      mousefocus = false,
      tabindexcounter = 0,
      ascrailcounter = 2000,
      globalmaxzindex = 0;

  var $ = jQuery,
      _doc = document,
      _win = window,
      $window = $(window);

  var delegatevents = [];

  // 获取脚本路径的函数
  function getScriptPath() {
    var scripts = _doc.currentScript || (function () {
      var s = _doc.getElementsByTagName('script');
      return (s.length) ? s[s.length - 1] : false;
    })();
    var path = scripts ? scripts.src.split('?')[0] : '';
    return (path.split('/').length > 0) ? path.split('/').slice(0, -1).join('/') + '/' : '';
  }

  // 动画相关的请求与清除函数
  var setAnimationFrame = _win.requestAnimationFrame || _win.webkitRequestAnimationFrame || _win.mozRequestAnimationFrame || false;
  var clearAnimationFrame = _win.cancelAnimationFrame || _win.webkitCancelAnimationFrame || _win.mozCancelAnimationFrame || false;

  if (!setAnimationFrame) {
    var anilasttime = 0;
    setAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - anilasttime));
      var id = _win.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
      anilasttime = currTime + timeToCall;
      return id;
    };
    clearAnimationFrame = function (id) {
      _win.clearTimeout(id);
    };
  } else {
    if (!_win.cancelAnimationFrame) clearAnimationFrame = function (id) { };
  }

  var ClsMutationObserver = _win.MutationObserver || _win.WebKitMutationObserver || false; // 监视DOM变化的类

  // 其他初始化和库内函数省略...

  $.fn.niceScroll = function (wrapper, _opt) {
    // 插件的入口函数
    if (_opt === undefined && typeof wrapper == "object" && !("jquery" in wrapper)) {
      _opt = wrapper;
      wrapper = false;
    }

    var ret = new NiceScrollArray(); // 创建一个新的滚动数组

    this.each(function () {
      var $this = $(this);

      var opt = $.extend({}, _opt); // 复制选项

      if (wrapper || false) {
        var wrp = $(wrapper);
        opt.doc = (wrp.length > 1) ? $(wrapper, $this) : wrp;
        opt.win = $this;
      }
      var docundef = !("doc" in opt);
      if (!docundef && !("win" in opt)) opt.win = $this;

      var nice = $this.data('__nicescroll') || false; // 查找已存在的实例
      if (!nice) {
        opt.doc = opt.doc || $this;
        nice = new NiceScrollClass(opt, $this); // 实例化NiceScrollClass
        $this.data('__nicescroll', nice); // 将实例存入DOM元素数据中
      }
      ret.push(nice); // 将实例添加到返回数组
    });

    return (ret.length === 1) ? ret[0] : ret; // 返回一个实例或实例数组
  };

  // 更多实现细节和方法...

}));
