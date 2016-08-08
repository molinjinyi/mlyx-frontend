// 弹出窗
$.dialog = function (options) {
    var defaults = {
        title: '',
        content: '',
        className: ''
    };
    var opts = $.extend(true, defaults, options);
    var $body = $('body'),
        $backdrop = $('<div class="dialog-backdrop"></div>'),
        html = '<div class="dialog-modal ' + opts.className + '">' +
        '   <div class="close">×</div>' +
        (opts.title ? '<div class="dialog-header" title="' + opts.title + '">' + opts.title + '</div>' : '') +
        '   <div class="dialog-content">' + opts.content + '</div>' +
        '</div>',
        $modal = $(html),
        $content = $modal.find('.dialog-content');

    $body.append($backdrop);
    $body.append($modal);

    setTimeout(function () {
        $backdrop.addClass('show');
        $modal.addClass('show');
    }, 10);

    $backdrop.on('click', function (e) {
        closeDialog(e);
    });

    $modal.on('click', '.close', function (e) {
        closeDialog(e);
    });

    function closeDialog(e) {
        e.stopPropagation();
        $backdrop.off();
        $backdrop.removeClass('show');
        $modal.removeClass('show');
        setTimeout(function () {
            $backdrop.remove();
            $modal.remove();
        }, 300);
    }

    return $modal;
};