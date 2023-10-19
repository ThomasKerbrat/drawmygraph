
/**
 * @param {any[]} list
 * @returns {Map<any, number>}
 */
function compute_index_map(list) {
	const indexes_map = new Map();

	for (let index = 0; index < list.length; index++) {
		indexes_map.set(list[index], index);
	}

	return indexes_map;
}

export class Graph {
	/** @type {boolean} */
	directed;
	/** @type {GraphNode[]} */
	nodes;
	/** @type {Edge[]} */
	edges;

	/**
	 * @param {boolean} directed 
	 */
	constructor(directed) {
		this.directed = directed;
		this.nodes = [];
		this.edges = [];
	}

	/**
	 * @param {string} name
	 * @returns {GraphNode|null}
	 */
	#get_node_by_name(name) {
		/** @type {GraphNode|null} */
		let node = null;

		for (let candidate of this.nodes) {
			if (candidate.name === name) {
				node = candidate;
			}
		}

		return node;
	}

	/**
	 * @param {GraphNode} node1
	 * @param {GraphNode} node2
	 * @return {Edge|null}
	 */
	#get_edge(node1, node2) {
		/** @type {Edge|null} */
		let edge = null;

		for (let candidate of this.edges) {
			// In the case of a directed graph.
			if (candidate.node1 === node1 && candidate.node2 === node2) {
				edge = candidate;
			}

			// In the case of an undirected graph.
			else if (this.directed === false && candidate.node2 === node1 && candidate.node1 === node2) {
				edge = candidate;
			}
		}

		return edge;
	}

	/**
	 * Adds a node to the graph. Nodes must have unique names within the graph.
	 * If a node is already present in the graph for the given name,
	 * nothing is added and the existing node is returned.
	 * @param {string} name
	 * @returns {GraphNode}
	 */
	add_node(name) {
		const node_or_null = this.#get_node_by_name(name);

		if (node_or_null === null) {
			const node = new GraphNode(name);
			this.nodes.push(node);
			return node;
		} else {
			return node_or_null;
		}
	}

	/**
	 * @param {GraphNode} node1
	 * @param {GraphNode} node2
	 * @returns {Edge}
	 */
	add_edge(node1, node2) {
		const edge = new Edge(node1, node2, this.directed);
		this.edges.push(edge);
		return edge;
	}

	/**
	 * Serialize this graph to a comma separated values adjency matrix.
	 * @returns {string}
	 */
	to_adjency_matrix() {
		// Initialize a two-dimentional list that looks like the output.
		// There are the same number of lines as the number of nodes.
		// But there is one more column as the first serves to indicate the name of the node.
		const matrix = [];
		for (let line = 0; line < this.nodes.length; line++) {
			matrix.push([this.nodes[line].name]);

			for (let column = 0; column < this.nodes.length; column++) {
				matrix[line].push(0);
			}
		}

		// Iterate through the edges list and set the matrixes values to 1
		// using the "coordinates" of nodes based on the nodes indexes map.
		const node_indexes_map = compute_index_map(this.nodes);
		for (let edge of this.edges) {
			const line = node_indexes_map.get(edge.node1);
			const column = node_indexes_map.get(edge.node2);
			// Accounting for the added first column in the matrix.
			matrix[line][column + 1] = 1;
		}

		// Putting all the matrix's values to a string builder.
		const string_builder = [];
		for (let line = 0; line < matrix.length; line++) {
			for (let column = 0; column < matrix[line].length; column++) {
				let value = String(matrix[line][column]);

				if (column === 0) {
					value = value.padStart(2, " ");
				}

				string_builder.push(value, ", ");
			}

			string_builder.push("\n");
		}

		// Return the constructed string representing the adjency matrix of this graph.
		return string_builder.join("");
	}

	/**
	 * Serialize this graph to a comma separated values edge list.
	 * @returns {string}
	 */
	to_edge_list() {
		// Initialize an empty two-dimentional list.
		const edge_list = [];
		for (let _ of this.nodes) {
			edge_list.push([]);
		}

		// Iterate through the edges to add the edges' names in the correct line.
		const node_indexes_map = compute_index_map(this.nodes);
		for (let edge of this.edges) {
			const line = node_indexes_map.get(edge.node1);
			const column = node_indexes_map.get(edge.node2);
			edge_list[line].push(column);
		}

		// Putting all the edge list values to the string builder.
		const string_builder = [];
		for (let i = 0; i < this.nodes.length; i++) {
			string_builder.push(this.nodes[i].name, ": ");

			for (let j = 0; j < edge_list[i].length; j++) {
				string_builder.push(edge_list[i][j], ", ");
			}

			string_builder.push("\n");
		}
		
		// Return the constructed string representing the edge list of this graph.
		return string_builder.join("");
	}
}

export class GraphNode {
	/** @type {string} */
	name;

	constructor(name) {
		this.name = name;
	}
}

export class Edge {
	/** @type {GraphNode} */
	node1;
	/** @type {GraphNode} */
	node2;
	/** @type {boolean} */
	directed;
	/** @type {number|undefined} */
	weight;

	constructor(node1, node2, directed, weight) {
		this.node1 = node1;
		this.node2 = node2;
		this.directed = directed;
		this.weight = weight;
	}

	/**
	 * Format this edge based on its directed and weight properties.
	 * Directed and weighted: A-(3.5)>B
	 * Undirected and weighted: A-(3.5)-B
	 * Directed and unweighted: A>B
	 * Undirected and unweighted: A-B
	 * @returns {string}
	 */
	toString() {
		if (this.directed && this.weight != undefined) {
			return `${this.node1.name}-(${this.weight})>${this.node2.name}`;
		} else if (this.directed) {
			return `${this.node1.name}>${this.node2.name}`;
		} else if (this.weight != undefined) {
			return `${this.node1.name}-(${this.weight})-${this.node2.name}`;
		} else {
			return `${this.node1.name}-${this.node2.name}`;
		}
	}
}
