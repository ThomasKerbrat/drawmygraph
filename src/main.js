import { get_divisibles_graph, get_liters_graph } from "./seeders.js";
import { draw_graph } from "./drawing.js";

const divisibles_graph = get_divisibles_graph(1, 12);
// document.querySelector("#adjency-matrix").innerText = divisibles_graph.to_adjency_matrix();
// document.querySelector("#adjency-list").innerText = divisibles_graph.to_edge_list();
// document.querySelector("#edge-list").innerText = divisibles_graph.edges.map(e => String(e)).join("\n");

const liters_graph = get_liters_graph();
// document.querySelector("#adjency-matrix").innerText = liters_graph.to_adjency_matrix();
// document.querySelector("#adjency-list").innerText = liters_graph.to_edge_list();
// document.querySelector("#edge-list").innerText = liters_graph.edges.map(e => String(e)).join("\n");

const canvas_element = document.querySelector("#graph-canvas");
draw_graph(liters_graph, canvas_element);
