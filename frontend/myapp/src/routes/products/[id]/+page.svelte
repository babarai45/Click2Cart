<script lang="ts">
	import { user, cart } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { Heart, Bookmark, Star, ShoppingCart, Plus, Minus } from 'lucide-svelte';
	import type { Product, Review } from '$lib/types';

	let { data }: { data: { product: Product } } = $props();
	let product: Product = $state(data.product);
	let reviews: Review[] = $state([]);
	let averageRating = $state(0);
	let totalReviews = $state(0);
	let likesCount = $state(0);
	let hasLiked = $state(false);
	let hasSaved = $state(false);
	let quantity = $state(1);
	let selectedImage = $state(product.image);
	let showReviewForm = $state(false);
	let reviewRating = $state(5);
	let reviewComment = $state('');
	let submittingReview = $state(false);

	// Load reviews and likes data
	async function loadProductData() {
		try {
			// Load reviews
			const reviewsResponse = await fetch(`/api/reviews?productId=${product.id}`);
			if (reviewsResponse.ok) {
				const reviewsData = await reviewsResponse.json();
				reviews = reviewsData.reviews;
				averageRating = reviewsData.averageRating;
				totalReviews = reviewsData.totalReviews;
			}

			// Load likes data
			if ($user) {
				const likesResponse = await fetch(`/api/likes?productId=${product.id}&userId=${$user.id}`);
				if (likesResponse.ok) {
					const likesData = await likesResponse.json();
					likesCount = likesData.likesCount;
					hasLiked = likesData.hasLiked;
				}

				// Check if saved
				const savesResponse = await fetch(`/api/saves?userId=${$user.id}`);
				if (savesResponse.ok) {
					const savedProducts = await savesResponse.json();
					hasSaved = savedProducts.some((p: Product) => p.id === product.id);
				}
			}
		} catch (err) {
			console.error('Failed to load product data:', err);
		}
	}

	loadProductData();

	async function toggleLike() {
		if (!$user) {
			goto('/signin');
			return;
		}

		try {
			const action = hasLiked ? 'unlike' : 'like';
			const response = await fetch('/api/likes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: $user.id,
					productId: product.id,
					action
				})
			});

			if (response.ok) {
				const data = await response.json();
				likesCount = data.likesCount;
				hasLiked = data.hasLiked;
			}
		} catch (err) {
			console.error('Failed to toggle like:', err);
		}
	}

	async function toggleSave() {
		if (!$user) {
			goto('/signin');
			return;
		}

		try {
			const action = hasSaved ? 'unsave' : 'save';
			const response = await fetch('/api/saves', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: $user.id,
					productId: product.id,
					action
				})
			});

			if (response.ok) {
				hasSaved = !hasSaved;
			}
		} catch (err) {
			console.error('Failed to toggle save:', err);
		}
	}

	async function submitReview() {
		if (!$user) {
			goto('/signin');
			return;
		}

		submittingReview = true;
		try {
			const response = await fetch('/api/reviews', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: $user.id,
					productId: product.id,
					rating: reviewRating,
					comment: reviewComment
				})
			});

			if (response.ok) {
				showReviewForm = false;
				reviewComment = '';
				loadProductData(); // Reload reviews
			} else {
				const error = await response.json();
				alert(error.error);
			}
		} catch (err) {
			alert('Failed to submit review');
		} finally {
			submittingReview = false;
		}
	}

	function addToCart() {
		cart.update(items => {
			const existingItem = items.find(item => item.product.id === product.id);
			if (existingItem) {
				return items.map(item =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				return [...items, { product, quantity }];
			}
		});
		alert('Added to cart!');
	}

	function renderStars(rating: number) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
		<!-- Product Images -->
		<div class="space-y-4">
			<div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
				<img
					src={selectedImage}
					alt={product.name}
					class="w-full h-full object-cover"
				/>
			</div>
		</div>

		<!-- Product Info -->
		<div class="space-y-6">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">{product.name}</h1>
				{#if product.brand}
					<p class="text-lg text-gray-600 mt-2">by {product.brand}</p>
				{/if}
			</div>

			<!-- Rating and Reviews -->
			<div class="flex items-center space-x-4">
				<div class="flex items-center">
					{#each renderStars(Math.round(averageRating)) as filled}
						<Star class="h-5 w-5 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
					{/each}
					<span class="ml-2 text-sm text-gray-600">
						{averageRating.toFixed(1)} ({totalReviews} reviews)
					</span>
				</div>
			</div>

			<!-- Price -->
			<div class="text-3xl font-bold text-gray-900">
				${product.price.toFixed(2)}
			</div>

			<!-- Stock Status -->
			<div class="text-sm">
				<span class="font-medium">Stock:</span>
				<span class={product.inStock > 0 ? 'text-green-600' : 'text-red-600'}>
					{product.inStock > 0 ? `${product.inStock} available` : 'Out of stock'}
				</span>
			</div>

			<!-- Features -->
			{#if product.features}
				<div>
					<h3 class="text-lg font-semibold mb-2">Features</h3>
					<ul class="list-disc list-inside space-y-1 text-gray-600">
						{#each product.features.split(',').map(f => f.trim()) as feature}
							<li>{feature}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Description -->
			{#if product.description}
				<div>
					<h3 class="text-lg font-semibold mb-2">Description</h3>
					<p class="text-gray-600 leading-relaxed">{product.description}</p>
				</div>
			{/if}

			<!-- Actions -->
			<div class="space-y-4">
				{#if product.inStock > 0}
					<div class="flex items-center space-x-4">
						<div class="flex items-center border rounded">
							<button
								onclick={() => quantity = Math.max(1, quantity - 1)}
								class="p-2 hover:bg-gray-100"
							>
								<Minus class="h-4 w-4" />
							</button>
							<span class="px-4 py-2">{quantity}</span>
							<button
								onclick={() => quantity = Math.min(product.inStock, quantity + 1)}
								class="p-2 hover:bg-gray-100"
							>
								<Plus class="h-4 w-4" />
							</button>
						</div>
						<button
							onclick={addToCart}
							class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
						>
							<ShoppingCart class="h-5 w-5 mr-2" />
							Add to Cart
						</button>
					</div>
				{/if}

				<div class="flex items-center space-x-4">
					<button
						onclick={toggleLike}
						class="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 {hasLiked ? 'text-red-600 border-red-200' : 'text-gray-600'}"
					>
						<Heart class="h-5 w-5 {hasLiked ? 'fill-current' : ''}" />
						<span>{likesCount}</span>
					</button>

					<button
						onclick={toggleSave}
						class="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 {hasSaved ? 'text-blue-600 border-blue-200' : 'text-gray-600'}"
					>
						<Bookmark class="h-5 w-5 {hasSaved ? 'fill-current' : ''}" />
						<span>{hasSaved ? 'Saved' : 'Save'}</span>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Reviews Section -->
	<div class="mt-12 border-t pt-8">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-bold">Reviews ({totalReviews})</h2>
			{#if $user}
				<button
					onclick={() => showReviewForm = !showReviewForm}
					class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					Write Review
				</button>
			{:else}
				<a href="/signin" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
					Sign in to Review
				</a>
			{/if}
		</div>

		{#if showReviewForm}
			<div class="bg-gray-50 p-6 rounded-lg mb-6">
				<h3 class="text-lg font-semibold mb-4">Write a Review</h3>
				<form onsubmit={submitReview} class="space-y-4">
					<div>
						<label for="review-rating" class="block text-sm font-medium mb-2">Rating</label>
						<div class="flex space-x-1">
							{#each Array(5) as _, i}
								<button
									type="button"
									id={i === 0 ? 'review-rating' : undefined}
									onclick={() => reviewRating = i + 1}
									class="text-2xl {i < reviewRating ? 'text-yellow-400' : 'text-gray-300'}"
								>
									★
								</button>
							{/each}
						</div>
					</div>

					<div>
						<label for="review-comment" class="block text-sm font-medium mb-2">Comment</label>
						<textarea
							id="review-comment"
							bind:value={reviewComment}
							rows="4"
							class="w-full px-3 py-2 border border-gray-300 rounded-md"
							placeholder="Share your thoughts about this product..."
						></textarea>
					</div>

					<div class="flex space-x-4">
						<button
							type="submit"
							disabled={submittingReview}
							class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{submittingReview ? 'Submitting...' : 'Submit Review'}
						</button>
						<button
							type="button"
							onclick={() => showReviewForm = false}
							class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		{/if}

		<div class="space-y-6">
			{#each reviews as review}
				<div class="border rounded-lg p-6">
					<div class="flex justify-between items-start mb-4">
						<div>
							<div class="flex items-center space-x-2 mb-2">
								<span class="font-semibold">{review.userName}</span>
								<div class="flex">
									{#each renderStars(review.rating) as filled}
										<Star class="h-4 w-4 {filled ? 'text-yellow-400 fill-current' : 'text-gray-300'}" />
									{/each}
								</div>
							</div>
							<p class="text-sm text-gray-500">
								{new Date(review.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>

					{#if review.comment}
						<p class="text-gray-700">{review.comment}</p>
					{/if}
				</div>
			{/each}

			{#if reviews.length === 0}
				<p class="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
			{/if}
		</div>
	</div>
</div>