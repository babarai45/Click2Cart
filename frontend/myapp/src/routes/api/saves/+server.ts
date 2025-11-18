import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		const savedProducts = statements.getSavesByUserId.all(parseInt(userId));

		return json(savedProducts);

	} catch (error) {
		console.error('Get saves error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId, productId, action } = await request.json();

		if (!userId || !productId) {
			return json({ error: 'User ID and product ID are required' }, { status: 400 });
		}

		if (action === 'save') {
			statements.addSave.run(parseInt(userId), parseInt(productId));
		} else if (action === 'unsave') {
			statements.removeSave.run(parseInt(userId), parseInt(productId));
		} else {
			return json({ error: 'Invalid action' }, { status: 400 });
		}

		const hasSaved = action === 'save';

		return json({ hasSaved });

	} catch (error) {
		console.error('Save action error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};