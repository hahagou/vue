$(function () {
    /*新增剧本验证*/



    /*新增内容验证*/
    $('#addMessage').on('click', function () {
        /*待完善...*/
        $('#modal-alert').removeClass('hide');
    });

    /*内容排序*/
    // $("#sortable").sortable({
    //     items: "> .item",//拖动指定节点
    //     axis: "y",//拖动方向
    //     stop: function (event, ui) {
    //         //遍历当前排序,插入当前排序
    //         $('#sortable .item').each(function () {
    //             // console.log($(this).index()+1);
    //             $(this).find('.iconNumber').text($(this).index()+1);
    //         });
    //     }//当排序停止时触发该事件。
    //     //revert: true//拖动动画
    // });

    /*删除剧本内容*/
    // $('.delInfo').on('click', function () {
    //     var del = $(this);
    //     layer.confirm('确定要删除这条剧本吗？', {
    //         btn: ['确定', '取消'] //按钮
    //     }, function (index) {
    //         del.parents('.item').remove();
    //         layer.close(index);
    //     }, function () {
    //         return;
    //     });
    // });
});