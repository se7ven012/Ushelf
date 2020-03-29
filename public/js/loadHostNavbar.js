$.get("/nav.html", function(data) {
    $("#nav-placeholder").replaceWith(data);
});

$.get("/footer.html", function(data) {
    $("#footer-placeholder").replaceWith(data);
});