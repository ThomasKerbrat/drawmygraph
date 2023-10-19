import { Graph } from "./models.js";

/**
 * Return a directed graph which represents the "divides" relationship between
 * all number from min to max. For example: 3 divides 6. Hence, the graph will
 * contain a directed edge between the "3" node and the "6" node.
 * @param {number} min
 * @param {number} max
 */
export function get_divisibles_graph(min, max) {
	const graph = new Graph(true);

	for (let first = min; first <= max; first++) {
		const first_node = graph.add_node(String(first));

		for (let second = min; second <= max; second++) {
			const second_node = graph.add_node(String(second));

			if (second % first === 0) {
				graph.add_edge(first_node, second_node);
			}
		}
	}

	return graph;
}

