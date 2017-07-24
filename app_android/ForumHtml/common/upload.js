define(function(require, exports, module) {
    var Common = require('common/common.js');
    exports.uploaderSetting = function(auto_start, upload_callback) {
        Common.checkLoginStatus(function(token) {
        exports.uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            container: 'uploader',
            drop_element: 'uploader',
            flash_swf_url: '../../libs/plupload/js/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            uptoken_func: function() {
                var ajax = new XMLHttpRequest();
                ajax.open('GET', '/upload/qiniu_token/?callback=0', false);
                ajax.setRequestHeader("If-Modified-Since", "0");
                ajax.setRequestHeader("Authorization", "Token " + token);
                ajax.send();
                if (ajax.status === 200) {
                    var res = JSON.parse(ajax.responseText);
                    console.log('custom uptoken_func:' + res.token);
                    console.log('custom uptoken_func:' + res.key);
                    return res.token;
                } else {
                    console.log('custom uptoken_func err');
                    return '';
                }
            },
            get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            domain: 'http://pic.ean.haorenao.cn/',     // bucket域名，下载资源时用到，必需
            max_file_size: '10mb',             // 最大文件体积限制
            max_retries: 3,                     // 上传失败最大重试次数
            auto_start: auto_start,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            multi_selection: false,//是否允许同时选择多文件
            log_level: 5,
            init: {
                'Key': function(up, file) {
                    var ext = Qiniu.getFileExtension(file.name);
                    var key = '';
                    Common.checkLoginStatus(function(token) {
                        $.ajax({
                            type: "get",
                            async: false,
                            url: Common.domain + "upload/qiniu_token?ext=" + ext + "&only_key=true",
                            headers: {
                                Authorization: "Token " + token
                            },
                            success: function(json) {
                                key = json.key
                            },
                            error: function(xhr, textStatus) {
                            }
                        });
                    });
                   return key;
                },
                'FilesAdded': function(up, files) {
                    plupload.each(files, function(file) {
                    });
                },
                'BeforeUpload': function(up, file) {
                },
                'Error': function(up, err, errTip) {
                },
                'UploadComplete': function() {
                },
                'FileUploaded': function(up, file, info) {
                    var domain = up.getOption('domain');
                    var res = eval('(' + info + ')');
                    var source_link = domain + res.key;
                    console.log('source_link:' + source_link);
                    upload_callback(source_link)
               },
            }
        });
    });
    }
});
