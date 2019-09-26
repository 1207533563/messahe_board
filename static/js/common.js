"use strict";

$(function() {
    $("#uname").blur(function(){
        var uname = $(this).val();
        //校验用户名格式
        if (uname.trim()===""){
            $("#uname_tips").css("color","red");
            $("#uname_tips").text("用户名不能为空！");
            return;
        }

        if (/^[\u4E00-\u9FFF]+$/.test(uname)){
            $("#uname_tips").css("color","red");
            $("#uname_tips").text("用户名不能含有中文！");
            return;
        }

        if(uname.lenth < 4 || uname.lenth > 20){
            $("#uname_tips").css("color","red");
            $("#uname_tips").text("用户名应为4-20个字符！");
            return;
        }

        if (! /^[a-zA-Z0-9_]+$/.test(uname)){
            $("#uname_tips").css("color","red");
            $("#uname_tips").text("用户名只能包含字母数字下划线！");
            return;
        }

        //通过ajax连接服务器后端
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=UTF-8",
            dataType: "json",
            url: "/check_uname",
            data: "uname=" + uname,
            timeout: 1000,
            success: function(data){
                if (data["err"] === 0) {
                    $("#uname_tips").css("color", "green");
                    $("#uname_tips").css("font-weight", "bold");
                    $("#uname_tips").text('√');
                    
                }
                else {
                    $("#uname_tips").css("color", "red");
                    $("#uname_tips").text('用户名已被注册！');
                      
                }
            },
            error: function () {           
                
            }
        });
    });



    $("#send_sms_code").click(function() {
        // 校验手机号格式
        var phone = $("#phone").val();

        if (! /1\d{10}/.test(phone)) {
            alert("手机号格式错误！");
            $("#phone").focus();
            return;
        }

        // 通过Ajax将手机号发送给服务器后端程序
        $.ajax({
            url: "/send_sms_code",
            data: {
                phone: phone
            },
            success: function(data){
                if (data["err"] === 0) {
                    // 成功
                    var s = 60;
                    $("#send_sms_code").prop("disabled", true);
                    $("#send_sms_code").html(s + "S");
                    
                    var timer = window.setInterval(function() {
                        --s;
                        if (s === 0) {
                            window.clearInterval(timer);
                            $("#send_sms_code").html("重新发送");
                            $("#send_sms_code").prop("disabled", false);
                            return;
                        }
            
                        $("#send_sms_code").html(s + "S");
                    }, 1000);                    
                } else {
                    // 失败
                    alert("发送短信验证码失败，" + data["desc"]);
                }
            },
            error: function(){
                alert("发送请求失败，请检查网络连接！");
            }
        });
    });
});