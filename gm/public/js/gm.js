/**
 * Created by peter on 14-10-22.
 */
$(function(){
    $("#submit").click(function(){
        var w=$("input[name='w']").val(),
            h=$("input[name='h']").val(),
            source=$("#capture").attr("src"),
            dest=source.replace(/(\.(png|jpg|gif)+)/g,"."+w+"x"+h+"$1");
        $.ajax({
            url:"/gm",
            type:"get",
            dataType:"text",
            data:{
                "source":source,
                "width":w,
                "height":h,
                "dest":dest
            },
            success:function(data){
                $("#result").attr("src",data.toString());
            }
        });
    });
});