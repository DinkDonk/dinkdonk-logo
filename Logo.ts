/* tslint:disable:max-classes-per-file max-line-length */

interface Vector1Interface {
	x:number;
}

interface Vector2Interface extends Vector1Interface {
	x:number;
	y:number;
	normalized:Vector2Interface;
	reversed:Vector2Interface;
	magnitude:number;
	add(v:Vector2Interface | number):Vector2Interface;
	subtract(v:Vector2Interface | number):Vector2Interface;
	dotProduct(v:Vector2Interface | number):number;
	crossProduct(v:Vector2Interface | number):number;
	multiply(v:Vector2Interface | number):Vector2Interface;
}

interface Vector3Interface {
	x:number;
	y:number;
	z:number;
}

class Vector1 implements Vector1Interface {
	public x:number;

	constructor(x:number) {
		this.x = x;
	}
}

class Vector2 implements Vector2Interface {
	public x:number;
	public y:number;

	constructor(x:number, y:number) {
		this.x = x;
		this.y = y;
	}

	public add(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x + v, this.y + v);
		}

		return new Vector2(this.x + v.x, this.y + v.y);
	}

	public subtract(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x + -v, this.y + -v);
		}

		return new Vector2(this.x + -v.x, this.y + -v.y);
	}

	public get normalized():Vector2 {
		const magnitude:number = this.magnitude;
		return new Vector2(this.x / magnitude, this.y / magnitude);
	}

	public get magnitude():number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	public get reversed():Vector2 {
		return new Vector2(-this.x, -this.y);
	}

	public dotProduct(v:Vector2Interface | number):number {
		if (typeof v === 'number') {
			return this.x * v + this.y * v;
		}

		return this.x * v.x + this.y * v.y;
	}

	public crossProduct(v:Vector2Interface | number):number {
		if (typeof v === 'number') {
			return this.x * v - this.y * v;
		}

		return this.x * v.x - this.y * v.y;
	}

	public multiply(v:Vector2 | number):Vector2 {
		if (typeof v === 'number') {
			return new Vector2(this.x * v, this.y * v);
		}

		return new Vector2(this.x * v.x, this.y * v.y);
	}
}

class Vector3 implements Vector3Interface {
	public x:number;
	public y:number;
	public z:number;

	constructor(x:number, y:number, z:number) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public add(v:Vector3 | number):Vector3 {
		if (typeof v === 'number') {
			return new Vector3(this.x + v, this.y + v, this.z + v);
		}

		return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
	}

	public scale(factor:number):Vector3 {
		return new Vector3(this.x * factor, this.y * factor, this.z * factor);
	}
}

interface Bezier {
	startPoint:Vector2;
	startControlPoint:Vector2;
	endPoint:Vector2;
	endControlPoint:Vector2;
}

export default class Logo {
	private canvas:HTMLCanvasElement;
	private context:CanvasRenderingContext2D;
	private padding:number = 100;
	private offset:Vector2;
	private scale:number;
	private points:Vector2[];
	private tensions:Vector1[];

	constructor(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D, tension:number = 0) {
		this.canvas = canvas;
		this.context = context;

		this.scale = this.canvas.width / (330 + this.padding * 2);
		this.offset = new Vector2(this.padding - 5, (this.canvas.height / 2) / this.scale);

		const anchors:Vector3[] = [
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

	private offsetAndScalePoints():Vector2[] {
		const points:Vector2[] = [];

		for (const i in this.points) {
			if (this.points.hasOwnProperty(i)) {
				const point = this.points[i];

				points.push(new Vector2((point.x + this.offset.x) * this.scale, (point.y + this.offset.y) * this.scale));
			}
		}

		return points;
	}

	private draw():void {
		const canvas = this.canvas;
		const context = this.context;
		const points = this.points;
		const tensions = this.tensions;
		const beziers:Bezier[] = [];

		for (let i = 1, l = points.length - 1; i < l; i++) {
			const p0:Vector2 = points[i - 1];
			const p1:Vector2 = points[i];
			const p2:Vector2 = points[i + 1];
			const q0Distance:number = p1.subtract(p0).magnitude;
			const q1Distance:number = p2.subtract(p1).magnitude;
			const tension = tensions[i].x;
			const fa:number = tension * q0Distance / (q0Distance + q1Distance);
			const fb:number = tension - fa;
			const q0:Vector2 = p1.add(p0.subtract(p2).multiply(fa));
			const q1:Vector2 = p1.subtract(p0.subtract(p2).multiply(fb));

			beziers.push({
				endControlPoint: q0,
				endPoint: p1,
				startControlPoint:q1,
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