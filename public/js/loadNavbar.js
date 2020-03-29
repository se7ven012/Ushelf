if (sessionStorage.getItem("sessionUserID") != null) {
    $.get("nav_login.html", function(data) {
        $("#nav-placeholder").replaceWith(data);
    });
} else {
    $.get("nav.html", function(data) {
        $("#nav-placeholder").replaceWith(data);
    });
}