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

export function get_liters_graph() {
	const B1_CAP = 5; // 1st bucket's capacity
	const B2_CAP = 3; // 2nd bucket's capacity

	const objective = [4, undefined]; // The 1st bucket must have 4 liters, the contents of the 2nd bucket doesn't matter
	const actions = [F1, F2, E1, E2, T1, T2]; // All transitions available
	const queue = [[0, 0]]; // We start with the two buckets empty
	const graph = new Graph(true);
	let current;

	while (current = queue.shift()) {
		const first_node = graph.add_node(current.join("-"));
		console.log(`Current state: ${current.join("-")}:`);

		for (let action of actions) {
			const result = action(...current);
			let message = ` - ${action.name} → `;

			if (result[0] === current[0] && result[1] === current[1]) {
				console.log(message + `-`);
				continue;
			}

			const second_node_name = result.join("-");
			const second_node_not_already_present = graph.get_node_by_name(second_node_name) === null;
			const second_node = graph.add_node(second_node_name);
			graph.add_edge(first_node, second_node);
			message += result.join("-");

			if (second_node_not_already_present) {
				queue.push(result);
				message += ` *`;
			}

			console.log(message);
		}
	}

	return graph;

	// Fill the 1st bucket
	function F1(b1, b2) {
		return [B1_CAP, b2];
	}

	// Fill the 2nd bucket
	function F2(b1, b2) {
		return [b1, B2_CAP];
	}

	// Empty the 1st bucket
	function E1(b1, b2) {
		return [0, b2];
	}

	// Empty the 2nd bucket
	function E2(b1, b2) {
		return [b1, 0];
	}

	// Transfer the contents of the 1st bucket into the 2nd bucket
	function T1(b1, b2) {
		const b2_available = B2_CAP - b2;
		const b1_transferable = Math.min(b1, b2_available);
		return [b1 - b1_transferable, b2 + b1_transferable];
	}

	// Transfer the contents of the 2nd bucket into the 1st bucket
	function T2(b1, b2) {
		const b1_available = B1_CAP - b1;
		const b2_transferable = Math.min(b2, b1_available);
		return [b1 + b2_transferable, b2 - b2_transferable];
	}

}
