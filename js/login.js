$('[name="passwordShow_login"]').change(function () {
    let pwd = $("#password");
    if ($(this).prop('checked')) {
        pwd[0].type = 'text';
    } else {
        pwd[0].type = 'password';
    }
})

$('[name="passwordShow_Sign-up"]').change(function () {
    let pwd = $("#password");
    let pwd_Confirm = $("#password_Confirm");
    if ($(this).prop('checked')) {
        pwd[0].type = 'text';
        pwd_Confirm[0].type = 'text';
    } else {
        pwd[0].type = 'password';
        pwd_Confirm[0].type = 'password';
    }
})

$("#sign-up_Submit").click(function () {
    let userName = $("#account_Id").val();
    let mailAddress = $("#mailAddress").val();
    let password = $("#password").val();
    let password_Confirm = $("#password_Confirm").val();

    if (userName == "" || mailAddress == "" || password == "") {
        $("#errormsg").html("必要項目が入力されていません。");
    } else if (password !== password_Confirm) {
        $("#errormsg").html("パスワードが一致しません。");
    } else {
        let user = new ncmb.User();
        user.set("userName", userName)
            .set("mailAddress", mailAddress)
            .set("password", password)
            .set("nickname", "null")
            .set("history", "null")
            .signUpByAccount()

            .then(function (user) {
                console.log("新規ユーザー登録成功");
                window.location.href = "./mypage.html";
                // return ncmb.User.login(user);
            })
            .then(function (user) {
                console.log("ログイン成功: " + JSON.stringify(user));
                window.location.href = "./mypage.html";
            })
            .catch(function (error) {
                console.log("認証処理失敗: : " + error + ", " + JSON.stringify(error));
                switch (error.error) {
                    case "userName is duplication.":
                        $("#errormsg").html("このアカウント名は既に使われています。");
                        break;
                    default:
                        break;
                }
            })
    }
})


$("#login_Submit").click(function () {
    let userName = $("#account_Id").val();
    let password = $("#password").val();

    // アカウント名・パスワードどちらかが入力されていない
    if (account_Id == "" || password == "") {
        $("#errormsg").html("アカウント名、パスワードが入力されていません。");
    } else {
        $("#errormsg").html("");

        ncmb.User.login(userName, password)
            .then(function () {
                console.log(user = ncmb.User.getCurrentUser());
                if (user.mailAddressConfirm) {
                    window.location.href = "./index.html";
                } else if (!user.mailAddressConfirm) {
                    $("#errormsg").html("メールアドレス認証を完了してください。");
                    ncmb.User.logout();
                } else {
                    $("#errormsg").html("エラー");
                    ncmb.User.logout();
                }
            })
            .catch(function (error) {
                console.log("ログイン失敗: " + error + ", " + JSON.stringify(error));
                $("#errormsg").html("アカウント名、パスワードが間違っています。");
            })
    }
});

$("#send_Mail_Btn").click(function () {
    let mailAddress = $("#mailAddress").val();
    ncmb.User.requestPasswordReset(mailAddress)
        .then(function () {
            $(".psw_Reset_None").hide().html("");
            $(".psw_Reset_Collect").show().html("<p>パスワードリセットのURLをメールアドレスにお送りいたしました。<br />URLからパスワードリセットを行ってください。</p>");
        })
        .catch(function () {
            $("#errormsg").html("このメールアドレスは、使用されていません。");
        });
});

let client_secret = "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";
res = "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";
API_KEY = "AIzaSyBvQX7ZOoPJA5SKQ-JY8ldy9OPweu1aUUA";


const auth = () => {
    return new Promise((res, rej) => {
        gapi.auth.authorize({
            // client_id: client_id,
            // scope: scope,
            immediate: true
        }, res);
    })
}

const load = () => {
    return new Promise((res, rej) => {
        gapi.client.load('plus', 'v1', res);
    });
}

// document.getElementById("google_Sign-up_Submit").onclick = async (e) => {
//     gapi.client.setApiKey(API_KEY);
//     // Google+の認証実行
//     const token = await auth();
//     // 返ってきたトークンを設定
//     gapi.auth.setToken(token);
//     // Google+ライブラリの読み込み
//     await load();
//     // 自分の情報を読み取り
//     const result = await gapi.client.plus.people.get({
//         "userId": "me"
//     });
//     // NCMBの認証
//     const authInfo = {
//         id: result.result.id,
//         access_token: token.access_token
//     };
//     const user = new ncmb.User;
//     // ユーザ登録処理
//     await user.signUpWith('google', authInfo);
//     // ログイン処理
// }

// $("#google_Sign-up_Submit").click(async (e) => {
//     let client_secret = "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";
//     gapi.client.setApiKey(client_secret);
//     const token = await auth();
//     gapi.auth.setToken(token);
//     await load();
//     const result = await gapi.client.plus.people.get({
//         "userId": "me"
//     });
//     const authInfo = {
//         id: result.result.id,
//         access_token: token.access_token
//     };
//     const user = new ncmb.User;
//     await user.signUpWith('google', authInfo);
//     user = ncmb.User.getCurrentUser()
//     ncmb.user.signUpWith("Twitter");
// })

$("#google_Link_Submit").click(function () {
    console.log("googlelink");
    user = ncmb.User.getCurrentUser()
    // user.linkWith("Google", user, function (result) {
    //     console.log(JSON.stringify(result));
    // });
    user.linkWith("Google", user);
    // user.unLinkWith("Google");
});

function google_Link() {
    console.log("googlelink");
    user = ncmb.User.getCurrentUser()
    // user.linkWith("Google", user, function (result) {
    //     console.log(JSON.stringify(result));
    // });
    user.prototype.linkWith("Google", user);
    // user.unLinkWith("Google");
}

function Google_LogIn() {

}

// =================//
// ユーザー名変更関連
// =================//
$("#name_Change_Login_Submit").click(function () {
    let userName = $("#account_Id").val();
    let password = $("#password").val();

    // アカウント名・パスワードどちらかが入力されていない
    if (account_Id == "" || password == "") {
        $("#errormsg").html("アカウント名、パスワードが入力されていません。");
    } else {
        $("#errormsg").html("");

        ncmb.User.login(userName, password)
            .then(function () {
                console.log(user = ncmb.User.getCurrentUser());
                if (user.mailAddressConfirm) {
                    $(".login_None").hide();
                    $(".login_Collect").show();
                } else if (!user.mailAddressConfirm) {
                    $("#errormsg").html("メールアドレス認証を完了してください。");
                    ncmb.User.logout();
                } else {
                    $("#errormsg").html("エラー");
                    ncmb.User.logout();
                }
            })
            .catch(function (error) {
                console.log("ログイン失敗: " + error + ", " + JSON.stringify(error));
                $("#errormsg").html("アカウント名、パスワードが間違っています。");
            })
    }
});