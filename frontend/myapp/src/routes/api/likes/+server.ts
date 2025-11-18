import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const productId = url.searchParams.get('productId');
		const userId = url.searchParams.get('userId');

		if (!productId) {
			return json({ error: 'Product ID is required' }, { status: 400 });
		}

		const likesCount = statements.getLikesByProductId.get(parseInt(productId)) as any;
		let hasLiked = false;

		if (userId) {
			const userLike = statements.hasUserLiked.get(parseInt(userId), parseInt(productId));
			hasLiked = !!userLike;
		}

		return json({
			likesCount: likesCount.likes_count || 0,
			hasLiked
		});

	} catch (error) {
		console.error('Get likes error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId, productId, action } = await request.json();

		if (!userId || !productId) {
			return json({ error: 'User ID and product ID are required' }, { status: 400 });
		}

		if (action === 'like') {
			statements.addLike.run(parseInt(userId), parseInt(productId));
		} else if (action === 'unlike') {
			statements.removeLike.run(parseInt(userId), parseInt(productId));
		} else {
			return json({ error: 'Invalid action' }, { status: 400 });
		}

		const likesCount = statements.getLikesByProductId.get(parseInt(productId)) as any;
		const hasLiked = action === 'like';

		return json({
			likesCount: likesCount.likes_count || 0,
			hasLiked
		});

	} catch (error) {
		console.error('Like action error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};