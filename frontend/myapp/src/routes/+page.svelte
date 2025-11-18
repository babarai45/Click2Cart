<script lang="ts">
	import { cart } from '$lib/stores';
	import { Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { Product } from '$lib/types';

	let productsList: Product[] = $state([]);
	let loading = $state(true);
	let error = $state('');
	let searchTerm = $state('');
	let selectedCategory = $state('All');

	// Load products from API
	async function loadProducts() {
		try {
			const response = await fetch('/api/products');
			if (response.ok) {
				productsList = await response.json();
			} else {
				error = 'Failed to load products';
			}
		} catch (err) {
			error = 'Network error';
		} finally {
			loading = false;
		}
	}

	// Load products on mount
	loadProducts();

	// Filter products based on search and category
	let filteredProducts = $derived(
		productsList.filter(product => {
			const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
								product.description.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	// Get unique categories
	let categories = $derived(['All', ...new Set(productsList.map(p => p.category))]);

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
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Products</h1>

	<!-- Search and Filter -->
	<div class="mb-6 flex flex-col sm:flex-row gap-4">
		<div class="flex-1">
			<input
				type="text"
				placeholder="Search products..."
				bind:value={searchTerm}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			/>
		</div>
		<div class="sm:w-48">
			<select
				bind:value={selectedCategory}
				class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center items-center h-64">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
		</div>
	{:else if error}
		<div class="text-center text-red-600">
			<p>{error}</p>
			<button onclick={loadProducts} class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
				Try Again
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredProducts as product (product.id)}
				<div class="overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105 cursor-pointer" onclick={() => goto(`/products/${product.id}`)} role="button" tabindex="0" onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goto(`/products/${product.id}`); } }}>
					<div class="aspect-square bg-gray-200 overflow-hidden">
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
					</div>
					<div class="p-4">
						<h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">{product.name}</h3>
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
								onclick={(e) => {
									e.stopPropagation();
									addToCart(product);
								}}
								disabled={product.inStock === 0}
								class="flex items-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
							>
								<Plus class="mr-1 h-4 w-4" />
								{product.inStock === 0 ? 'Out of Stock' : 'Add to Cart'}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredProducts.length === 0 && !loading}
			<div class="text-center py-12">
				<p class="text-gray-500 text-lg">No products found matching your criteria.</p>
			</div>
		{/if}
	{/if}
</div>

<!-- Footer -->
<footer class="bg-gray-900 text-white mt-16">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<div class="col-span-1 md:col-span-2">
				<h3 class="text-2xl font-bold mb-4">🛒 Click2Cart</h3>
				<p class="text-gray-300 mb-4">
					Your one-stop destination for all your shopping needs. We offer a wide range of products
					with fast delivery and excellent customer service.
				</p>
				<div class="flex space-x-4">
					<button class="text-gray-400 hover:text-white transition-colors text-2xl" aria-label="Facebook">
						📘
					</button>
					<button class="text-gray-400 hover:text-white transition-colors text-2xl" aria-label="Twitter">
						🐦
					</button>
					<button class="text-gray-400 hover:text-white transition-colors text-2xl" aria-label="Instagram">
						📷
					</button>
					<button class="text-gray-400 hover:text-white transition-colors text-2xl" aria-label="LinkedIn">
						💼
					</button>
				</div>
			</div>

			<div>
				<h4 class="text-lg font-semibold mb-4">Quick Links</h4>
				<ul class="space-y-2">
					<li><a href="/" class="text-gray-300 hover:text-white transition-colors">Home</a></li>
					<li><a href="/products" class="text-gray-300 hover:text-white transition-colors">Products</a></li>
					<li><a href="/categories" class="text-gray-300 hover:text-white transition-colors">Categories</a></li>
					<li><a href="/about" class="text-gray-300 hover:text-white transition-colors">About Us</a></li>
					<li><a href="/contact" class="text-gray-300 hover:text-white transition-colors">Contact</a></li>
				</ul>
			</div>

			<div>
				<h4 class="text-lg font-semibold mb-4">Customer Service</h4>
				<ul class="space-y-2">
					<li><a href="/help" class="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
					<li><a href="/shipping" class="text-gray-300 hover:text-white transition-colors">Shipping Info</a></li>
					<li><a href="/returns" class="text-gray-300 hover:text-white transition-colors">Returns</a></li>
					<li><a href="/faq" class="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
					<li><a href="/support" class="text-gray-300 hover:text-white transition-colors">Support</a></li>
				</ul>
			</div>
		</div>

		<hr class="border-gray-700 my-8">

		<div class="flex flex-col md:flex-row justify-between items-center">
			<p class="text-gray-400 text-sm">
				© 2025 Click2Cart. All rights reserved.
			</p>
			<div class="flex space-x-6 mt-4 md:mt-0">
				<a href="/privacy" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
				<a href="/terms" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
				<a href="/cookies" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
			</div>
		</div>
	</div>
</footer>
