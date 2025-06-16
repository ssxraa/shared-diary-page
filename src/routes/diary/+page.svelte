<!-- Diary page -->
<script lang="ts">
  import { onMount } from 'svelte';

  let currentPage = 1;
  let totalPages = 1;
  let content = '';

  onMount(() => {
    console.log('Diary page mounted');
  });

  $: if (content) {
    savePage(content);
  }

  async function savePage(text: string) {
    await fetch('/api/entries', {
      method: 'POST',
      body: JSON.stringify({
        content: text,
        page: currentPage
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function nextPage() {
    if (currentPage === totalPages) {
      totalPages++;
    }
    currentPage++;
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }
</script>

<div class="diary-container">
  <textarea
    bind:value={content}
    placeholder="Write your thoughts..."
  ></textarea>

  <div class="navigation">
    <button on:click={previousPage}>←</button>
    <span>Page {currentPage} of {totalPages}</span>
    <button on:click={nextPage}>→</button>
  </div>
</div>
