$(function () {
  var exchangeRatio = 0;
  var rechargeAmount = 100;
  var orderInfo = null;

  // 用户是否登录
  LoginManager.isLogined(function (login) {
    if (login) {
      LoginManager.getUserInfo(function (userInfo) {
        $('#pay_wrap').find('.recharge-account').text(userInfo.nickname);
      });
    } else {
      location.href = url_user + '/login?surl=' + encodeURIComponent(location.href);
    }
  });

  initPage();

  // 初始化页面
  function initPage() {
    var gid = LoginManager.getUrlParam('gid');
    var sid = LoginManager.getUrlParam('sid');
    if (gid) {
      var $rdoGame = $('#game_list').find('.rdo-game[value=' + gid + ']');
      if ($rdoGame.length != 0) {
        $rdoGame.prop('checked', true);
        $('#game_name').find('.text').text($rdoGame.data('text'));
      }
    }
    if (gid && sid) {
      getServerList(gid, function () {
        var $rdoServer = $('#server_list').find('.rdo-game[value=' + sid + ']');
        if ($rdoServer.length != 0) {
          $rdoServer.prop('checked', true);
          $('#server_name').find('.text').text($rdoServer.data('text'));
        }
      });

      getRoleInfo(gid, sid);
    }
  }

  // 切换支付方式
  $('#subnav').on('click', '.item', function (e) {
    var $this = $(this);
    var $payWrap = $('#pay_wrap');
    var mode = $this.data('value');
    var text = $this.data('text');
    $('#subnav').find('.item.active').removeClass('active');
    $this.addClass('active');
    $payWrap.find('.pay-mode').text(text);
    $payWrap.find('.explain-list').removeClass('active');
    $payWrap.find('.' + mode + '-list').addClass('active');
  });

  // 弹出游戏选择窗
  $('#game_name').on('click', function (e) {
    $('#game_list').removeClass('hide');
    $('#server_list').addClass('hide');
  });

  // 弹出服务器选择窗
  $('#server_name').on('click', function (e) {
    var $gameRdo = $('#game_list').find('[name="game"]:checked');
    if ($gameRdo.length === 0) {
      return;
    }
    getServerList($gameRdo.val());
    $('#game_list').addClass('hide');
    $('#server_list').removeClass('hide');
  });

  // 关闭弹窗
  $('#game_list, #server_list').on('click', '.close', function (e) {
    $(this).parent().addClass('hide');
  });

  // 选择游戏
  $('#game_list').on('click', '.rdo-game', function (e) {
    var $rdo = $(this);
    $rdo.closest('ul').find('.active').removeClass('active');
    $rdo.closest('li').addClass('active');
    $('#game_name').find('.text').text($rdo.data('text'));
    $('#game_list').addClass('hide');

    $('#server_name').find('.text').text('游戏服务器');
    $('#server_list').removeClass('hide');

    $('#role_name').text('');

    exchangeRatio = $rdo.data('ratio');
    $('#ratio').text(exchangeRatio);

    getServerList($rdo.val());
    calculationIngot();
  });

  // 获取服务器列表
  function getServerList(gid, callback) {
    $('#server_list').find('ul').html('<div class="tac"><img src="' + origin_assets + '/images/loading.gif" /></div>');
    $.ajax({
      url: origin_game + '/gameinfo/server/openserverlist',
      data: {
        gid: gid
      },
      dataType: 'jsonp',
      jsonp: 'function',
      success: function (result) {
        if (result.status == 1) {
          var html = '';
          for (var i = 0, j = result.data.length; i < j; i++) {
            html += '<li>' +
              '<label class="lbl-rdo">' +
              '<input class="rdo-game" type="radio" name="server" value="' + result.data[i].sid + '" data-text="' + result.data[i].sname +'">' + result.data[i].sname +
              '</label>' +
              '</li>';
          }
          $('#server_list').find('ul').html(html);

          if ($.type(callback) == 'function') {
            callback();
          }
        }
      }
    });
  }

  // 获取角色信息
  function getRoleInfo(gid, sid) {
    var $role_list = $('#role_list');
    $role_list.html('<img src="' + origin_assets + '/images/loading.gif" /></div>');
    $.ajax({
      url: origin_game + '/gameinfo/server/loadplayerroles',
      data: {
        gid: gid,
        sid: sid
      },
      dataType: 'jsonp',
      jsonp: 'function',
      success: function (result) {
        if (result.status == 10001) {
          var roles = result.data.roles;
          var html = '';
          if (roles.length === 0) {
            html = '暂无角色';
          } else {
            for (var i = 0, j = roles.length; i < j; i++) {
              html += '<li class="' + (i == 0 ? 'active' : '') + ((i + 1) % 3 === 0 ? ' nrm' : '') + '" data-value="' + roles[i].roleId + '">' + roles[i].roleName + ' (' + roles[i].roleLevel + '级)</li>'
            }
          }
          $role_list.html(html);
        } else if (result.status == 10003) {
          $role_list.html('暂无角色');
        } else {
          $role_list.html('游戏服务器异常，请联系在线客服');
        }
      }
    });
  }

  // 选择服务器
  $('#server_list').on('click', '.rdo-game', function (e) {
    var $rdo = $(this);
    $rdo.closest('ul').find('.active').removeClass('active');
    $rdo.closest('li').addClass('active');
    $('#server_name').find('.text').text($rdo.data('text'));
    $('#server_list').addClass('hide');

    getRoleInfo($('#game_list').find('[name="game"]:checked').val(), $rdo.val());
  });

  $('#role_list').on('click', 'li', function (e) {
    $('#role_list').find('.active').removeClass('active');
    $(this).addClass('active');
  });

  // 选择金额
  $('#amount_list').on('click', 'li', function (e) {
    var $this = $(this);
    $('#amount_list').find('.active').removeClass('active');
    $('#other_amount').val('').removeClass('active');
    $this.addClass('active');
    calculationIngot();
  });

  // 其他金额
  $('#other_amount').on('focus', function (e) {
    $('#amount_list').find('.active').removeClass('active');
    $(this).addClass('active');
    rechargeAmount = 0;
  });
  $('#other_amount').on('change', function (e) {
    var $this = $(this);
    var amount = parseFloat($this.val());
    if (isNaN(amount)) {
      $this.val('');
      amount = 0;
    }
    calculationIngot();
  });

  // 充值
  $('#btn_recharge').on('click', function () {
    var $this = $(this);
    var mode = $('#subnav').find('.active').data('value');
    var gid = $('#game_list').find('[name="game"]:checked').val();
    var sid = $('#server_list').find('[name="server"]:checked').val();
    var rid = $('#role_list').find('.active').data('value');
    var money = rechargeAmount;
    var $error_msg = $('#error_msg');
    if (!mode) {
      $error_msg.text('请选择充值方式');
      return;
    } else if (!gid) {
      $error_msg.text('请选择游戏');
      return;
    } else if (!sid) {
      $error_msg.text('请选择游戏服务器');
      return;
    } else if (!rid) {
      $error_msg.text('请选择角色名称');
      return;
    } else if (money <= 0) {
      $error_msg.text('请选择充值金额');
      return;
    }
    $error_msg.text('');
    $this.text('充值中...').prop('disabled', true);
    $.ajax({
      url: origin_recharge + '/recharge/' + mode + '/initOrder',
      data: {
        iGameId: gid,
        iWorldId: sid,
        vUserId: LoginManager.userInfo.uid,
        iPlayerId: rid,
        iRmb: money,
        surl: url_user + '/'
      },
      dataType: 'jsonp',
      jsonp: 'function',
      success: function (result) {
        if (result.status == 20001) {
          orderInfo = result.data;
          if (mode == 'alipay') {
            getAlipayOrderForm();
          } else if (mode == 'weichat') {
            showPayConfirm();
          }
        } else {
          alert('充值失败');
        }
      },
      complete: function () {
        $this.text('立即充值').prop('disabled', false);
      }
    });
  });

  // 显示支付确认窗
  function showPayConfirm() {
    var $order_wrap = $('#order_wrap');
    var mode = '';
    switch (orderInfo.order.iplatformType) {
    case 'ALIPAY':
      mode = '支付宝支付';
      break;
    case 'WEICHAT':
      mode = '微信支付';
      break;
    }
    $order_wrap.find('.order-mode').text(mode);
    $order_wrap.find('.order-no').text(orderInfo.order.vorderNo);
    $order_wrap.find('.order-user').text(orderInfo.nickname);
    $order_wrap.find('.order-game').text(orderInfo.gamename + ' ' + orderInfo.sname);
    $order_wrap.find('.order-money').text((orderInfo.order.irmb / 100) + '元');
    $order_wrap.find('.order-ingot').text(orderInfo.order.igameCurrency);
    $('#pay_backdrop').show();
    $order_wrap.show();
  }

  // 获取支付宝提交表单
  function getAlipayOrderForm() {
    $.ajax({
      url: origin_recharge + '/recharge/alipay/getOrderSubmitForm',
      data: {
        vOrderNo: orderInfo.order.vorderNo,
        surl: encodeURIComponent(url_pay + '/payend?orderno=' + orderInfo.order.vorderNo),
        target: '_blank',
        autoSubmit: false
      },
      dataType: 'jsonp',
      jsonp: 'function',
      success: function (result) {
        if (result.status == 20001) {
          $('#submit_form').html(result.data);
          showPayConfirm();
        }
      }
    });
  }

  // 轮询查询微信支付状态
  function timeoutQrcode(orderNo) {
    $.ajax({
      url: origin_recharge + '/recharge/alipay/getOrderInfoStatus',
      data: {
        vOrderNo: orderNo
      },
      dataType: 'jsonp',
      jsonp: 'function',
      success: function (result) {
        if (result.status == 20001) {
          if (result.data >= 1) {
            $('#qrcode_wrap').hide();
            $('#end_wrap').show();
          } else {
            setTimeout(function () {
              timeoutQrcode(orderNo);
            }, 2000);
          }
        }
      }
    });
  }

  // 确认充值提交
  $('#order_wrap').on('click', '.btn-orange', function (e) {
    var $alipaysubmit = $('#alipaysubmit');
    var $order_wrap = $('#order_wrap');
    var $end_wrap = $('#end_wrap');
    $order_wrap.hide();
    $end_wrap.find('.btn-orange').attr('href', '/payend?orderno=' + orderInfo.order.vorderNo);
    if ($alipaysubmit.length != 0) {
      $alipaysubmit.submit();
      $end_wrap.show();
    } else {
      $('#qrcode').html('<img class="block" src="' + origin_misc + '/misc/util/qrcode?text=' + encodeURIComponent(orderInfo.payURL) + '&width=400&height=400" />')
      $('#qrcode_wrap').show();
      timeoutQrcode(orderInfo.order.vorderNo);
    }
  });

  // 返回修改
  $('#order_wrap').on('click', '.btn-default', function (e) {
    $('#submit_form').html('');
    $('#pay_backdrop').hide();
    $('#order_wrap').hide();
  });

  // 关闭充值弹窗
  $('#order_wrap').on('click', '.close', function (e) {
    $('#submit_form').html('');
    $('#pay_backdrop').hide();
    $('#order_wrap').hide();
  });

  // 关闭提示
  $('#end_wrap').on('click', '.close', function (e) {
    $('#pay_backdrop').hide();
    $('#end_wrap').hide();
  });

  // 提示弹窗返回
  $('#end_wrap').on('click', '.btn-back', function (e) {
    $('#pay_backdrop').hide();
    $('#end_wrap').hide();
  });

  // 关闭微信二维码弹窗
  $('#qrcode_wrap').on('click', '.close', function (e) {
    $('#qrcode_wrap').hide();
    $('#end_wrap').show();
  });

  // 计算对应元宝数量
  function calculationIngot() {
    if (exchangeRatio === 0) {
      return;
    }
    var $money = $('#amount_list').find('.active');
    var money = 0;
    if ($money.length !== 0) {
      money = parseFloat($money.data('value'));
    } else {
      money = parseFloat($('#other_amount').val())
    }
    if (money) {
      rechargeAmount = money;
      $('#ingot').text(exchangeRatio * money);
    } else {
      rechargeAmount = 0;
    }
  }
});