/**
 * Created by 根深 on 2015/8/29.
 */
function marquee(u_name, con_name, speed, line_height) {
    var height = document.getElementById(u_name).offsetHeight;

    var con = $(con_name);
    var top = 0;

    function Marquee() {
        if (top >= line_height) {
            con.css('top', 0 + "px");
            top = 0;
            var html = $(con_name).children()[0].innerHTML;
            con.children()[0].remove();
            con.append("<li>" + html + "</li>");
        } else {
            top += 1;
            con.css('top', (-top) + "px");
        }
    }
    return setInterval(Marquee, speed);
}
