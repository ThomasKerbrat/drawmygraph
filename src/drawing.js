import { Edge, Graph, GraphNode } from "./models.js";

/** @typedef {{ x: number, y: number }} Vector */

/**	@typedef {{ lineWidth: number, strokeStyle: string }} StrokeProperties */
/**	@typedef {{ fillStyle: string }} FillProperties */
/**	@typedef {{ font: string }} FontProperties */

/**	@typedef {{ path: Path2D, stroke: StrokeProperties, fill: FillProperties }} NodeView */
/**	@typedef {{ path: Path2D, stroke: StrokeProperties }} EdgeView */
/**	@typedef {{ text: string, position: Vector, font: FontProperties, fill: FillProperties }} LabelView */
/**
 * @typedef {Object} GraphView
 * @property {Map<Edge, EdgeView>} edges
 * @property {Map<GraphNode, NodeView>} nodes
 * @property {LabelView[]} labels
 */

/**
 * @returns {GraphView}
 */
export function compute_graph_view(graph, canvas) {
	// Canvas' properties
	const context = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	// Nodes big circle
	const offset_x = width / 2;
	const offset_y = height / 2;
	const big_circle_radius = Math.floor(Math.min(width, height) * 0.4);

	// Compute nodes coordinates
	/** @type {Map<GraphNode, Vector>} */
	const node_coords = new Map();
	const quantity = graph.nodes.length;
	const step = (2 * Math.PI) / quantity;
	let angle = -0.5 * Math.PI;

	for (let node of graph.nodes) {
		const node_x = Math.cos(angle) * big_circle_radius + offset_x;
		const node_y = Math.sin(angle) * big_circle_radius + offset_y;
		node_coords.set(node, { x: node_x, y: node_y });
		angle += step;
	}

	// Prepare the GraphView object
	/** @type {GraphView} */
	const graph_view = {
		edges: new Map(),
		nodes: new Map(),
		labels: new Array(),
	};

	// Compute edges
	for (let edge of graph.edges) {
		const n1c = node_coords.get(edge.node1);
		const n2c = node_coords.get(edge.node2);

		const path = new Path2D();
		const cp = compute_cp(n1c, n2c, 0);
		path.bezierCurveTo(n1c.x, n1c.y, cp.x, cp.y, n2c.x, n2c.y);
		graph_view.edges.set(edge, {
			path,
			stroke: {
				lineWidth: 2,
				strokeStyle: "black",
			},
		});
	}

	// Compute nodes
	const node_radius = 30;
	const label_font = node_radius + "px sans-serif";

	// Useful for computing text width and thus centering the text inside the node
	context.font = label_font;

	for (let node of graph.nodes) {
		const node_xy = node_coords.get(node);

		// Node's circle (fill and stroke)
		const path = new Path2D();
		path.arc(node_xy.x, node_xy.y, node_radius, 0, 2 * Math.PI);
		graph_view.nodes.set(node, {
			path,
			fill: {
				fillStyle: "white",
			},
			stroke: {
				lineWidth: 3,
				strokeStyle: "black",
			},
		});

		// Node's label (fill)
		const text_metrics = context.measureText(node.name);
		graph_view.labels.push({
			text: node.name,
			position: {
				x: node_xy.x - text_metrics.width / 2,
				y: node_xy.y + node_radius * 0.3,
			},
			font: {
				font: node_radius + "px sans-serif",
			},
			fill: {
				fillStyle: "black",
			},
		});
	}

	return graph_view;
}

/**
 * @param {GraphView} graph_view
 */
export function draw_graph_view(canvas, graph_view) {
	// Canvas' properties
	const context = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;
	context.clearRect(0, 0, width, height);

	// Draw edges
	for (let [_, edge_view] of graph_view.edges) {
		context.lineWidth = edge_view.stroke.lineWidth;
		context.strokeStyle = edge_view.stroke.strokeStyle;
		context.stroke(edge_view.path);
	}

	// Draw nodes
	for (let [_, node_view] of graph_view.nodes) {
		context.fillStyle = node_view.fill.fillStyle;
		context.fill(node_view.path);

		context.lineWidth = node_view.stroke.lineWidth;
		context.strokeStyle = node_view.stroke.strokeStyle;
		context.stroke(node_view.path);
	}

	// Draw labels
	for (let label_view of graph_view.labels) {
		context.font = label_view.font;
		context.fillStyle = label_view.fill.fillStyle;
		context.fillText(label_view.text, label_view.position.x, label_view.position.y);
	}
}

function draw_point(context, x, y, color) {
	context.fillStyle = color;
	const path = new Path2D();
	path.arc(x, y, 3, 0, Math.PI * 2);
	context.fill(path);
}

/**
 * @param {Vector} node1
 * @param {Vector} node2
 * @param {number} factor
 * @returns {Vector}
 */
function compute_cp(node1, node2, factor = 1) {
	// The halfway point between the two nodes
	const middle_point = compute_middle_point(node1, node2);
	// Coordinates of the node2 as if the node1 was at (0,0)
	const node2_ref_node1 = {
		x: node2.x - node1.x,
		y: node2.y - node1.y,
	};

	const angle = Math.atan2(node2_ref_node1.y, node2_ref_node1.x) + (Math.PI / 2);
	const dx = Math.cos(angle) * factor;
	const dy = Math.sin(angle) * factor;

	return {
		x: middle_point.x + dx,
		y: middle_point.y + dy,
	}
}

function compute_middle_point(point1, point2) {
	return {
		x: (point1.x + point2.x) / 2,
		y: (point1.y + point2.y) / 2,
	};
}
