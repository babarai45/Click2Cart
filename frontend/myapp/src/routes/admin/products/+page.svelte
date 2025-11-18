<script lang="ts">
	import { products } from '$lib/stores';
	import { Trash2, Edit, Plus, Upload } from 'lucide-svelte';
	import type { Product } from '$lib/types';

	let productsList: Product[] = $state([]);
	let loading = $state(true);
	let showForm = $state(false);
	let editingProduct: Product | null = $state(null);
	let uploading = $state(false);

	// Form fields
	let name = $state('');
	let description = $state('');
	let price = $state(0);
	let category = $state('');
	let inStock = $state(0);
	let brand = $state('');
	let features = $state('');
	let imageFile: File | null = $state(null);
	let imageUrl = $state('');
	let useFileUpload = $state(true);

	// Load products from API
	async function loadProducts() {
		try {
			const response = await fetch('/api/products');
			if (response.ok) {
				productsList = await response.json();
			}
		} catch (err) {
			console.error('Failed to load products:', err);
		} finally {
			loading = false;
		}
	}

	loadProducts();

	async function handleImageUpload(file: File) {
		uploading = true;
		try {
			const formData = new FormData();
			formData.append('image', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				const result = await response.json();
				imageUrl = result.imageUrl;
			} else {
				alert('Failed to upload image');
			}
		} catch (err) {
			alert('Upload failed');
		} finally {
			uploading = false;
		}
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			imageFile = file;
			handleImageUpload(file);
		}
	}

	async function saveProduct() {
		try {
			const productData = {
				name,
				description,
				price: Number(price),
				image: imageUrl,
				category,
				inStock: Number(inStock),
				brand,
				features
			};

			let response;
			if (editingProduct) {
				response = await fetch(`/api/products/${editingProduct.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(productData)
				});
			} else {
				response = await fetch('/api/products', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(productData)
				});
			}

			if (response.ok) {
				loadProducts();
				resetForm();
			} else {
				alert('Failed to save product');
			}
		} catch (err) {
			alert('Failed to save product');
		}
	}

	async function deleteProduct(productId: number) {
		if (!confirm('Are you sure you want to delete this product?')) return;

		try {
			const response = await fetch(`/api/products/${productId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				loadProducts();
			} else {
				alert('Failed to delete product');
			}
		} catch (err) {
			alert('Failed to delete product');
		}
	}

	function editProduct(product: Product) {
		editingProduct = product;
		name = product.name;
		description = product.description;
		price = product.price;
		category = product.category;
		inStock = product.inStock;
		brand = product.brand;
		features = product.features;
		imageUrl = product.image;
		showForm = true;
	}

	function resetForm() {
		showForm = false;
		editingProduct = null;
		name = '';
		description = '';
		price = 0;
		category = '';
		inStock = 0;
		brand = '';
		features = '';
		imageFile = null;
		imageUrl = '';
		useFileUpload = true;
	}
</script>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<div class="flex justify-between items-center mb-8">
		<h1 class="text-3xl font-bold text-gray-900">Manage Products</h1>
		<button
			onclick={() => showForm = true}
			class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
		>
			<Plus class="h-4 w-4 mr-2" />
			Add Product
		</button>
	</div>

	{#if showForm}
		<div class="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 class="text-xl font-semibold mb-4">
				{editingProduct ? 'Edit Product' : 'Add New Product'}
			</h2>

			<form onsubmit={saveProduct} class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="product-name" class="block text-sm font-medium text-gray-700">Name</label>
						<input
							id="product-name"
							type="text"
							bind:value={name}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="product-category" class="block text-sm font-medium text-gray-700">Category</label>
						<input
							id="product-category"
							type="text"
							bind:value={category}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="product-price" class="block text-sm font-medium text-gray-700">Price</label>
						<input
							id="product-price"
							type="number"
							step="0.01"
							bind:value={price}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="product-stock" class="block text-sm font-medium text-gray-700">Stock</label>
						<input
							id="product-stock"
							type="number"
							bind:value={inStock}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div>
						<label for="product-brand" class="block text-sm font-medium text-gray-700">Brand</label>
						<input
							id="product-brand"
							type="text"
							bind:value={brand}
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="product-features" class="block text-sm font-medium text-gray-700">Features</label>
						<textarea
							id="product-features"
							bind:value={features}
							rows="3"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							placeholder="Enter product features separated by commas"
						></textarea>
					</div>

					<div class="md:col-span-2">
						<label for="product-description" class="block text-sm font-medium text-gray-700">Description</label>
						<textarea
							id="product-description"
							bind:value={description}
							rows="4"
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						></textarea>
					</div>

					<div class="md:col-span-2">
						<h3 class="block text-sm font-medium text-gray-700 mb-2">Image</h3>

						<div class="flex items-center space-x-4 mb-4">
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={useFileUpload}
									value={true}
									class="mr-2"
								/>
								Upload File
							</label>
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={useFileUpload}
									value={false}
									class="mr-2"
								/>
								Image URL
							</label>
						</div>

						{#if useFileUpload}
							<div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
								<div class="text-center">
									<Upload class="mx-auto h-12 w-12 text-gray-400" />
									<div class="mt-4">
										<label class="cursor-pointer">
											<span class="mt-2 block text-sm font-medium text-gray-900">
												{imageFile ? imageFile.name : 'Upload an image'}
											</span>
											<input
												type="file"
												accept="image/*"
												onchange={handleFileSelect}
												class="hidden"
											/>
										</label>
									</div>
									{#if uploading}
										<p class="mt-2 text-sm text-gray-500">Uploading...</p>
									{/if}
								</div>
							</div>
						{:else}
							<input
								type="url"
								bind:value={imageUrl}
								placeholder="https://example.com/image.jpg"
								class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
							/>
						{/if}

						{#if imageUrl}
							<div class="mt-4">
								<img src={imageUrl} alt="Preview" class="h-32 w-32 object-cover rounded" />
							</div>
						{/if}
					</div>
				</div>

				<div class="flex space-x-4">
					<button
						type="submit"
						class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
					>
						{editingProduct ? 'Update Product' : 'Add Product'}
					</button>
					<button
						type="button"
						onclick={resetForm}
						class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="overflow-hidden rounded-lg bg-white shadow-md">
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
						<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Category</th>
						<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Price</th>
						<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Stock</th>
						<th class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each productsList as product (product.id)}
						<tr>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{product.name}</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{product.category}</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-900">${product.price}</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{product.inStock}</td>
							<td class="px-6 py-4 text-sm font-medium whitespace-nowrap">
								<button onclick={() => editProduct(product)} class="mr-4 text-blue-600 hover:text-blue-900">
									<Edit class="h-4 w-4" />
								</button>
								<button onclick={() => deleteProduct(product.id)} class="text-red-600 hover:text-red-900">
									<Trash2 class="h-4 w-4" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
