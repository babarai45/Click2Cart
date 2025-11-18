<script lang="ts">
	import { orders } from '$lib/stores';
	import type { Order } from '$lib/types';

	let ordersList: Order[] = $state([]);
	let loading = $state(true);

	// Load orders from API
	async function loadOrders() {
		try {
			const response = await fetch('/api/admin/orders');
			if (response.ok) {
				ordersList = await response.json();
			}
		} catch (err) {
			console.error('Failed to load orders:', err);
		} finally {
			loading = false;
		}
	}

	loadOrders();

	async function updateStatus(orderId: number, status: string) {
		try {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status })
			});

			if (response.ok) {
				loadOrders(); // Reload orders
			} else {
				alert('Failed to update order status');
			}
		} catch (err) {
			alert('Network error');
		}
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Manage Orders</h1>

	{#if ordersList.length === 0}
		<p class="text-gray-600">No orders yet.</p>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow-md">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Order ID</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Date</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Total</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Status</th
							>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
								>Actions</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each ordersList as order (order.id)}
							<tr>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
									>#{order.id}</td
								>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500"
									>{new Date(order.createdAt).toLocaleDateString()}</td
								>
								<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900"
									>${order.total.toFixed(2)}</td
								>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex rounded-full px-2 text-xs leading-5 font-semibold
										{order.status === 'pending'
											? 'bg-yellow-100 text-yellow-800'
											: order.status === 'shipped'
												? 'bg-blue-100 text-blue-800'
												: 'bg-green-100 text-green-800'}"
									>
										{order.status}
									</span>
								</td>
								<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
									{#if order.status === 'pending'}
										<button
											onclick={() => updateStatus(order.id, 'shipped')}
											class="mr-4 text-blue-600 hover:text-blue-900"
										>
											Mark Shipped
										</button>
									{:else if order.status === 'shipped'}
										<button
											onclick={() => updateStatus(order.id, 'delivered')}
											class="text-green-600 hover:text-green-900"
										>
											Mark Delivered
										</button>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
