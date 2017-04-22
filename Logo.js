/* tslint:disable:max-classes-per-file max-line-length */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector1 {
    constructor(x) {
        this.x = x;
    }
}
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(v) {
        if (typeof v === 'number') {
            return new Vector2(this.x + v, this.y + v);
        }
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        if (typeof v === 'number') {
            return new Vector2(this.x + -v, this.y + -v);
        }
        return new Vector2(this.x + -v.x, this.y + -v.y);
    }
    get normalized() {
        const magnitude = this.magnitude;
        return new Vector2(this.x / magnitude, this.y / magnitude);
    }
    get magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    get reversed() {
        return new Vector2(-this.x, -this.y);
    }
    dotProduct(v) {
        if (typeof v === 'number') {
            return this.x * v + this.y * v;
        }
        return this.x * v.x + this.y * v.y;
    }
    crossProduct(v) {
        if (typeof v === 'number') {
            return this.x * v - this.y * v;
        }
        return this.x * v.x - this.y * v.y;
    }
    multiply(v) {
        if (typeof v === 'number') {
            return new Vector2(this.x * v, this.y * v);
        }
        return new Vector2(this.x * v.x, this.y * v.y);
    }
}
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x + v, this.y + v, this.z + v);
        }
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    scale(factor) {
        return new Vector3(this.x * factor, this.y * factor, this.z * factor);
    }
}
class Logo {
    constructor(canvas, context, tension = 0) {
        this.padding = 100;
        this.canvas = canvas;
        this.context = context;
        this.scale = this.canvas.width / (330 + this.padding * 2);
        this.offset = new Vector2(this.padding - 5, (this.canvas.height / 2) / this.scale);
        const anchors = [
            // start
            new Vector3(-this.offset.x, 0, 0.3),
            // d
            new Vector3(40, 0, 0.3),
            new Vector3(0, -30, 1),
            new Vector3(50, -50, 0.3),
            new Vector3(30, 10, 0.3),
            new Vector3(60, -120, -1.5),
            new Vector3(50, 0, 1),
            // i
            new Vector3(70, -50, -1),
            new Vector3(60, 0, 0.3),
            // n
            new Vector3(70, 0, 1),
            new Vector3(80, -40, -1),
            new Vector3(110, -50, 0.5),
            new Vector3(100, 0, 0.3),
            // k
            new Vector3(110, 0, 1),
            new Vector3(130, -100, -2),
            new Vector3(125, -50, 0.3),
            new Vector3(160, -60, -2),
            new Vector3(115, -40, 0.3),
            new Vector3(144, 0, 0.3),
            // d
            new Vector3(190, -10, -1),
            new Vector3(150, -20, 2),
            new Vector3(195, -50, 1),
            new Vector3(180, 0, 0.3),
            new Vector3(215, -120, -1.5),
            new Vector3(195, 0, 0.5),
            // o
            new Vector3(230, -10, 0.5),
            new Vector3(245, -50, 0.5),
            new Vector3(215, -50, 0.5),
            new Vector3(205, -10, 0.5),
            // n
            new Vector3(235, 0, 0.3),
            new Vector3(245, -40, -1),
            new Vector3(275, -50, 0.5),
            new Vector3(265, 0, 0.3),
            // k
            new Vector3(275, 0, 1),
            new Vector3(295, -100, -2),
            new Vector3(290, -50, 0.3),
            new Vector3(325, -60, -2),
            new Vector3(280, -40, 0.3),
            new Vector3(309, 0, 0.3),
            // end
            new Vector3(330 + this.offset.x + 10, 0, 0.3)
        ];
        this.points = [];
        this.tensions = [];
        for (const i in anchors) {
            if (anchors.hasOwnProperty(i)) {
                this.points.push(new Vector2(anchors[i].x, anchors[i].y));
                this.tensions.push(new Vector1(anchors[i].z * tension));
            }
        }
        this.points = this.offsetAndScalePoints();
        this.draw();
    }
    offsetAndScalePoints() {
        const points = [];
        for (const i in this.points) {
            if (this.points.hasOwnProperty(i)) {
                const point = this.points[i];
                points.push(new Vector2((point.x + this.offset.x) * this.scale, (point.y + this.offset.y) * this.scale));
            }
        }
        return points;
    }
    draw() {
        const canvas = this.canvas;
        const context = this.context;
        const points = this.points;
        const tensions = this.tensions;
        const beziers = [];
        for (let i = 1, l = points.length - 1; i < l; i++) {
            const p0 = points[i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const q0Distance = p1.subtract(p0).magnitude;
            const q1Distance = p2.subtract(p1).magnitude;
            const tension = tensions[i].x;
            const fa = tension * q0Distance / (q0Distance + q1Distance);
            const fb = tension - fa;
            const q0 = p1.add(p0.subtract(p2).multiply(fa));
            const q1 = p1.subtract(p0.subtract(p2).multiply(fb));
            beziers.push({
                endControlPoint: q0,
                endPoint: p1,
                startControlPoint: q1,
                startPoint: p0
            });
        }
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        context.quadraticCurveTo(beziers[0].endControlPoint.x, beziers[0].endControlPoint.y, points[1].x, points[1].y);
        for (let i = 1, l = beziers.length; i < l; i++) {
            context.bezierCurveTo(beziers[i - 1].startControlPoint.x, beziers[i - 1].startControlPoint.y, beziers[i].endControlPoint.x, beziers[i].endControlPoint.y, beziers[i].endPoint.x, beziers[i].endPoint.y);
        }
        context.quadraticCurveTo(beziers[beziers.length - 1].startControlPoint.x, beziers[beziers.length - 1].startControlPoint.y, points[points.length - 1].x, points[points.length - 1].y);
        // context.strokeStyle = '#f7f06f';
        // context.lineWidth = this.scale * 1.5;
        context.lineJoin = 'round';
        context.stroke();
    }
}
exports.default = Logo;
