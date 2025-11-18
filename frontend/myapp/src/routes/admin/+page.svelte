<script lang="ts">
	import { products, orders } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import type { Product, Order } from '$lib/types';

	let productsList: Product[] = $state([]);
	let ordersList: Order[] = $state([]);
	let loading = $state(true);

	// Load data from APIs
	async function loadData() {
		try {
			const [productsRes, ordersRes] = await Promise.all([
				fetch('/api/products'),
				fetch('/api/admin/orders')
			]);

			if (productsRes.ok) {
				productsList = await productsRes.json();
			}

			if (ordersRes.ok) {
				ordersList = await ordersRes.json();
			}
		} catch (err) {
			console.error('Failed to load data:', err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Admin Dashboard</h1>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="text-lg font-semibold text-gray-900">Total Products</h3>
			<p class="text-3xl font-bold text-blue-600">{productsList.length}</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="text-lg font-semibold text-gray-900">Total Orders</h3>
			<p class="text-3xl font-bold text-green-600">{ordersList.length}</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-md">
			<h3 class="text-lg font-semibold text-gray-900">Revenue</h3>
			<p class="text-3xl font-bold text-purple-600">
				${ordersList.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
			</p>
		</div>
	</div>

	<div class="mb-6 flex space-x-4">
		<button
			onclick={() => goto('/admin/add-product')}
			class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
		>
			Add Product
		</button>
		<button
			onclick={() => goto('/admin/products')}
			class="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
		>
			Manage Products
		</button>
		<button
			onclick={() => goto('/admin/orders')}
			class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
		>
			Manage Orders
		</button>
	</div>

	<div class="rounded-lg bg-white p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">Recent Orders</h2>
		{#if ordersList.length === 0}
			<p class="text-gray-600">No orders yet.</p>
		{:else}
			<div class="space-y-4">
				{#each ordersList.slice(-5) as order (order.id)}
					<div class="flex items-center justify-between border-b pb-2">
						<div>
							<p class="font-medium">Order #{order.id}</p>
							<p class="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
						</div>
						<div class="text-right">
							<p class="font-medium">${order.total.toFixed(2)}</p>
							<span
								class="rounded-full px-2 py-1 text-xs
								{order.status === 'pending'
									? 'bg-yellow-100 text-yellow-800'
									: order.status === 'shipped'
										? 'bg-blue-100 text-blue-800'
										: 'bg-green-100 text-green-800'}"
							>
								{order.status}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
