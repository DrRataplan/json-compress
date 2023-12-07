import fs from 'fs';

const makeKey = (x) =>
	`${x >= 26 ? makeKey(Math.floor(x / 26 - 1)) : ''}${String.fromCharCode(
		'a'.charCodeAt(0) + (x % 26)
	)}`;

let keyIndex = 0;
function minify(obj, map) {
	if (typeof obj === 'string') {
		let trans = map.get(obj);
		if (!trans) {
			trans = makeKey(keyIndex++);
			map.set(obj, trans);
		}
		return trans;
	}
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map((item) => minify(item, map));
	}
	const output = {};
	for (const key of Object.keys(obj)) {
		let trans = map.get(key);
		if (!trans) {
			trans = makeKey(keyIndex++);
			map.set(key, trans);
		}
		output[trans] = minify(obj[key], map);
	}
	return output;
}

export const doMinify = (a) => {
	const m = new Map();
	const b = minify(a, m, 0);

	const mapping = {};
	for (const [k, v] of m.entries()) {
		mapping[v] = k;
	}
	b.mapping = mapping;

	return b;
};

function unminify(obj, map, pathToItem) {
	if (typeof obj === 'string') {
		const trans = map.get(obj);
		if (trans === undefined) {
			throw new Error(
				`Unexpected minified string!!!, ${obj}, at "${pathToItem}"`
			);
		}
		return trans;
	}
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}
	if (Array.isArray(obj)) {
		return obj.map((item, index) =>
			unminify(item, map, `${pathToItem}[${index}]`)
		);
	}
	const output = {};
	for (const key of Object.keys(obj)) {
		if (key === 'mapping') {
			// Omit mapping from output
			continue;
		}
		const trans = map.get(key);
		if (trans === undefined) {
			throw new Error(
				`Unexpected minified key!!!, ${key}, at "${pathToItem}`
			);
		}
		output[trans] = unminify(obj[key], map, `${pathToItem}.${key}`);
	}
	return output;
}

export const doUnminify = (a) => {
	const mapping = new Map();
	for (const k of Object.keys(a.mapping)) {
		mapping.set(k, a.mapping[k]);
	}
	const b = unminify(a, mapping, '');

	return b;
};
