import { get_divisibles_graph, get_liters_graph } from "./seeders.js";
import { compute_graph_view, draw_graph_view } from "./drawing.js";
import { Edge, GraphNode } from "./models.js";

const divisibles_graph = get_divisibles_graph(1, 12);
// document.querySelector("#adjency-matrix").innerText = divisibles_graph.to_adjency_matrix();
// document.querySelector("#adjency-list").innerText = divisibles_graph.to_edge_list();
// document.querySelector("#edge-list").innerText = divisibles_graph.edges.map(e => String(e)).join("\n");

const liters_graph = get_liters_graph();
// document.querySelector("#adjency-matrix").innerText = liters_graph.to_adjency_matrix();
// document.querySelector("#adjency-list").innerText = liters_graph.to_edge_list();
// document.querySelector("#edge-list").innerText = liters_graph.edges.map(e => String(e)).join("\n");

const canvas_element = document.querySelector("#graph-canvas");
const context = canvas_element.getContext("2d");
const graph_view = compute_graph_view(liters_graph, canvas_element);
draw_graph_view(canvas_element, graph_view);

/** @type {GraphNode | null} */
let selected_node = null;
/** @type {Edge | null} */
let selected_edge = null;

/** @type {import("./drawing.js").FillProperties | null} */
let previous_fill = null;
/** @type {import("./drawing.js").StrokeProperties | null} */
let previous_stroke = null;

canvas_element.addEventListener("click", function (event) {
	const edge_or_node = get_clicked_edge_or_node(context, graph_view, event.offsetX, event.offsetY);
	let needs_redraw = false;

	switch (edge_or_node.type) {
		case "edge":
			const edge_view = graph_view.edges.get(edge_or_node.element);
			previous_stroke = deep_copy(edge_view.stroke);
			edge_view.stroke.strokeStyle = "red";
			edge_view.stroke.lineWidth = 3;
			selected_edge = edge_or_node.element;
			needs_redraw = true;
			break;
		case "node":
			const node_view = graph_view.nodes.get(edge_or_node.element);
			previous_fill = deep_copy(node_view.fill);
			node_view.fill.fillStyle = "#77FF77";
			previous_stroke = deep_copy(node_view.stroke);
			node_view.stroke.strokeStyle = "#FFFF77";
			selected_node = edge_or_node.element;
			needs_redraw = true;
			break;
		case "none":
			if (selected_edge !== null) {
				const edge_view = graph_view.edges.get(selected_edge);
				edge_view.stroke = previous_stroke;
				previous_stroke = null;
				selected_edge = null;
				needs_redraw = true;
			}

			if (selected_node !== null) {
				const node_view = graph_view.nodes.get(selected_node);
				node_view.fill = previous_fill;
				previous_fill = null;
				node_view.stroke = previous_stroke;
				previous_stroke = null;
				selected_node = null;
				needs_redraw = true;
			}
			break;
	}

	if (needs_redraw) {
		draw_graph_view(canvas_element, graph_view);
		needs_redraw = false;
	}
});

/**
 * @param {import("./drawing.js").GraphView} graph_view
 * @param {number} x
 * @param {number} y
 */
function get_clicked_edge_or_node(context, graph_view, x, y) {
	for (let [node, node_view] of graph_view.nodes) {
		if (context.isPointInPath(node_view.path, x, y)) {
			return { type: "node", element: node };
		}
	}

	for (let [edge, edge_view] of graph_view.edges) {
		if (context.isPointInStroke(edge_view.path, x, y)) {
			return { type: "edge", element: edge };
		}
	}

	return { type: "none" };
}

function deep_copy(object) {
	return JSON.parse(JSON.stringify(object));
}
