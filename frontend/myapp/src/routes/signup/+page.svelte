<script lang="ts">
	import { user } from '$lib/stores';
	import { goto } from '$app/navigation';

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function signup() {
		if (loading) return;

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name, email, password })
			});

			const data = await response.json();

			if (response.ok) {
				user.set(data.user);
				goto('/');
			} else {
				error = data.error || 'Sign up failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-md">
	<h2 class="mb-6 text-center text-2xl font-bold">Sign Up</h2>
	{#if error}
		<p class="mb-4 text-red-500">{error}</p>
	{/if}
	<form onsubmit={signup} class="space-y-4">
		<div>
			<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if loading}
				Signing up...
			{:else}
				Sign Up
			{/if}
		</button>
	</form>
	<p class="mt-4 text-center">
		Already have an account? <a href="/signin" class="text-blue-600 hover:text-blue-800">Sign in</a>
	</p>
</div>
