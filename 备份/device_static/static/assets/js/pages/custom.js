//图片上传
$(document).on("change","input[type='file']",function (eve) {
    var eve = eve.target;
    var l = eve.files.length;
    var il = $("#imgList li").length;
    var id = $(this).attr("id");
    for (var i = 0; i < l; i++) {
        (function (i) {
            var fr = new FileReader();
            var files = eve.files[i];
            fr.readAsDataURL(files);
            fr.onloadend = function (e) {
                var src = e.target.result;
                if (id == "fileup") {
                    // 图片
                    i = i + il;
                    imgListHtml = '<li>'
                    imgListHtml += '    <div class="imgBox d-flex justify-content-center align-items-center">'
                    imgListHtml += '        <img id="img' + i + '" src="' + src + '" alt="">'
                    imgListHtml += '    </div>'
                    imgListHtml += '    <div class="row mt-3">'
                    imgListHtml += '        <div class="styled-checkbox ml-3 mt-2">'
                    imgListHtml += '            <input type="checkbox" name="cb' + i + '" id="cb' + i + '">'
                    imgListHtml += '            <label for="cb' + i + '"></label>'
                    imgListHtml += '        </div>'
                    imgListHtml += '        <a href="javascript://;">'
                    imgListHtml += '            <i class="ti ti-trash"></i>删除'
                    imgListHtml += '        </a>'
                    imgListHtml += '    </div>'
                    imgListHtml += '</li>'
                    $("#imgList").append(imgListHtml);
                    $('#example-one li:eq(1) a').tab('show');
                }
                if (id == "linkImgUp") {
                    // 链接
                    $("#showImgBox img").attr("src", src);
                    $('#example-one li:eq(2) a').tab('show');
                }
                if (id == "twimglist") {
                    // 图文
                    twImgListHtml =  '<li class="d-flex justify-content-center align-items-center">'
                    twImgListHtml += '  <img src="' + src + '">';
                    twImgListHtml += '  <a href="javascript://">';
                    twImgListHtml += '      <i class="la la-times"></i>删除';
                    twImgListHtml += '  </a>';
                    twImgListHtml += '</li>';
                    $(".tuwen-imglist ul").append(twImgListHtml);
                }
            }
        })(i);
    }
});