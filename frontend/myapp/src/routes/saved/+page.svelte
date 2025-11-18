<script lang="ts">
	import { user, cart } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { Heart, ShoppingCart, Plus } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let savedProducts: Product[] = $state([]);
	let loading = $state(true);

	user.subscribe(async (userValue) => {
		if (userValue) {
			await loadSavedProducts();
		} else {
			savedProducts = [];
		}
	});

	async function loadSavedProducts() {
		try {
			loading = true;
			const response = await fetch('/api/saves');
			if (response.ok) {
				savedProducts = await response.json();
			}
		} catch (err) {
			console.error('Failed to load saved products:', err);
		} finally {
			loading = false;
		}
	}

	async function removeFromSaved(productId: number) {
		try {
			const response = await fetch('/api/saves', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: $user?.id,
					productId,
					action: 'unsave'
				})
			});

			if (response.ok) {
				savedProducts = savedProducts.filter(p => p.id !== productId);
			}
		} catch (err) {
			console.error('Failed to remove from saved:', err);
		}
	}

	function addToCart(product: Product) {
		cart.update((items) => {
			const existing = items.find((item) => item.product.id === product.id);
			if (existing) {
				existing.quantity += 1;
			} else {
				items.push({ product, quantity: 1 });
			}
			return items;
		});
		alert('Added to cart!');
	}
</script>

<div class="max-w-7xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Saved Products</h1>

	{#if !$user}
		<div class="text-center">
			<p class="text-gray-600 mb-4">Please sign in to view your saved products.</p>
			<a href="/signin" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Sign In</a>
		</div>
	{:else if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if savedProducts.length === 0}
		<div class="text-center py-12">
			<p class="text-gray-500 text-lg mb-4">You haven't saved any products yet.</p>
			<a href="/" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Browse Products</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each savedProducts as product (product.id)}
				<div class="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105">
					<button class="aspect-square bg-gray-200 overflow-hidden cursor-pointer w-full" onclick={() => goto(`/products/${product.id}`)} tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(`/products/${product.id}`); } }}>
						{#if product.image}
							<img
								src={product.image}
								alt={product.name}
								class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
							/>
						{:else}
							<div class="w-full h-full flex items-center justify-center">
								<span class="text-gray-500">No Image</span>
							</div>
						{/if}
					</button>
					<div class="p-4">
						<div class="flex justify-between items-start mb-2">
							<button class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer text-left" onclick={() => goto(`/products/${product.id}`)} tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(`/products/${product.id}`); } }}>
								{product.name}
							</button>
							<button
								onclick={() => removeFromSaved(product.id)}
								class="text-red-500 hover:text-red-700 p-1"
								title="Remove from saved"
							>
								<Heart class="h-5 w-5 fill-current" />
							</button>
						</div>

						{#if product.brand}
							<p class="text-sm text-gray-500 mt-1">{product.brand}</p>
						{/if}

						<p class="mt-1 text-gray-600 line-clamp-2">{product.description}</p>

						<div class="mt-2 flex items-center justify-between">
							<span class="text-sm text-gray-500">{product.category}</span>
							<span class="text-sm text-gray-500">Stock: {product.inStock}</span>
						</div>

						<div class="mt-4 flex items-center justify-between">
							<span class="text-xl font-bold text-gray-900">${product.price}</span>
							<button
								onclick={() => addToCart(product)}
								disabled={product.inStock === 0}
								class="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								<ShoppingCart class="mr-1 h-4 w-4" />
								{product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>