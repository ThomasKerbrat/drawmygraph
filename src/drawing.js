import { Graph } from "./models.js";

/**
 * Draw an instance of Graph to the given 
 * @param {Graph} graph The graph to draw
 * @param {HTMLCanvasElement} canvas The canvas element to draw to
 */
export function draw_graph(graph, canvas) {
	// Canvas' properties
	const context = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	// Nodes big circle
	const offset_x = width / 2;
	const offset_y = height / 2;
	const big_circle_radius = Math.floor(Math.min(width, height) * 0.4);

	// Compute nodes coordinates
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

	// Draw edges
	context.lineWidth = 2;

	for (let edge of graph.edges) {
		const node_xy_1 = node_coords.get(edge.node1);
		const node_xy_2 = node_coords.get(edge.node2);

		const path = new Path2D();
		path.moveTo(node_xy_1.x, node_xy_1.y);
		path.lineTo(node_xy_2.x, node_xy_2.y);
		context.stroke(path);
	}

	// Draw nodes
	const node_radius = 30;

	context.strokeStyle = "black";
	context.lineWidth = 3;
	context.font = node_radius + "px sans-serif";

	for (let node of graph.nodes) {
		const node_xy = node_coords.get(node);

		const path = new Path2D();
		path.arc(node_xy.x, node_xy.y, node_radius, 0, 2 * Math.PI);
		context.fillStyle = "white";
		context.fill(path);
		context.stroke(path);

		const text_metrics = context.measureText(node.name);
		context.fillStyle = "black";
		context.fillText(node.name, node_xy.x - text_metrics.width / 2, node_xy.y + node_radius * 0.3);
	}
}
