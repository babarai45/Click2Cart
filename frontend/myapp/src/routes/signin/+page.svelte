<script lang="ts">
	import { user } from '$lib/stores';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function signin() {
		if (loading) return;

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (response.ok) {
				user.set(data.user);
				goto('/');
			} else {
				error = data.error || 'Sign in failed';
			}
		} catch (err) {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-8 shadow-md">
	<h2 class="mb-6 text-center text-2xl font-bold">Sign In</h2>
	{#if error}
		<p class="mb-4 text-red-500">{error}</p>
	{/if}
	<form onsubmit={signin} class="space-y-4">
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
				Signing in...
			{:else}
				Sign In
			{/if}
		</button>
	</form>
	<p class="mt-4 text-center">
		Don't have an account? <a href="/signup" class="text-blue-600 hover:text-blue-800">Sign up</a>
	</p>
	<p class="mt-2 text-center text-sm text-gray-600">
		Demo: admin@example.com / admin or user@example.com / user
	</p>
</div>
