let ApplicationKey = "ead0dc16ea2d507b8ba7bfdd4cfe7dfd4ab3178bcd752fbd01e579c7bb10c87b";
let Clientkey = "ac631805e7750958f96850a2f71dc542ac8a53febf494c2d9d5c7ef968aab7ad";
let ncmb = new NCMB(ApplicationKey, Clientkey);

let Dish = ncmb.DataStore("Dish");
let Hist = ncmb.DataStore("History");
let Food = ncmb.DataStore("Food");
let Genre = ncmb.DataStore("Genre");
let Favorite = ncmb.DataStore("Favorite")

let url = new URL(window.location.href);


$(".logout_Btn").find("button").click(function () {
    ncmb.User.getCurrentUser();
    ncmb.User.logout()
        .then(function (user) {
            console.log("ログアウト成功: " + JSON.stringify(user));
            $("#debug_Console").html("ログアウト成功: " + JSON.stringify(user));
            window.location.href = "./index.html";
        })
        .catch(function (error) {
            console.log("ログアウト失敗: " + error + ", " + JSON.stringify(error));
            $("#debug_Console").html("ログアウト失敗: " + error + ", " + JSON.stringify(error));
        })
});


function getCurrentUser() {
    let currentUser = ncmb.User.getCurrentUser();
    if (currentUser) {
        $("#debug_Console").html("カレントユーザー取得成功: " + JSON.stringify(currentUser));
    } else {
        $("#debug_Console").html("未ログインの状態またはカレントユーザー取得失敗");
    }
}

$('.slider').slick({
    autoplay: true,//自動的に動き出すか。初期値はfalse。
    infinite: true,//スライドをループさせるかどうか。初期値はtrue。
    slidesToShow: 1,//スライドを画面に3枚見せる
    slidesToScroll: 1,//1回のスクロールで3枚の写真を移動して見せる
    prevArrow: '<div class="slick-prev"></div>',//矢印部分PreviewのHTMLを変更
    nextArrow: '<div class="slick-next"></div>',//矢印部分NextのHTMLを変更
    dots: true,//下部ドットナビゲーションの表示
});


// トップページ読み込み時処理 ここから
function TopPageLoaded(currentUser) {
    rank_view();
    rand_view();
    Browsing_History(currentUser);
}
// ランキング画像表示
function rank_view() {
    Dish.order("accessN", true).limit(3)
        .fetchAll()
        .then(function (result) {
            for (let i = 0; i < 3; i++) {
                $("#top_Ranking_" + (i + 1)).find("img").attr("src", result[i].get("imageURL"));
                $("#top_Ranking_" + (i + 1)).find("a").attr("href", "cooking-recipe.html?recipe=" + result[i].get("objectId"));
            }
        })
    Dish.order("favoriteN", true).limit(3)
        .fetchAll()
        .then(function (result) {
            for (let i = 0; i < 3; i++) {
                $("#top_Review_" + (i + 1)).find("img").attr("src", result[i].get("imageURL"));
                $("#top_Review_" + (i + 1)).find("div").html(result[i].get("name"));
                $("#top_Review_" + (i + 1)).find("a").attr("href", "cooking-recipe.html?recipe=" + result[i].get("objectId"));
            }
        })
        .catch(function (error) {
            console.log("エラー: " + error + ", " + JSON.stringify(error));
        })
}

// すべてのランキング表示
function all_rank_view(Sort) {
    Dish.order("accessN", Sort)
        .fetchAll()
        .then(function (results) {
            dom = "";
            let count = 0
            if (Sort === true) {
                count = 0;
            } else {
                count = results.length + 1;
            }
            for (const result of results) {
                if (Sort === true) {
                    count++;
                    if (count === 1) {
                        dom += '<div class="recipe_infos">' +
                            '<div class="ranking ranking_1st">' + count + '位</div>' +
                            "<div class=\"recipes\">" +
                            "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                            "<div class=\"cuisine_Details\">" +
                            "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                            "<p>" + result.get("introduction") + "</p>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    } else {
                        dom += '<div class="recipe_infos">' +
                            '<div class="ranking">' + count + '位</div>' +
                            "<div class=\"recipes\">" +
                            "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                            "<div class=\"cuisine_Details\">" +
                            "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                            "<p>" + result.get("introduction") + "</p>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    }
                } else if (Sort === false) {
                    count--;
                    if (count === 1) {
                        dom += '<div class="recipe_infos">' +
                            '<div class="ranking ranking_1st">' + count + '位</div>' +
                            "<div class=\"recipes\">" +
                            "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                            "<div class=\"cuisine_Details\">" +
                            "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                            "<p>" + result.get("introduction") + "</p>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    } else {
                        dom += '<div class="recipe_infos">' +
                            '<div class="ranking">' + count + '位</div>' +
                            "<div class=\"recipes\">" +
                            "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                            "<div class=\"cuisine_Details\">" +
                            "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                            "<p>" + result.get("introduction") + "</p>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                    }
                }
            }
            $("#all_Rankings_List").html(dom);
        })
        .catch(function (error) {
            console.log("エラー: " + error + ", " + JSON.stringify(error));
        })
}
// ランキングフィルター
$("#ranking_Filter_Sort_AtoZ").click(function () {
    let Sort = true;
    $("#ranking_Filter_Sort_AtoZ").prop('disabled', true);
    $("#ranking_Filter_Sort_ZtoA").prop('disabled', false);
    all_rank_view(Sort);
})
$("#ranking_Filter_Sort_ZtoA").click(function () {
    let Sort = false;
    $("#ranking_Filter_Sort_AtoZ").prop('disabled', false);
    $("#ranking_Filter_Sort_ZtoA").prop('disabled', true);
    all_rank_view(Sort);
})

// ランダム画像表示
function rand_view() {
    Dish.fetchAll()
        .then(function (result) {
            for (let i = 0; i < 4; i++) {
                $("#slider_img_" + (i + 1)).find("img").attr("src", result[i].get("imageURL"));
                $("#slider_img_" + (i + 1)).attr("href", "cooking-recipe.html?recipe=" + result[i].get("objectId"));
            }
        })
        .catch(function (error) {
            console.log("エラー: " + error + ", " + JSON.stringify(error));
        })
}

// 履歴表示
function Browsing_History(currentUser) {
    if (currentUser) {
        Hist.equalTo("user_Objectid", currentUser.get("objectId"))
            .order("updateDate", true).include("dish_Pointer").limit(4)
            .fetchAll()
            .then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    $("#browsing_History_" + (i + 1)).find("img").attr("src", result[i].get("dish_Pointer").imageURL);
                    $("#browsing_History_" + (i + 1)).find("a").attr("href", "cooking-recipe.html?recipe=" + result[i].get("dish_Pointer").objectId);
                }
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    }
}

function Browsing_Favorite(currentUser) {
    if (currentUser) {
        Favorite.equalTo("user_Objectid", currentUser.get("objectId"))
            .order("updateDate", true).include("dish_Pointer").limit(4)
            .fetchAll()
            .then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    $("#favorite_" + (i + 1)).find("img").attr("src", result[i].get("dish_Pointer").imageURL);
                    $("#favorite_" + (i + 1)).find("a").attr("href", "cooking-recipe.html?recipe=" + result[i].get("dish_Pointer").objectId);
                }
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    }
}

// トップページ読み込み時処理 ここまで


// 名前検索
$("#search_Btn").click(function () {
    serchtext = $(".header_Search_Container").find("input").val();
    if (serchtext != "") {
        location.replace("search_result.html?search=" + serchtext)
    }
});
$('input[type="search"]').keydown(function (e) {
    serchtext = $(".header_Search_Container").find("input").val();
    const key = e.code;
    if (key === "Enter") {
        if (serchtext != "") {
            location.replace("search_result.html?search=" + serchtext)
        }
    }
});


// 検索結果ページ読み込み時処理
function ResultLoaded(Sort) {
    let search = url.searchParams.get("search");
    let keyword = url.searchParams.get("keyword");

    if (search !== null) {
        $("#search_Result").html("「" + search + "」の検索結果");
        Dish.regularExpressionTo("name", "^.*" + search + ".*$")
            .order("kanamoji_Name", Sort)
            .fetchAll()
            .then(function (results) {
                dom = "";
                for (const result of results) {
                    dom += "<div class=\"recipes\">" +
                        "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                        "<div class=\"cuisine_Details\">" +
                        "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                        "<p>" + result.get("introduction") + "</p>" +
                        "</div>" +
                        "</div>";
                }
                $("#search_Result_List").html(dom);
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    } else if (keyword !== null) {
        $("#search_Result").html("「" + keyword + "」の検索結果");
        var sq = Genre.equalTo("name", keyword);
        Dish.inQuery("genre_Pointer", sq)
            .order("kanamoji_Name", Sort)
            .fetchAll()
            .then(function (results) {
                dom = "";
                for (const result of results) {
                    dom += "<div class=\"recipes\">" +
                        "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                        "<div class=\"cuisine_Details\">" +
                        "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                        "<p>" + result.get("introduction") + "</p>" +
                        "</div>" +
                        "</div>";
                }
                $("#search_Result_List").html(dom);
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    } else {
        $("#search_Result").html("料理一覧");
        Dish.order("kanamoji_Name", Sort)
            .fetchAll()
            .then(function (results) {
                dom = "";
                for (const result of results) {
                    dom += "<div class=\"recipes\">" +
                        "<a href =\"cooking-recipe.html?recipe=" + result.get("objectId") + "\"><img src=\"" + result.get("imageURL") + "\" alt=\"\" /></a>" +
                        "<div class=\"cuisine_Details\">" +
                        "<h2><a href=\"cooking-recipe.html?recipe=" + result.get("objectId") + "\">" + result.get("name") + "</a></h2>" +
                        "<p>" + result.get("introduction") + "</p>" +
                        "</div>" +
                        "</div>";
                }
                $("#search_Result_List").html(dom);
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    }
}
// 検索フィルター
$("#search_Filter_Sort_AtoZ").click(function () {
    let Sort = true;
    $("#search_Filter_Sort_AtoZ").prop('disabled', true);
    $("#search_Filter_Sort_ZtoA").prop('disabled', false);
    ResultLoaded(Sort);
})
$("#search_Filter_Sort_ZtoA").click(function () {
    let Sort = false;
    $("#search_Filter_Sort_AtoZ").prop('disabled', false);
    $("#search_Filter_Sort_ZtoA").prop('disabled', true);
    ResultLoaded(Sort);
})


function HistorySave(currentUser) {
    // 履歴保存
    let recipeId = url.searchParams.get("recipe");
    if (currentUser) {
        var sq = Dish.equalTo("objectId", recipeId);
        Hist.equalTo("user_Objectid", currentUser.get("objectId"))
            .inQuery("dish_Pointer", sq)
            .fetch()
            .then(function (results) {
                console.log(JSON.stringify(results));
                if (Object.keys(results).length == 0) {
                    console.log("履歴なし");
                    let dish = new Dish({ objectId: recipeId });
                    let history = new Hist;
                    history
                        .set("user_Objectid", currentUser.get("objectId")).set("dish_Pointer", dish)
                        .save()
                        .catch(function (error) {
                            console.log(JSON.stringify(error));
                        })
                } else {
                    console.log("履歴あり");
                    results.set("user_Objectid", currentUser.get("objectId"));
                    return results.update();
                }
            })
            .catch(function (error) {
                console.log("エラー: " + error + ", " + JSON.stringify(error));
            })
    }

    // アクセス数加算
    Dish.equalTo("objectId", recipeId).fetch()
        .then(function (dish) {
            dish.setIncrement("accessN", 1)
                .update()
                .catch(function (error) {
                    console.log(JSON.stringify(error));
                });
        })
        .catch(function (error) {
            console.log("エラー: " + error + ", " + JSON.stringify(error));
        })

    if (currentUser) {
        // お気に入り自動チェック
        sq = Dish.equalTo("objectId", url.searchParams.get("recipe"));
        Favorite.equalTo("user_Objectid", currentUser.get("objectId"))
            .inQuery("dish_Pointer", sq)
            .fetch()
            .then(function (data) {
                console.log(Object.keys(data).length);
                if (Object.keys(data).length == 0) {
                    $('#favorite').prop('checked', false);
                } else {
                    $('#favorite').prop('checked', true);
                }
            })
    }

    // お気に入り登録・解除
    $("#favorite").change(function (e) {

        console.log($("#favorite").is(':checked'));
        if ($("#favorite").is(':checked')) {
            let favorite = new Favorite();
            const dish = new Dish({ objectId: url.searchParams.get("recipe") });

            favorite.set("dish_Pointer", dish)
                .set("user_Objectid", currentUser.get("objectId"))
                .save()
                .catch(function (error) {
                    console.log("エラー: " + error + ", " + JSON.stringify(error));
                })

            Dish.equalTo("objectId", url.searchParams.get("recipe")).fetch()
                .then(function (dish) {
                    dish.setIncrement("favoriteN", 1)
                        .update()
                        .catch(function (error) {
                            console.log(JSON.stringify(error));
                        });
                })
                .catch(function (error) {
                    console.log("エラー: " + error + ", " + JSON.stringify(error));
                })

        } else {
            let sq = Dish.equalTo("objectId", url.searchParams.get("recipe"));

            Favorite.equalTo("user_Objectid", currentUser.get("objectId"))
                .inQuery("dish_Pointer", sq)
                .fetch()
                .then(function (data) {
                    data.delete()
                        .catch(function (error) {
                            console.log("エラー: " + error + ", " + JSON.stringify(error));
                        })
                })
            Dish.equalTo("objectId", url.searchParams.get("recipe")).fetch()
                .then(function (dish) {
                    dish.setIncrement("favoriteN", -1)
                        .update()
                        .catch(function (error) {
                            console.log(JSON.stringify(error));
                        });
                })
                .catch(function (error) {
                    console.log("エラー: " + error + ", " + JSON.stringify(error));
                })
        }
    });

    //     $("#favorite").change(function (e) {
    //         var relation = new ncmb.Relation();
    //         let dish = new Dish({ objectId: (url.searchParams.get("recipe")) });

    //         console.log($("#favorite").is(':checked'));
    //         if ($("#favorite").is(':checked')) {
    //             relation.add(dish);

    //             let user = new ncmb.User();
    //             console.log(currentUser.get("objectId"));
    //             user.set("objectId", currentUser.get("objectId"))
    //                 .set("favorite_Relation", relation)
    //                 .update()
    //                 .catch(function (err) {
    //                     console.log(JSON.stringify(err));
    //                 })
    //         } else {
    //             relation.remove(dish);

    //             let User = new ncmb.User();
    //             console.log(currentUser.get("objectId"));
    //             User.set("objectId", currentUser.get("objectId"))
    //                 .set("favorite_Relation", relation)
    //                 .update()
    //                 .catch(function (err) { console.log(JSON.stringify(err)); })
    //         }
    //     });
}

// パラメーター設定 (recipeにtestをつける)
// if (!url.searchParams.get("recipe")) {
//     url.searchParams.append("recipe", "test");
//     location.href = url;
// } else {
//     console.log(url.searchParams.get("recipe")); // test
// }

// パラメーター取得
// let parameter = url.searchParams.get("recipe"); //レシピのobjectid
// if (url.searchParams.get("recipe") === parameter) {
//     fetch(recipefile)
//         .then(response => response.json())
//         .then(data => formatJSON(data));
// }

function loadRecipe() {
    let parameter = url.searchParams.get("recipe");
    Dish.equalTo("objectId", parameter)
        .fetch()
        .then(function (result) {
            $("#cooking_Info").find("img").attr("src", result.imageURL)
            formatJSON(result.recipe);
            document.getElementById("number_Of_People").addEventListener("change", function () {
                let num = parseFloat($("#number_Of_People").val());

                let html_ingredient = "";
                let html_amounts = "";

                // 材料取得
                for (let ingredient of result.recipe.ingredients) {
                    html_ingredient += ingredient.name + "\n";

                    let amount = ingredient.amount * num;
                    let unit = ingredient.unit;
                    if (unit == "大さじ" || unit == "小さじ") {
                        html_amounts += unit + amount + "\n";
                    } else if (unit == "g" || unit == "ml") {
                        html_amounts += amount + unit + "\n";
                    } else if (unit == "少々") {
                        html_amounts += unit + "\n";
                    } else {
                        html_amounts += "\n";
                    }
                }
                $("#cooking_Ingredient").find("p").eq(0).html(html_ingredient);
                $("#cooking_Ingredient").find("p").eq(1).html(html_amounts);

                // 調味料取得
                html_ingredient = "";
                html_amounts = "";

                for (let seasoning of result.recipe.seasonings) {
                    html_ingredient += seasoning.name + "\n";

                    let amount = seasoning.amount * num;
                    let unit = seasoning.unit;
                    if (unit == "大さじ" || unit == "小さじ") {
                        html_amounts += unit + amount + "\n";
                    } else if (unit == "g" || unit == "ml") {
                        html_amounts += amount + unit + "\n";
                    } else if (unit == "少々") {
                        html_amounts += unit + "\n";
                    } else {
                        html_amounts += "\n";
                    }
                }

                $("#cooking_Seasoning").find("p").eq(0).html(html_ingredient);
                $("#cooking_Seasoning").find("p").eq(1).html(html_amounts);

            })
        })
        .catch(function (error) {
            console.log("エラー: " + error + ", " + JSON.stringify(error));
        })
}

// JSONオブジェクトの取得
function formatJSON(data) {
    $("#cooking_Name").html(data.recipename);

    let html_ingredient = "";
    let html_amounts = "";

    // 材料取得
    for (let ingredient of data.ingredients) {
        html_ingredient += ingredient.name + "\n";

        let amount = ingredient.amount;
        let unit = ingredient.unit;
        if (unit == "大さじ" || unit == "小さじ") {
            html_amounts += unit + amount + "\n";
        } else if (unit == "g" || unit == "ml") {
            html_amounts += amount + unit + "\n";
        } else if (unit == "少々") {
            html_amounts += unit + "\n";
        } else {
            html_amounts += "\n";
        }
    }
    $("#cooking_Ingredient").find("p").eq(0).html(html_ingredient);
    $("#cooking_Ingredient").find("p").eq(1).html(html_amounts);

    // 調味料取得
    html_ingredient = "";
    html_amounts = "";

    for (let seasoning of data.seasonings) {
        html_ingredient += seasoning.name + "\n";

        let amount = seasoning.amount;
        let unit = seasoning.unit;
        if (unit == "大さじ" || unit == "小さじ") {
            html_amounts += unit + amount + "\n";
        } else if (unit == "g" || unit == "ml") {
            html_amounts += amount + unit + "\n";
        } else if (unit == "少々") {
            html_amounts += unit + "\n";
        } else {
            html_amounts += "\n";
        }
    }

    $("#cooking_Seasoning").find("p").eq(0).html(html_ingredient);
    $("#cooking_Seasoning").find("p").eq(1).html(html_amounts);

    let html_detail = "";
    for (let detail of data.details) {
        html_detail += "<p>" + detail + "</p><br>";
    }

    $("#cooking_Details").find("p").eq(0).html(html_detail);
}



//画面読み込み時実行
$(function () {
    let currentUser = ncmb.User.getCurrentUser();
    let page = location.pathname;

    // ログインしているか非ログイン化判断
    if (currentUser != null) {
        $(".login_Btn").hide();
        $(".sign_Up_Btn").hide();
    } else {
        $(".logout_Btn").hide();
        $(".mypage_Btn").hide();
        $(".top_Browsing_History_Outer").hide();
    }

    // ページの判断、処理内容
    switch (page) {
        case "/":
        case "/index.html":
            TopPageLoaded(currentUser);
            break;
        case "/search_result.html":
            ResultLoaded();
            break;
        case "/cooking-recipe.html":
            // ログインしているか非ログイン化判断
            if (currentUser != null) {
                // 仮
            } else {
                $(".favorite_Btn").hide();
            }
            loadRecipe();
            HistorySave(currentUser);

            break;
        case "/mypage.html":
            user_Icon();
            user_Banner();
            mypage_Info();
            Browsing_History(currentUser);
            Browsing_Favorite(currentUser)

            roleSearch();

            break;
        case "/view-ranking.html":
            all_rank_view(true);
            break;
        default:
            break;
    }

    // userの拡張
    ncmb.User.isBelongTo = function (role) {
        me = ncmb.User.getCurrentUser();
        return new Promise(function (res, rej) {
            ncmb.request({
                path: "/" + ncmb.version + "/users",
                query: {
                    where: JSON.stringify({
                        "objectId": me.objectId,
                        "$relatedTo": {
                            "object": {
                                "__type": "Pointer",
                                "className": "role",
                                "objectId": role.objectId
                            },
                            "key": "belongUser"
                        }
                    })
                }
            })
                .then(function (ary) {
                    var json = JSON.parse(ary).results;
                    res(json.length == 1);
                })
                .catch(function (e) {
                    rej(e);
                });
        })
    }

    function roleSearch() {
        if (currentUser) {
            ncmb.Role.equalTo("roleName", "moderator")
                .fetch()
                .then(function (role) {
                    ncmb.User.isBelongTo(role)
                        .then(function (result) {
                            if (result) {
                                $("#admin_Content").show();
                            } else {
                                $("#admin_Content").hide();
                            }
                        }, function (err) {
                            console.log("取得失敗: ", err);
                        })
                })
                .catch(function (error) {
                    console.log("エラー: " + error + ", " + JSON.stringify(error));
                });
        }
    }


    //レスポンシブ時のメニュー
    let menu_toggle = $('input[name="menu_Toggle"]');
    menu_toggle.change(function () {
        $(".side_Content").toggleClass("active");
        $(".overlay_Menu_Btn_Outer").toggleClass("active");
        if (menu_toggle.prop("checked")) {
            $(".menu_Btn_Inner").find("i").removeClass("fa-angles-left").addClass("fa-angles-right");
        } else {
            $(".menu_Btn_Inner").find("i").removeClass("fa-angles-right").addClass("fa-angles-left");
        }
    })
});

// =================//
// マイページ関連
// =================//
$("#user_Icon_Set_Button").click(function () {
    let user = ncmb.User.getCurrentUser();
    let fileData = document.getElementById("icon_File_Data").files[0];
    // let file_Input = $('[name="user_Icon_Set"]').files[0];
    ncmb.File.upload(user.objectId + "_Icon", fileData)
        .then(function (res) {
            // 成功処理
            console.log(res + JSON.stringify(res));
            alert("アップロードが完了しました。");
            user_Icon();
        })
        .catch(function (err) {
            // エラー処理
            console.log(err + JSON.stringify(err));
            alert("アップロードに失敗しました。");
        });
});

$("#user_Banner_Set_Button").click(function () {
    let user = ncmb.User.getCurrentUser();
    let fileData = document.getElementById("banner_File_Data").files[0];
    // let file_Input = $('[name="user_Banner_Set"]').files[0];
    ncmb.File.upload(user.objectId + "_Banner", fileData)
        .then(function (res) {
            // 成功処理
            console.log(res + JSON.stringify(res));
            alert("アップロードが完了しました。");
            user_Banner();
        })
        .catch(function (err) {
            // エラー処理
            console.log(err + JSON.stringify(err));
            alert("アップロードに失敗しました。");
        });
});

function mypage_Info() {
    let user = ncmb.User.getCurrentUser();
    $("#user_Name").text(user.userName + " さん");

    Favorite.equalTo("user_Objectid", user.objectId).count()
        .fetchAll()
        .then(function (data) {
            $("#user_Rated").text(data.count + "いいね");
        })

    $("#table_User_Name").text(user.userName);
    $("#table_User_Email").text(user.mailAddress);
}


function user_Icon() {
    let reader = new FileReader();
    reader.onload = function () {
        let dataUrl = reader.result;
        $("#user_Icon").attr("src", dataUrl)
    }

    // ファイル名からファイルを取得
    let user = ncmb.User.getCurrentUser();
    let fileName = user.objectId + "_Icon";

    // ダウンロード（データ形式にblobを指定）
    ncmb.File.download(fileName, "blob")
        .then(function (blob) {
            // ファイルリーダーにデータを渡す
            reader.readAsDataURL(blob);
        })
        .catch(function (err) {
            console.log(err + JSON.stringify(err));
        })
}

function user_Banner() {
    let reader = new FileReader();
    reader.onload = function () {
        let dataUrl = reader.result;
        $("#user_Banner").attr("src", dataUrl)
    }

    // ファイル名からファイルを取得
    let user = ncmb.User.getCurrentUser();
    let fileName = user.objectId + "_Banner";

    // ダウンロード（データ形式にblobを指定）
    ncmb.File.download(fileName, "blob")
        .then(function (blob) {
            // ファイルリーダーにデータを渡す
            reader.readAsDataURL(blob);
        })
        .catch(function (err) {
            console.log(err + JSON.stringify(err));
        })
}

// =================//
// ユーザー名変更関連
// =================//

$("#name_Change_Logout_Submit").click(function () {
    ncmb.User.getCurrentUser();
    ncmb.User.logout() //ログアウトさせる
        .then(function (user) {
            $(".logout_None").hide();
            $(".login_None").show();
            $(".login_Btn").show();
        })
        .catch(function (error) {
            console.log("ログアウト失敗: " + error + ", " + JSON.stringify(error));
            $(".logout_Submit").find("p").html("ログアウトに失敗してしまいました。時間をおいてもう一度お願いいたします。 ");
        })
});

$("#change_Id_Btn").click(function () {
    let user = ncmb.User.getCurrentUser()
    let oldAccountId = $("#old_Account_Id").val();
    let newAccountId = $("#new_Account_Id").val();
    if (oldAccountId !== "" && newAccountId !== "") { //入力チェック
        if (user.userName === oldAccountId) { //変更前のものと同じかチェック
            user.set("userName", newAccountId) //新しい名前をセット
                .update() //適応
                .then(function () {
                    console.log("変更成功");
                    $(".login_Collect").hide();
                    $(".change_Collect").show();
                    ncmb.User.logout(); //ログアウトさせる
                })
                .catch(function (error) {
                    console.log("ユーザー名変更失敗: " + error + ", " + JSON.stringify(error));
                    $("#errormsg").html("ユーザー名の変更に失敗してしまいました。時間をおいてもう一度お願いいたします。 ");
                })
        } else {
            $("#errormsg").html("正しい元のアカウント名を入力してください。");
        }
    } else {
        $("#errormsg").html("必須項目の入力がされていません。");
    }
});

