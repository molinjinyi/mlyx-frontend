// 最近玩的服
function getPlayRecent(prms, callback, failback) {
  var recents = document.gameRecents;
  if (recents && recents.data && recents.data.data && recents.data.data.length > 0) {
    if (callback && typeof callback == 'function') {
      callback(recents);
      return;
    }else{
      return recents; 
    }
  }
  if (!failback) {
    failback = callback;
  }
  if (prms) {
    if (!prms.pagenum) {
      prms.pagenum = 1;
    }
    if (!prms.pagesize) {
      prms.pagesize = 10;
    }
  }
  ServerManager.recentserver(prms, function (result) {
    document.gameRecents = result;
    if (callback && typeof callback == 'function') {
      callback(result);
    }
  }, failback);
}

// 服务器列表
function getServerList(prms, callback, failback) {
  var serverList = document.gameServerList;
  if (serverList && serverList.data && serverList.data.data && serverList.data.data.length > 0) {
    if (callback && typeof callback == 'function') {
      callback(recents);
      return;
    }else{
      return recents; 
    }
  }
  if (prms) {
    if (!prms.pagenum) {
      prms.pagenum = 1;
    }
    if (!prms.pagesize) {
      prms.pagesize = 3;
    }
  }
  if (!failback || $.type(failback) != 'function') {
    failback = callback;
  }
  ServerManager.getServerList(prms, function (result) {
    document.gameServerList = result;
    if (callback && $.type(callback) == 'function') {
      callback(result);
    }
  }, failback);
}


$.divselect = function (divselectid, inputselectid) {
  var $inputselect = $(inputselectid);
  var $divselect = $(divselectid);
  $divselect.on('click',".selected", function () {
    var ul = $divselect.find("ul");
    if (ul.css("display") == "none") {
      ul.slideDown("fast");
    } else {
      ul.slideUp("fast");
    }
  });
  $divselect.on('click', 'ul li a', function () {
    var txt = $(this).text();
    $divselect.find(".selected span").html(txt);
    var value = $(this).attr("selectid");
    $inputselect.val(value);
    $divselect.find("ul").hide();
  });
};

$.fn.placeholder = function(option, callback) {
    var settings = $.extend({
        word: '',
        color: '#ccc',
        evtType: 'focus'
    }, option)
 
    function bootstrap($that) {
        // some alias
        var word    = settings.word
        var color   = settings.color
        var evtType = settings.evtType
 
        // default
        var defColor = $that.css('color')
        var defVal   = $that.val()
 
        if (defVal == '' || defVal == word) {
            $that.css({color: color}).val(word)
        } else {
            $that.css({color: defColor})
        }
 
        function switchStatus(isDef) {
            if (isDef) {
                $that.val('').css({color: defColor})   
            } else {
                $that.val(word).css({color: color})
            }
        }
        function asFocus() {
            $that.bind(evtType, function() {
                var txt = $that.val()
                if (txt == word) {
                    switchStatus(true)
                }
            }).bind('blur', function() {
                var txt = $that.val()
                if (txt == '') {
                    switchStatus(false)
                }
            })
        }
        function asKeydown() {
            $that.bind('focus', function() {
                var elem = $that[0]
                var val  = $that.val()
                if (val == word) {
                    setTimeout(function() {
                        // 光标定位到首位
                        $that.setCursorPosition({index: 0})
                    }, 10)                 
                }
            })
        }
 
        if (evtType == 'focus') {
            asFocus()
        } else if (evtType == 'keydown') {
            asKeydown()
        }
 
        // keydown事件里处理placeholder
        $that.keydown(function() {
            var val = $that.val()
            if (val == word) {
                switchStatus(true)
            }
        }).keyup(function() {
            var val = $that.val()
            if (val == '') {
                switchStatus(false)
                $that.setCursorPosition({index: 0})
            }
        })
    }
 
    return this.each(function() {
        var $elem = $(this)
        bootstrap($elem)
        if ($.isFunction(callback)) callback($elem)
    })
};