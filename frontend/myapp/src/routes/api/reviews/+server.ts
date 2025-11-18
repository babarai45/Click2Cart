import { json, type RequestHandler } from '@sveltejs/kit';
import { statements } from '$lib/database';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const productId = url.searchParams.get('productId');

		if (!productId) {
			return json({ error: 'Product ID is required' }, { status: 400 });
		}

		const reviews = statements.getReviewsByProductId.all(parseInt(productId));
		const ratingStats = statements.getAverageRating.get(parseInt(productId)) as any;

		return json({
			reviews,
			averageRating: ratingStats.avg_rating || 0,
			totalReviews: ratingStats.total_reviews || 0
		});

	} catch (error) {
		console.error('Get reviews error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { userId, productId, rating, comment } = await request.json();

		if (!userId || !productId || !rating) {
			return json({ error: 'User ID, product ID, and rating are required' }, { status: 400 });
		}

		if (rating < 1 || rating > 5) {
			return json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
		}

		// Check if user already reviewed this product
		const existingReview = statements.getReviewsByProductId.all(parseInt(productId))
			.find((review: any) => review.user_id === parseInt(userId));

		if (existingReview) {
			return json({ error: 'You have already reviewed this product' }, { status: 409 });
		}

		const result = statements.createReview.run(
			parseInt(userId),
			parseInt(productId),
			parseInt(rating),
			comment || ''
		);

		const review = statements.getReviewById.get(result.lastInsertRowid) as any;
		const user = statements.getUserById.get(parseInt(userId)) as any;

		return json({
			...review,
			userName: user.name
		}, { status: 201 });

	} catch (error) {
		console.error('Create review error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};