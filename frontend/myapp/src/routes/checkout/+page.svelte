<script lang="ts">
	import { cart, orders, user } from '$lib/stores';
	import { goto } from '$app/navigation';
	import type { CartItem, User as UserType } from '$lib/types';

	let cartItems: CartItem[] = $state([]);
	let userValue: UserType | null = $state(null);
	let address = $state('');
	let paymentMethod = $state('card');

	cart.subscribe((value) => (cartItems = value));
	user.subscribe((value) => (userValue = value));

	let total = $derived(
		cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	);

	async function placeOrder() {
		if (!userValue) {
			goto('/signin');
			return;
		}

		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: userValue.id,
					items: cartItems,
					total,
					shippingAddress: address,
					paymentMethod
				})
			});

			if (response.ok) {
				cart.set([]);
				goto('/orders');
			} else {
				const error = await response.json();
				alert(error.error || 'Failed to place order');
			}
		} catch (err) {
			alert('Network error. Please try again.');
		}
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Checkout</h1>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<div>
			<h2 class="mb-4 text-xl font-semibold">Order Summary</h2>
			<div class="rounded-lg bg-white p-6 shadow-md">
				{#each cartItems as item (item.product.id)}
					<div class="flex justify-between py-2">
						<span>{item.product.name} x{item.quantity}</span>
						<span>${(item.product.price * item.quantity).toFixed(2)}</span>
					</div>
				{/each}
				<hr class="my-4" />
				<div class="flex justify-between text-lg font-bold">
					<span>Total</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-semibold">Shipping & Payment</h2>
			<div class="space-y-4 rounded-lg bg-white p-6 shadow-md">
				<div>
					<label for="address" class="block text-sm font-medium text-gray-700"
						>Shipping Address</label
					>
					<textarea
						id="address"
						bind:value={address}
						required
						rows="3"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					></textarea>
				</div>

				<div>
					<label for="payment" class="block text-sm font-medium text-gray-700">Payment Method</label
					>
					<select
						id="payment"
						bind:value={paymentMethod}
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					>
						<option value="card">Credit Card</option>
						<option value="paypal">PayPal</option>
					</select>
				</div>

				<button
					onclick={placeOrder}
					class="w-full rounded-md bg-blue-600 px-4 py-3 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Place Order
				</button>
			</div>
		</div>
	</div>
</div>
