import { statements } from '$lib/database';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const productId = parseInt(params.id);
		const product = statements.getProductById.get(productId);

		if (!product) {
			throw error(404, 'Product not found');
		}

		return {
			product
		};
	} catch (err) {
		console.error('Load product error:', err);
		throw error(500, 'Internal server error');
	}
}