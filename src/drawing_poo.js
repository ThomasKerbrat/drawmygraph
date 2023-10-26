
class Vector {
	/** @type {number} */
	x;
	/** @type {number} */
	y;

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

export class CanvasController {
	constructor(element) {
		const height = element.height;
		const width = element.width;
		const ctx = element.getContext("2d");
		// ctx.scale(1, -1);
		ctx.translate(width / 2, height / 2);
	}
}

export class GraphController {
	/**
	 * @param {Graph} graph
	 * @param {HTMLCanvasElement} canvas_element
	 */
	constructor(graph, canvas_element) {
		this.graph = graph;
		this.canvas_element = canvas_element;

		const ctx = this.canvas_element.getContext("2d");
		const height = this.canvas_element.height;
		const width = this.canvas_element.width;
		const origin = new Vector(0, 0);
		const radius = Math.floor(Math.min(width, height) * 0.4);

		this.view = new GraphView(origin, radius, this.graph.nodes);
		this.view.draw(ctx);
	}
}

export class GraphView {
	/** @type {NodeView[]} */
	#node_views;

	constructor(origin, radius, nodes) {
		this.#node_views = [];

		const step = (2 * Math.PI) / nodes.length;
		let angle = -0.5 * Math.PI;

		for (let node of nodes) {
			const position = new Vector(Math.cos(angle) * radius + origin.x, Math.sin(angle) * radius + origin.y);
			this.#node_views.push(new NodeView(node, position, 30, "white", "black", 3, "black"));
			angle += step;
		}
	}

	draw(context) {
		for (let node of this.#node_views) {
			node.draw(context);
		}
	}
}

export class NodeView {
	/** @type {GraphNode} */
	#node;

	/** @type {Vector} */
	position;
	/** @type {number} */
	radius;

	/** @type {string} */
	background_color;
	/** @type {string} */
	text_color;
	/** @type {number} */
	text_size;
	/** @type {string} */
	font_family = "sans-serif";
	/** @type {number} */
	border_width;
	/** @type {string} */
	border_color;

	/** @type {Path2D} */
	#path;

	constructor(node, position, radius, bg_color, text_color, border_width, border_color) {
		this.#node = node;
		this.position = position;
		this.radius = radius;
		this.background_color = bg_color;
		this.text_color = text_color;
		this.text_size = this.radius;
		this.border_width = border_width;
		this.border_color = border_color;

		this.#path = new Path2D();
		this.#path.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
	}

	get text() {
		return this.#node.name;
	}

	draw(context) {
		context.fillStyle = this.background_color;
		context.fill(this.#path);

		context.lineWidth = this.border_width;
		context.strokeStyle = this.border_color;
		context.stroke(this.#path);

		context.fillStyle = this.text_color;
		context.font = this.text_size + "px " + this.font_family;
		const text_metrics = context.measureText(this.text);
		context.fillText(this.text, this.position.x - text_metrics.width / 2, this.position.y + this.radius * 0.3);
	}
}

export class EdgeView {
	/** @type {Edge} */
	edge;
	/** @type {Path2D} */
	#path;

	constructor(edge) {
		this.edge = edge;
	}
}
