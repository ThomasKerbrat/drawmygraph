import { get_divisibles_graph } from "./seeders.js";

const divisibles_graph = get_divisibles_graph(1, 12);
document.querySelector("#adjency-matrix").innerText = divisibles_graph.to_adjency_matrix();
document.querySelector("#adjency-list").innerText = divisibles_graph.to_edge_list();
document.querySelector("#edge-list").innerText = divisibles_graph.edges.map(e => String(e)).join("\n");
