export default function drawCanvas(canvas, lineWidth, strokeStyle, nowX = 50, nowY = 55, sunrise = '07:14', sunset = '18:08') {
    if (!canvas) return;

    if (canvas) {
        canvas.height = canvas.height;
    }
    var ctx = canvas.getContext('2d');
    var moveToFunction = CanvasRenderingContext2D.prototype.moveTo;
    CanvasRenderingContext2D.prototype.moveToLocation = {};
    // 重新定义moveTo方法
    CanvasRenderingContext2D.prototype.moveTo = function (x, y) {
        this.moveToLocation.x = x;
        this.moveToLocation.y = y;
        moveToFunction.apply(this, [x, y]);
    };
    CanvasRenderingContext2D.prototype.dashedLineTo = function (x, y, dashedLength) {
        dashedLength = dashedLength === undefined ? 20 : dashedLength;
        var startX = this.moveToLocation.x;
        var startY = this.moveToLocation.y;
        var deltaX = x - startX;
        var deltaY = y - startY;
        var numberDash = Math.floor(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashedLength);
        for (var i = 0; i < numberDash; i++) {
            this[i % 2 === 0 ? 'moveTo' : 'lineTo'](startX + (deltaX / numberDash) * i, startY + (deltaY / numberDash) * i); //等同于this.moveTo(x, y)或者 this.LineTo(x, y)
        }
        // this.moveTo(x, y); //连续绘制虚线时，起点从当前点开始
    };
    //绘制虚线
    ctx.lineWidth = lineWidth || 3;
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(10, 83);
    ctx.font = 'normal 25px PingFangSC-Regular';
    ctx.fillStyle = '#fff';
    if (this.$t) {
        ctx.fillText(`${this.$t('common.sunrise')} ${sunrise}`, 10, 120);
    }
    ctx.arc(10, 83, 5, 2 * Math.PI, 0);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.dashedLineTo(30, 68);
    ctx.dashedLineTo(50, 55);
    ctx.dashedLineTo(70, 44);
    ctx.dashedLineTo(90, 35);
    ctx.dashedLineTo(110, 28);
    ctx.dashedLineTo(130, 23);
    ctx.dashedLineTo(150, 21);
    ctx.stroke();
    ctx.closePath();
    // 外圆环
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    // ctx.arc(150, 21, 20, 2 * Math.PI, 0);
    // ctx.arc(nowX, nowY, 20, 2 * Math.PI, 0);
    ctx.fillStyle = strokeStyle;
    ctx.fill();
    ctx.closePath();
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.dashedLineTo(170, 23);
    ctx.dashedLineTo(190, 28);
    ctx.dashedLineTo(210, 35);
    ctx.dashedLineTo(230, 44);
    ctx.dashedLineTo(250, 55);
    ctx.dashedLineTo(270, 68);
    ctx.dashedLineTo(290, 83);
    ctx.fillStyle = '#fff';
    if (this.$t) {
        ctx.fillText(`${this.$t('common.sunset')} ${sunset}`, 170, 120);
    }
    ctx.arc(290, 83, 5, 2 * Math.PI, 0);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.stroke();
}
export const timeOpions = [{
    time: "0",
    x: 10,
    y: 83
}, {
    time: "2",
    x: 30,
    y: 68
}, {
    time: "4",
    x: 50,
    y: 55
}, {
    time: "6",
    x: 70,
    y: 44
}, {
    time: "8",
    x: 90,
    y: 35
}, {
    time: "10",
    x: 130,
    y: 23
}, {
    time: "12",
    x: 150,
    y: 21
}, {
    time: "14",
    x: 170,
    y: 23
}, {
    time: "16",
    x: 210,
    y: 35
}, {
    time: "18",
    x: 230,
    y: 44
}, {
    time: "20",
    x: 250,
    y: 55
}, {
    time: "22",
    x: 270,
    y: 68
}, {
    time: "24",
    x: 290,
    y: 83
}];
