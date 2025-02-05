/*!
 * animsition v3.4.3
 * http://blivesta.github.io/animsition/
 * Licensed under MIT
 * Author : blivesta
 * http://blivesta.com/
 */
(function($) {
  "use strict";

  // 定义插件的命名空间
  var namespace = "animsition";

  // 定义插件的方法
  var methods = {
    // 初始化方法
    init: function(options) {
      // 合并默认选项和用户提供的选项
      options = $.extend({
        inClass: "fade-in", // 进场动画类名
        outClass: "fade-out", // 退场动画类名
        inDuration: 1500, // 进场动画持续时间（毫秒）
        outDuration: 800, // 退场动画持续时间（毫秒）
        linkElement: ".animsition-link", // 链接元素的选择器
        loading: true, // 是否显示加载动画
        loadingParentElement: "body", // 加载动画的父元素
        loadingClass: "animsition-loading", // 加载动画的类名
        unSupportCss: [ // 不支持的CSS属性
          "animation-duration",
          "-webkit-animation-duration",
          "-o-animation-duration"
        ],
        overlay: false, // 是否使用覆盖模式
        overlayClass: "animsition-overlay-slide", // 覆盖模式的类名
        overlayParentElement: "body" // 覆盖模式的父元素
      }, options);

      // 检查浏览器是否支持动画
      var support = methods.supportCheck.call(this, options);
      if (!support) {
        // 如果不支持，打印错误信息并销毁插件
        if (!("console" in window)) {
          window.console = {};
          window.console.log = function(str) {
            return str;
          };
        }
        console.log("Animsition does not support this browser.");
        return methods.destroy.call(this);
      }

      // 检查是否启用覆盖模式
      var overlayMode = methods.optionCheck.call(this, options);
      if (overlayMode) {
        methods.addOverlay.call(this, options);
      }

      // 如果启用了加载动画，添加加载动画
      if (options.loading) {
        methods.addLoading.call(this, options);
      }

      // 遍历每个匹配的元素
      return this.each(function() {
        var _this = this;
        var $this = $(this);
        var $window = $(window);
        var data = $this.data(namespace);

        // 如果数据不存在，则初始化
        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, {
            options: options
          });

          // 绑定窗口加载和页面显示事件
          $window.on("load." + namespace + " pageshow." + namespace, function() {
            methods.pageIn.call(_this);
          });

          // 绑定窗口卸载事件
          $window.on("unload." + namespace, function() {});

          // 绑定链接点击事件
          $(options.linkElement).on("click." + namespace, function(event) {
            event.preventDefault();
            var $self = $(this);
            methods.pageOut.call(_this, $self);
          });
        }
      });
    },

    // 添加覆盖层
    addOverlay: function(options) {
      $(options.overlayParentElement).prepend('<div class="' + options.overlayClass + '"></div>');
    },

    // 添加加载动画
    addLoading: function(options) {
      $(options.loadingParentElement).append('<div class="' + options.loadingClass + '"></div>');
    },

    // 移除加载动画
    removeLoading: function() {
      var $this = $(this);
      var options = $this.data(namespace).options;
      var $loading = $(options.loadingParentElement).children("." + options.loadingClass);
      $loading.fadeOut().remove();
    },

    // 检查浏览器是否支持动画
    supportCheck: function(options) {
      var $this = $(this);
      var props = options.unSupportCss;
      var propsNum = props.length;
      var support = false;

      // 如果没有需要检查的CSS属性，则认为支持
      if (propsNum === 0) {
        support = true;
      }

      // 检查每个CSS属性
      for (var i = 0; i < propsNum; i++) {
        if (typeof $this.css(props[i]) === "string") {
          support = true;
          break;
        }
      }

      return support;
    },

    // 检查是否启用覆盖模式
    optionCheck: function(options) {
      var $this = $(this);
      var overlayMode;
      if (options.overlay || $this.data("animsition-overlay")) {
        overlayMode = true;
      } else {
        overlayMode = false;
      }
      return overlayMode;
    },

    // 检查动画设置
    animationCheck: function(data, stateClass, stateIn) {
      var $this = $(this);
      var options = $this.data(namespace).options;
      var dataType = typeof data;
      var dataDuration = !stateClass && dataType === "number";
      var dataClass = stateClass && dataType === "string" && data.length > 0;

      if (dataDuration || dataClass) {
        data = data;
      } else if (stateClass && stateIn) {
        data = options.inClass;
      } else if (!stateClass && stateIn) {
        data = options.inDuration;
      } else if (stateClass && !stateIn) {
        data = options.outClass;
      } else if (!stateClass && !stateIn) {
        data = options.outDuration;
      }

      return data;
    },

    // 页面进入动画
    pageIn: function() {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInDuration = $this.data("animsition-in-duration");
      var thisInClass = $this.data("animsition-in");
      var inDuration = methods.animationCheck.call(_this, thisInDuration, false, true);
      var inClass = methods.animationCheck.call(_this, thisInClass, true, true);
      var overlayMode = methods.optionCheck.call(_this, options);

      if (options.loading) {
        methods.removeLoading.call(_this);
      }

      if (overlayMode) {
        methods.pageInOverlay.call(_this, inClass, inDuration);
      } else {
        methods.pageInBasic.call(_this, inClass, inDuration);
      }
    },

    // 基本的页面进入动画
    pageInBasic: function(inClass, inDuration) {
      var $this = $(this);
      $this.css({
        "animation-duration": inDuration / 1e3 + "s"
      }).addClass(inClass).animateCallback(function() {
        $this.removeClass(inClass).css({
          opacity: 1
        });
      });
    },

    // 覆盖模式的页面进入动画
    pageInOverlay: function(inClass, inDuration) {
      var $this = $(this);
      var options = $this.data(namespace).options;
      $this.css({
        opacity: 1
      });
      $(options.overlayParentElement).children("." + options.overlayClass).css({
        "animation-duration": inDuration / 1e3 + "s"
      }).addClass(inClass);
    },

    // 页面退出动画
    pageOut: function($self) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var selfOutClass = $self.data("animsition-out");
      var thisOutClass = $this.data("animsition-out");
      var selfOutDuration = $self.data("animsition-out-duration");
      var thisOutDuration = $this.data("animsition-out-duration");
      var isOutClass = selfOutClass ? selfOutClass : thisOutClass;
      var isOutDuration = selfOutDuration ? selfOutDuration : thisOutDuration;
      var outClass = methods.animationCheck.call(_this, isOutClass, true, false);
      var outDuration = methods.animationCheck.call(_this, isOutDuration, false, false);
      var overlayMode = methods.optionCheck.call(_this, options);
      var url = $self.attr("href");

      if (overlayMode) {
        methods.pageOutOverlay.call(_this, outClass, outDuration, url);
      } else {
        methods.pageOutBasic.call(_this, outClass, outDuration, url);
      }
    },

    // 基本的页面退出动画
    pageOutBasic: function(outClass, outDuration, url) {
      var $this = $(this);
      $this.css({
        "animation-duration": outDuration / 1e3 + "s"
      }).addClass(outClass).animateCallback(function() {
        location.href = url;
      });
    },

    // 覆盖模式的页面退出动画
    pageOutOverlay: function(outClass, outDuration, url) {
      var _this = this;
      var $this = $(this);
      var options = $this.data(namespace).options;
      var thisInClass = $this.data("animsition-in");
      var inClass = methods.animationCheck.call(_this, thisInClass, true, true);
      $(options.overlayParentElement).children("." + options.overlayClass).css({
        "animation-duration": outDuration / 1e3 + "s"
      }).removeClass(inClass).addClass(outClass).animateCallback(function() {
        $this.css({
          opacity: 0
        });
        location.href = url;
      });
    },

    // 销毁插件
    destroy: function() {
      return this.each(function() {
        var $this = $(this);
        $(window).unbind("." + namespace);
        $this.css({
          opacity: 1
        }).removeData(namespace);
      });
    }
  };

  // 动画结束回调函数
  $.fn.animateCallback = function(callback) {
    var end = "animationend webkitAnimationEnd mozAnimationEnd oAnimationEnd MSAnimationEnd";
    return this.each(function() {
      $(this).bind(end, function() {
        $(this).unbind(end);
        return callback.call(this);
      });
    });
  };

  // 定义插件方法
  $.fn.animsition = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === "object" || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error("Method " + method + " does not exist on jQuery." + namespace);
    }
  };
})(jQuery);