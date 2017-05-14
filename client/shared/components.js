const $ = require('jquery');

/*
 * shows gmail style confirmation box and gives callback on confirm and cancel
 * @params type confirm Shows confirmation box with ok and cancel
 * @params type alert shows alert box with ok button
 * @params data {text:"", head:""} text is body and head is header
 */
function confirmationBox(type, data, context, callback) {
    var popup = $("#popup")
    if (popup.length == 0) {
        popup = $("<div/>", {
            "id": "popup",
            "style": "display:block;z-index:4000"
        }).appendTo($('body'))
    }
    $("#popup").empty()
    var pop = $("<div/>", {
        "style": "position: absolute;top: 0;width: 100% ;background: rgba(255, 255, 255, 0.5);height: 100%;"
    }).appendTo($("#popup"))
    var modal_dialogue = $("<div/>", {
        "class": "modal_dialogue",
        "style": "margin: 0 auto;width: 40%;margin-top: 10%;background: white;box-shadow: 0 4px 16px rgba(0, 0, 0, .2);"
    }).appendTo(pop)

    var head = $("<div/>", {
        "style": "background: #A0A0A0;color: #fff;padding: 20px;"
    }).appendTo(modal_dialogue)
    $("<span/>", {
        "class": "fa fa-lg pull-right",
        "style":"color:#ccc;cursor:pointer;",
        "html": "&times;",
        "click": function() {
            if(callback) {
                callback("cancel", context)
            }
            $("#popup").empty()
            $("#popup").hide()
        }
    }).appendTo(head)
    $("<span/>", {
        "style": "font-weight:bold",
        "text": data.head || "Error"
    }).appendTo(head)

    var textCont = $("<div/>", {
    }).appendTo(modal_dialogue)
    $("<div/>", {
        "style":"padding:20px",
        "text": data.text
    }).appendTo(textCont)

    var but = $("<div/>", {
        "style":"padding: 10px 20px;text-align: right;",
    }).appendTo(textCont)

    if (type === "confirm") {
        $("<button/>", {
            "class": "btn btn-info",
            "text": "Confirm",
            "click": function() {
                if(callback) {
                    callback("confirm", context)
                }
                $("#popup").empty()
                $("#popup").hide()
                    // modal_dialogue.remove()
            }
        }).appendTo(but)
        $("<button/>", {
            "class": "btn btn-info",
            "text": "Cancel",
            "click": function() {
                if(callback) {
                    callback("cancel", context)
                }
                $("#popup").empty()
                $("#popup").hide()
                    // modal_dialogue.remove()
            }
        }).appendTo(but)
    } else if (type === "alert") {
        $("<button/>", {
            "class": "btn btn-info",
            "text": "Ok",
            "click": function() {
                if(callback) {
                    callback("confirm", context)
                }
                $("#popup").empty()
                $("#popup").hide()
                    // modal_dialogue.remove()
            }
        }).appendTo(but)
    }
    $("#popup").show();
}



module.exports = {
    confirmationBox: confirmationBox
}
