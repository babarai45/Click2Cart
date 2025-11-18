<script lang="ts">
	import { user } from '$lib/stores';
	import { goto } from '$app/navigation';
	import type { Order } from '$lib/types';

	let orders: Order[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	user.subscribe(async (userValue) => {
		if (userValue) {
			await loadOrders();
		} else {
			orders = [];
		}
	});

	async function loadOrders() {
		try {
			loading = true;
			const response = await fetch('/api/orders');
			if (response.ok) {
				orders = await response.json();
			} else {
				error = 'Failed to load orders';
			}
		} catch (err) {
			error = 'Failed to load orders';
		} finally {
			loading = false;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

	{#if !$user}
		<div class="text-center">
			<p class="text-gray-600 mb-4">Please sign in to view your orders.</p>
			<a href="/signin" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Sign In</a>
		</div>
	{:else if loading}
		<div class="text-center">
			<p class="text-gray-600">Loading orders...</p>
		</div>
	{:else if error}
		<div class="text-center">
			<p class="text-red-600">{error}</p>
		</div>
	{:else if orders.length === 0}
		<div class="text-center">
			<p class="text-gray-600 mb-4">You haven't placed any orders yet.</p>
			<a href="/" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Start Shopping</a>
		</div>
	{:else}
		<div class="space-y-6">
			{#each orders as order}
				<div class="bg-white rounded-lg shadow-md p-6">
					<div class="flex justify-between items-start mb-4">
						<div>
							<h3 class="text-lg font-semibold">Order #{order.id}</h3>
							<p class="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
						</div>
						<div class="text-right">
							<p class="text-lg font-semibold">{formatCurrency(order.total)}</p>
							<p class="text-sm text-gray-600 capitalize">{order.status}</p>
						</div>
					</div>

					<div class="border-t pt-4">
						<h4 class="font-medium mb-2">Items:</h4>
						<div class="space-y-2">
							{#each order.items as item}
								<div class="flex justify-between items-center">
									<div class="flex-1">
										<p class="font-medium">{item.name}</p>
										<p class="text-sm text-gray-600">Quantity: {item.quantity}</p>
									</div>
									<p class="font-medium">{formatCurrency(item.price * item.quantity)}</p>
								</div>
							{/each}
						</div>
					</div>

					{#if order.status === 'pending'}
						<div class="mt-4 pt-4 border-t">
							<p class="text-sm text-gray-600">Your order is being processed. We'll send you an update soon.</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
