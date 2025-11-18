<script lang="ts">
	import { products } from '$lib/stores';
	import { goto } from '$app/navigation';

	let name = $state('');
	let description = $state('');
	let price = $state(0);
	let category = $state('');
	let inStock = $state(0);
	let image = $state('');

	async function addProduct() {
		try {
			const response = await fetch('/api/products', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name,
					description,
					price: Number(price),
					image,
					category,
					in_stock: Number(inStock)
				})
			});

			if (response.ok) {
				goto('/admin/products');
			} else {
				const error = await response.json();
				alert(error.error || 'Failed to add product');
			}
		} catch (err) {
			alert('Network error. Please try again.');
		}
	}
</script>

<div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-900">Add New Product</h1>

	<div class="rounded-lg bg-white p-6 shadow-md">
		<form onsubmit={addProduct} class="space-y-4">
			<div>
				<label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700">Description</label>
				<textarea
					id="description"
					bind:value={description}
					required
					rows="3"
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				></textarea>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700">Price</label>
					<input
						type="number"
						id="price"
						bind:value={price}
						required
						min="0"
						step="0.01"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
				</div>

				<div>
					<label for="inStock" class="block text-sm font-medium text-gray-700">Stock Quantity</label
					>
					<input
						type="number"
						id="inStock"
						bind:value={inStock}
						required
						min="0"
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-700">Category</label>
				<input
					type="text"
					id="category"
					bind:value={category}
					required
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="image" class="block text-sm font-medium text-gray-700">Image URL</label>
				<input
					type="url"
					id="image"
					bind:value={image}
					class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div class="flex space-x-4">
				<button
					type="submit"
					class="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Add Product
				</button>
				<button
					type="button"
					onclick={() => goto('/admin')}
					class="rounded bg-gray-600 px-6 py-2 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
				>
					Cancel
				</button>
			</div>
		</form>
	</div>
</div>
