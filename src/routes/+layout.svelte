<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	function setBodyClass(path: string) {
		const body = document.body;
		if (!body) return;

		if (path === '/') {
			body.className = 'body';
		} else {
			body.className = '';
		}
	}

	onMount(() => {
		setBodyClass(window.location.pathname);
		afterNavigate(({ to }) => {
			setBodyClass(to.url.pathname);
		});
	});
</script>

<slot />

