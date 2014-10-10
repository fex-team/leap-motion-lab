/**
 * @fileOverview
 *
 * Leap motion 打拳检测
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

/* global Leap:true, console: true */
/* jshint browser: true*/

var AudioContext = window.AudioContext || window.webkitAudioContext;

var actx = new AudioContext();
var audio = document.getElementById('punch-audio');

actx.createMediaElementSource(audio).connect(actx.destination);


var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var counter = document.getElementById('counter');

function vectorLength(v) {
    return Math.sqrt(v.reduce(function(prev, curr) {
        return prev + curr * curr;
    }, 0));
}

function Fist(name) {
    this.name = name;

    // 当前状态: front(z < 0), back(z > 0)
    this.state = null;
}

Fist.prototype.action = function(hand) {
    var p = hand.palmPosition,
        v = hand.palmVelocity;

    if (this.state != 'back' && p[2] < -10) {
        this.state = 'back';
        if (this.onhit) this.onhit(p, v);
        return;
    }

    if (this.state != 'front' && p[2] > 10) {
        this.state = 'front';
    }
};

var left = new Fist('left');
var right = new Fist('right');
var punchs = [];

left.onhit = right.onhit = function(p, v) {
    audio.currentTime = 400;
    audio.play();
    punchs.push({
        position: p,
        power: vectorLength(v),
        life: 100
    });
    counter.textContent = ++counter.textContent;
};

var fists = {
    left: left,
    right: right
};

function renderPunchs() {
    var i = 0, punch;
    while(punchs[0] && punchs[0].life <= 0) punchs.shift();

    canvas.width = canvas.width;

    ctx.save();

    // 转换为 Leap Motion 坐标系
    ctx.translate(400, 500);
    ctx.scale(1, -1);


    while(punch = punchs[i++]) {
        ctx.beginPath();
        var r = punch.power * punch.life / 2000;
        var p = punch.position;
        ctx.arc(p[0] * 3, p[1], r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 0, 0, ' + (punch.life / 100) + ')';
        ctx.fill();
        punch.life -= 3;
    }

    ctx.restore();

    window.requestAnimationFrame(renderPunchs);
}

renderPunchs();

Leap.loop({
    hand: function (hand) {
        var type = hand.palmPosition[0] > 0 ? 'right' : 'left';
        fists[type].action(hand);
    }
});