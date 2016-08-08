var namespace = function () {
    var arg = arguments;
    for (var i = 0; i < arg.length; i++) {
        var arr = arg[i].split(".");
        var win = window;
        for (var j = 0; j < arr.length; j++) {
            win[arr[j]] = win[arr[j]] || {};
            win = win[arr[j]]
        }
    }
    return win;
};

/**
 * 服务器相关接口
 *
 */
namespace("ServerManager");

ServerManager.g_server = ServerUrl || "";

/**
 * 开服列表
 */
ServerManager.openserverlist = function (prms, callback, failback) {
    var _url = ServerManager.g_server + "/gameinfo/server/openserverlist?function=?";

    $.getJSON(
        _url, {
            "gid": prms.gid
        },
        function (result) {
            if (result.status == 1) {
                callback(result);
            } else {
                failback(result);
            }
        }
    );
}

/**
 * 开服列表分页
 */
ServerManager.getServerList = function (prms, callback, failback) {
    var _url = ServerManager.g_server + "/gameinfo/server/pageopenserverlist?function=?";

    $.getJSON(
        _url, {
            "gid": prms.gid,
            "pagenum": prms.pagenum || 1,
            "pagesize": prms.pagesize || 10
        },
        function (result) {
            if (result.status == 1) {
                callback(result);
            } else {
                failback(result);
            }
        }
    );
}

/**
 * 拉取游戏列表
 * 所有游戏
 */
ServerManager.recentserver = function (prms, callback, failback) {
    var _url = ServerManager.g_server + "/gameinfo/server/recentserver?function=?";

    $.getJSON(
        _url, {
            "gid": prms.gid,
            "pagenum": prms.pagenum || 1,
            "pagesize": prms.pagesize || 40
        },
        function (result) {
            if (result.status == 1) {
                callback(result);
            } else {
                failback(result);
            }
        }
    );
}

/**
 * 封装url
 * 补充前缀http://
 */
ServerManager.fillHttpUrl = function (_url) {
    var ind = _url.indexOf("http");
    if (ind == -1) {
        _url = "http://" + _url;
    }
    return _url;
}

ServerManager.getAllServerList = function (prms, callback, failback) {
    var _url = ServerManager.g_server + "/gameinfo/server/pageopenserverlist?function=?";

    $.getJSON(
        _url, {
            "gid": prms.gid,
            "pagenum": prms.pagenum || 1,
            "pagesize": prms.pagesize || 40
        },
        function (result) {
            if (result.status == 1) {
                callback(result);
            } else {
                failback(result);
            }
        }
    );
};