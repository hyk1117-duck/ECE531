Raphael.fn.drawGrid = function(x, y, w, h, wv, hv, color) {
    //test
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({
        stroke: color
    });
};


window.onload = function() {
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
    // Grab the data
    var labels = [0, 20, 40, 60, 80, 100],
        data = ["80", "25", "27", "40", "8", "29", "7", "33", "56", "25", "1", "78", "70", "68", "2"];

    // $("#data tfoot th").each(function () {
    //     labels.push($(this).html());
    // });
    // $("#data tbody td").each(function () {
    //     data.push($(this).html());
    // });
    // Draw
    var width = 580,
        height = 330,
        leftgutter = 30,
        bottomgutter = 20,
        topgutter = 20,
        // colorhue = .6 || Math.random(),
        // color = "hsl(" + [colorhue, .5, .5] + ")",
        r = Raphael("holder", width, height),
        txt = {
            font: '12px Helvetica, Arial',
            fill: "#000"
        },
        txt1 = {
            font: '14px Helvetica, Arial',
            fill: "#000"
        },
        txt2 = {
            font: '12px Helvetica, Arial',
            fill: "#000"
        },
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;
    r.drawGrid(leftgutter + X * .5 + .5, topgutter, width - leftgutter - X, height - topgutter - bottomgutter, 0, 5, "#ccc");

    var path;
    path = r.path()
        .attr({
        stroke: "#4DBDD4",
        "stroke-width": 4,
        "stroke-linejoin": "round"
    });
    var bgp = r.path().attr({
        stroke: "none",
        opacity: .8,
        fill: "#C5EDF1"
    });
    // label = r.set(),
    // lx = 0,
    // ly = 0,
    // is_label_visible = false,
    // leave_timer,
    // blanket = r.set();
    // label.push(r.text(60, 12, "24 hits").attr(txt));
    // label.push(r.text(60, 27, "22 September 2008").attr(txt1).attr({
    //     fill: color
    // }));
    // label.hide();
    // var frame = r.popup(100, 100, label, "right").attr({
    //     fill: "#000",
    //     stroke: "#666",
    //     "stroke-width": 2,
    //     "fill-opacity": .7
    // }).hide();
    var dbtext = r.text(X * .5 + 30, 6, "dB").attr(txt1);

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5)),
            t = r.text(X * .5 + 10, 28 * (6 - i) * 2 - 30, labels[i]).attr(txt);
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            //    console.log(X0, Y0, X2, Y2, x, y, X, Y);
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        // var dot = r.circle(x, y, 4).attr({
        //     fill: "#333",
        //     stroke: color,
        //     "stroke-width": 2
        // });
        // blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({
        //     stroke: "none",
        //     fill: "#fff",
        //     opacity: 0
        // }));
        // var rect = blanket[blanket.length - 1];
        // (function(x, y, data, lbl) {
        //     var timer, i = 0;
        //     rect.hover(function() {
        //         clearTimeout(leave_timer);
        //         var side = "right";
        //         if (x + frame.getBBox().width > width) {
        //             side = "left";
        //         }
        //         var ppp = r.popup(x, y, label, side, 1),
        //             anim = Raphael.animation({
        //                 path: ppp.path,
        //                 transform: ["t", ppp.dx, ppp.dy]
        //             }, 200 * is_label_visible);
        //         lx = label[0].transform()[0][1] + ppp.dx;
        //         ly = label[0].transform()[0][2] + ppp.dy;
        //         frame.show().stop().animate(anim);
        //         label[0].attr({
        //             text: data + " hit" + (data == 1 ? "" : "s")
        //         }).show().stop().animateWith(frame, anim, {
        //             transform: ["t", lx, ly]
        //         }, 200 * is_label_visible);
        //         label[1].attr({
        //             text: lbl + " September 2008"
        //         }).show().stop().animateWith(frame, anim, {
        //             transform: ["t", lx, ly]
        //         }, 200 * is_label_visible);
        //         is_label_visible = true;
        //     }, function() {
        //         leave_timer = setTimeout(function() {
        //             frame.hide();
        //             label[0].hide();
        //             label[1].hide();
        //             is_label_visible = false;
        //         }, 1);
        //     });
        // })(x, y, data[i], labels[i]);
    }
    p = p.concat([x, y, x, y]);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({
        path: p
    });
    bgp.attr({
        path: bgpp
    });


    　
    var DrawArrow = function(paper, x, y, len, deltaAngle, fAngle, sLen) {
        //paper:Raphael对象，x:X坐标，y：Y坐标，len:大小，deltaAngle：旋转角度，fAngle：顶角角度，sLen:箭头尾部凹陷程度
        　
		len = len && typeof(len) == "number" && len > 0 ? len : 12;　　
		deltaAngle = deltaAngle && typeof(deltaAngle) == "number" ? deltaAngle : 0;　
		fAngle = fAngle && typeof(fAngle) == "number" && fAngle > 0 ? fAngle : 60;　　
		sLen = sLen && typeof(sLen) == "number" && sLen > 0 ? sLen : 0;

        　　
        var ltLen = Math.tan(Raphael.rad(fAngle / 2)) * len;　　
        var ltX = x + len;
        var ltY = y - ltLen;
        var rtLen = ltLen;　　
        var rtX = x + len;　　
        var rtY = y+rtLen;　　
        var ctX = x + len-sLen;　　
        var ctY = y ;


        // var ltX = x - ltLen;　　
        // var ltY = y - len;
        // var rtLen = ltLen;　　
        // var rtX = x + rtLen;　　
        // var rtY = ltY;　　
        // var ctX = x;　　
        // var ctY = ltY + sLen;　　
        var arrowPath = "M" + x + "," + y + "L" + ltX + "," + ltY +  "L" + ctX + "," + ctY +"L" + rtX + "," + rtY + "L" + x + "," + y + "Z";　　
        var arrow = paper.path(arrowPath).attr({
            stroke: "#e29d36",
            fill: "#e29d36"
        });　　
       arrow.rotate(deltaAngle, x, y);　　
        return arrow;　　
    };　　

    var swidth = width - 160;
    var tt = r.path("M97,101h," + swidth).attr({
        'stroke': "#FFA600",
        "stroke-width": 2,
        'stroke-dasharray': '-'
    });
    var rightborder = r.path("M536,21v,290").attr({
        "fill": "#4DBDD4",
        "stroke-width": 3,
        'stroke': "#4DBDD4"
    });
    var arrow = DrawArrow(r, 537, 136, 14).glow({
        "width": 1,
        "offsetx": 0,
        "offsety": 1
    });
    var aa = p.join(" ");
    var ab = "M50,100h," + width;
    var ac = Raphael.pathIntersection(aa, ab);


    console.log(ac);
    var totoleLength = Math.ceil(Raphael.getTotalLength(p));
    var startpoint = path.getPointAtLength(0);
    var endpoint = path.getPointAtLength(totoleLength);
    // var endpoint = Raphael.getPointAtLength(p, totoleLength);
    console.log(totoleLength);
    console.log(startpoint);
    console.log(endpoint);


    var xarray = [];
    console.log(Math.ceil(startpoint.y));
    console.log(Math.ceil(endpoint.y));
    console.log(Math.ceil(ac[0].y));
    if (Math.ceil(startpoint.y) < Math.ceil(ac[0].y)) {
        xarray.push(Math.ceil(startpoint.x));
    }
    for (var i = 0; i < ac.length; i++) {
        xarray.push(Math.ceil(ac[i].x));
    }
    if (Math.ceil(endpoint.y) < Math.ceil(ac[0].y)) {
        xarray.push(Math.ceil(endpoint.x));
    }
    console.log(xarray);
    var redPath = [];
    // for(var i=0;i<xarray.length;i=i+2)
    // {
    redPath = redPath.concat(path.getSubpath(0, xarray[0]));
    // }
    //  console.log();
    //   var cc = [].concat(path.getSubpath(0, Math.ceil(totoleLength)));

    console.log(xarray);
    // var path1 = r.path().attr({
    //      stroke: "#fff",
    //     path: redPath,
    //     "stroke-width": 4,
    //     "stroke-linejoin": "round",
    //     x:22,
    //     y:50
    // });

    // frame.toFront();
    // label[0].toFront();
    //  label[1].toFront();
    //   blanket.toFront();
};