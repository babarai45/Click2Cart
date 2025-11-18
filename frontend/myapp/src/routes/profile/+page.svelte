<script lang="ts">
	import { user } from '$lib/stores';
	import { goto } from '$app/navigation';
	import type { User as UserType } from '$lib/types';

	let userValue: UserType | null = $state(null);
	let editing = $state(false);
	let name = $state('');
	let email = $state('');
	let loading = $state(false);

	user.subscribe(value => {
		userValue = value;
		if (value) {
			name = value.name;
			email = value.email;
		}
	});

	async function updateProfile() {
		if (!userValue) return;

		loading = true;
		try {
			// For now, just update local state
			user.update(u => u ? { ...u, name, email } : null);
			editing = false;
		} catch (err) {
			alert('Failed to update profile');
		} finally {
			loading = false;
		}
	}

	function logout() {
		user.set(null);
		goto('/');
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

	{#if !userValue}
		<div class="text-center">
			<p class="text-gray-600 mb-4">Please sign in to view your profile.</p>
			<a href="/signin" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Sign In</a>
		</div>
	{:else}
		<div class="bg-white rounded-lg shadow-md p-6">
			<div class="flex justify-between items-center mb-6">
				<h2 class="text-xl font-semibold">Account Information</h2>
				<button
					onclick={() => editing = !editing}
					class="text-blue-600 hover:text-blue-800"
				>
					{editing ? 'Cancel' : 'Edit Profile'}
				</button>
			</div>

			{#if editing}
				<form onsubmit={updateProfile} class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700">Name</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div>
						<label for="email" class="block text-sm font-medium text-gray-700">Email</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div class="flex space-x-4">
						<button
							type="submit"
							disabled={loading}
							class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
						<button
							type="button"
							onclick={() => editing = false}
							class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
						>
							Cancel
						</button>
					</div>
				</form>
			{:else}
				<div class="space-y-4">
					<div>
						<label for="profile-name" class="block text-sm font-medium text-gray-700">Name</label>
						<p id="profile-name" class="mt-1 text-gray-900">{userValue.name}</p>
					</div>
					<div>
						<label for="profile-email" class="block text-sm font-medium text-gray-700">Email</label>
						<p id="profile-email" class="mt-1 text-gray-900">{userValue.email}</p>
					</div>
					<div>
						<label for="profile-role" class="block text-sm font-medium text-gray-700">Role</label>
						<p id="profile-role" class="mt-1 text-gray-900">{userValue.isAdmin ? 'Administrator' : 'Customer'}</p>
					</div>
				</div>
			{/if}

			<hr class="my-6">
			<div class="flex space-x-4">
				<a href="/orders" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Orders</a>
				<button onclick={logout} class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
			</div>
		</div>
	{/if}
</div>