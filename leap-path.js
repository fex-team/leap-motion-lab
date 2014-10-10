/**
 * @fileOverview
 *
 * Leap motion 体感轨迹
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

/* global Leap:true, console: true */
/* jshint browser: true*/
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

ctx.translate(400, 500);
ctx.scale(1, -1);

var lastPosition;

Leap.loop({
    hand: function (hand) {
        var indexFingerTipPosition = hand.indexFinger.tipPosition;
        var z = indexFingerTipPosition[2];
        indexFingerTipPosition = indexFingerTipPosition.slice(0, 2);
        if (lastPosition && z < 30) {
            ctx.beginPath();
            ctx.moveTo.apply(ctx, lastPosition);
            ctx.lineTo.apply(ctx, indexFingerTipPosition);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }
        lastPosition = indexFingerTipPosition;
    }
});