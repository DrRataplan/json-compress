import {
	describe,
	it
} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';

import { doMinify, doUnminify } from './index.mjs';

describe('minification', () => {
	const input = JSON.parse(fs.readFileSync('./assets/schema.json', 'utf-8'));

	it('can roundtrip a file', () => {
		const output = doMinify(input);

		fs.writeFileSync('./assets/schema-minified.json', JSON.stringify(output));

		assert.strictEqual(
			JSON.stringify(doUnminify(output)),
			JSON.stringify(input),
			'Unminifying should be a good roundtrip!'
		);
	});
});
