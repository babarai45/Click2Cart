<script lang="ts">
	import { cart } from '$lib/stores';
	import { Minus, Plus, Trash2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import type { CartItem } from '$lib/types';

	let cartItems: CartItem[] = $state([]);

	cart.subscribe((value) => (cartItems = value));

	function updateQuantity(productId: number, quantity: number) {
		if (quantity <= 0) {
			removeItem(productId);
			return;
		}
		cart.update((items) =>
			items.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
		);
	}

	function removeItem(productId: number) {
		cart.update((items) => items.filter((item) => item.product.id !== productId));
	}

	let total = $derived(
		cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
	);
</script>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

	{#if cartItems.length === 0}
		<p class="text-gray-600">Your cart is empty.</p>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow-md">
			<div class="divide-y divide-gray-200">
				{#each cartItems as item (item.product.id)}
					<div class="flex items-center p-6">
						<div class="flex-1">
							<h3 class="text-lg font-semibold text-gray-900">{item.product.name}</h3>
							<p class="text-gray-600">{item.product.description}</p>
							<p class="mt-2 text-lg font-bold text-gray-900">${item.product.price}</p>
						</div>
						<div class="flex items-center space-x-2">
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity - 1)}
								class="rounded p-1 hover:bg-gray-100"
							>
								<Minus class="h-4 w-4" />
							</button>
							<span class="rounded border px-3 py-1">{item.quantity}</span>
							<button
								onclick={() => updateQuantity(item.product.id, item.quantity + 1)}
								class="rounded p-1 hover:bg-gray-100"
							>
								<Plus class="h-4 w-4" />
							</button>
							<button
								onclick={() => removeItem(item.product.id)}
								class="rounded p-2 text-red-600 hover:bg-red-50"
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
			<div class="bg-gray-50 px-6 py-4">
				<div class="flex items-center justify-between">
					<span class="text-xl font-bold text-gray-900">Total: ${total.toFixed(2)}</span>
					<button
						onclick={() => goto('/checkout')}
						class="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
					>
						Checkout
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
