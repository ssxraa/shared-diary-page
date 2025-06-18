<script>
  import { onMount } from 'svelte';
  import { currentUser } from '../../stores/userStore';
  import { goto } from '$app/navigation';
  let isEditing = false;
  let editContent = '';
  let allEntries = [];
  let pagedEntries = [['']];
  let currentPage = 0;
  let modalOpen = false;
  let newEntryContent = '';
  const charsPerPage = 1300;
  const backgrounds = {
    'Nini': 'bg16.png',
    'default': 'bg11.png'
  };
  $: backgroundImage = $currentUser.username === 'Nini' ? backgrounds['Nini'] : backgrounds['default'];

  onMount(async () => {
    // Redirect if not logged in
    if (!$currentUser) {
      goto('/login');
      return;
    }

    // Fetch entries
    await loadEntries();
  });

  async function loadEntries() {
    try {
      const response = await fetch(`/api/diary/entries?diary_id=${$currentUser.diary_id}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      allEntries = data;
      pagedEntries = paginateContent(allEntries);
    } catch (error) {
      alert('Failed to load entries: ' + error.message);
    }
  }

  async function addEntry() {
    const content = newEntryContent.trim();
    if (!content) return;

    try {
      const response = await fetch('/api/diary/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diary_id: $currentUser.diary_id,
          author: $currentUser.username,
          content
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Refresh entries
      await loadEntries();
      currentPage = pagedEntries.length - 1;

      newEntryContent = '';
      modalOpen = false;
    } catch (error) {
      alert('Failed to add entry: ' + error.message);
    }
  }

  function paginateContent(entries) {
    if (entries.length === 0) return [['']];

    const allText = entries.map(e => {
      // Format the timestamp to be more readable
      const timestamp = new Date(e.timestamp).toLocaleString();
      return `${e.author} — ${timestamp}\n${e.content}\n\n`;
    }).join('');

    const pages = [];
    for (let i = 0; i < allText.length; i += charsPerPage) {
      pages.push([allText.slice(i, i + charsPerPage)]);
    }
    return pages.length ? pages : [['']];
  }

  function nextPage() {
    if (currentPage < pagedEntries.length - 1) currentPage++;
  }

  function previousPage() {
    if (currentPage > 0) currentPage--;
  }

  async function editLastEntry() {
    try {
      // First, get the last entry by the current user
      const response = await fetch(`/api/diary/entries?diary_id=${$currentUser.diary_id}`);
      const entries = await response.json();
      
      if (entries.error) throw new Error(entries.error);

      // Filter entries by current user and sort by timestamp
      const userEntries = entries
        .filter(entry => entry.author === $currentUser.username)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      if (userEntries.length === 0) {
        alert('No entries to edit');
        return;
      }

      editContent = userEntries[0].content;
      isEditing = true;
      modalOpen = true;
    } catch (error) {
      alert('Failed to get last entry: ' + error.message);
    }
  }

  async function saveEdit() {
    try {
      const response = await fetch('/api/diary/entries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diary_id: $currentUser.diary_id,
          author: $currentUser.username,
          content: editContent.trim()
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Reset edit mode and refresh entries
      isEditing = false;
      modalOpen = false;
      editContent = '';
      await loadEntries();
    } catch (error) {
      alert('Failed to save edit: ' + error.message);
    }
  }

  async function deleteLastEntry() {
    if (!confirm('Are you sure you want to delete your last entry?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/diary/entries?diary_id=${$currentUser.diary_id}&author=${$currentUser.username}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      // Refresh entries
      await loadEntries();
    } catch (error) {
      alert('Failed to delete entry: ' + error.message);
    }
  }

</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: 'VT323', monospace;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: brightness(0.3);
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    width: 80%;
    max-width: 800px;
    margin: 4rem auto;
    padding: 2rem;
    color: white;
    font-size: 1.1rem;
  }

  .page-content {
    white-space: pre-wrap;
    line-height: 1.5;
  }

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 2rem auto;
    color: white;
    font-size: 1.5rem;
  }

.left {
  background: url('/left.png') no-repeat center center;
  background-size: contain;
  width: 35px;
  height: 35px;
  text-indent: -9999px;
  overflow: hidden;
  color: transparent;
  padding: 0;
  border: none;
}

.delete {
  background: url('/x.png') no-repeat center center;
  background-size: contain;
  width: 35px;
  height: 35px;
  text-indent: -9999px;
  overflow: hidden;
  color: transparent;
  padding: 0;
  border: none;
}
.edit {
  background: url('/e.png') no-repeat center center;
  background-size: contain;
  width: 35px;
  height: 35px;
  text-indent: -9999px;
  overflow: hidden;
  color: transparent;
  padding: 0;
  border: none;
}
.left:hover, .right:hover, .entry-button:hover, .modal-content button:hover, .delete:hover, .edit:hover {
  cursor: pointer;
  opacity: 0.8;
}
.left:active, .right:active, .entry-button:active, .modal-content button:active, .delete:active, .edit:active {
  transform: translateY(1px);
}

.right {
  background: url('/right.png') no-repeat center center;
  background-size: contain;
  width: 35px;
  height: 35px;
  text-indent: -9999px;
  overflow: hidden;
  color: transparent;
  padding: 0;
  border: none;
}

.entry-button {
  display: block;
  margin: 1rem auto;
  background: url('/pixel-button.png') no-repeat center center;
  background-size: 100% 100%;
  
  color: white;
  padding: 0.5rem 1rem;
  padding-right: 0.7rem;;
  padding-left: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  background-color: transparent; 
}

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .modal-content {
    background: none;
    padding: 2rem;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  textarea {
    width: 100%;
    height: 300px;
    padding: 1rem;
    font-size: 1.1rem;
    font-family: 'VT323', monospace;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none;
  }

  .modal-content button {
  display: block;
  background: url('/pixel-button.png') no-repeat center center;
  background-size: 100% 100%;
  color: white;
  padding: 0.5rem 1rem;
  padding-right: 0.7rem;;
  padding-left: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  background-color: transparent; 
  }
</style>

<div class="background" style="background-image: url({backgroundImage})"></div>

<div class="container">
  {#if pagedEntries[currentPage]}
    <div class="page-content">
      {@html pagedEntries[currentPage][0].replace(/\n/g, '<br>')}
    </div>
  {/if}

  <div class="navigation">
    <button class="edit" on:click={editLastEntry} aria-label="edit"></button>
    <button class="left" on:click={previousPage} aria-label="left"></button>
    <span>Page {currentPage + 1} of {pagedEntries.length}</span>
    <button class="right" on:click={nextPage} aria-label="right"></button>
    <button class="delete" on:click={deleteLastEntry} aria-label="delete"></button>
  </div>
  
  <button class="entry-button" on:click={() => modalOpen = true}>
    Add Entry
  </button>
</div>

{#if modalOpen}
  <div class="modal">
    <div class="modal-content">
    <h2 style="color: white;">{isEditing ? 'Edit Last Entry' : 'New Entry'}</h2>
    {#if isEditing}
      <textarea
        bind:value={editContent}
        placeholder="Write your entry here..."
      ></textarea>
    {:else}
      <textarea
        bind:value={newEntryContent}
        placeholder="Write your entry here..."
      ></textarea>
    {/if}
    {#if isEditing}
      <button on:click={saveEdit}>{isEditing ? 'Save Changes' : 'Add Entry'}</button>
    {:else}
      <button on:click={addEntry}>{isEditing ? 'Save Changes' : 'Add Entry'}</button>
    {/if}
      <button on:click={() => {modalOpen = false; isEditing = false; editContent = ''; newEntryContent = '';}}>Cancel</button>
    </div>
  </div>
{/if}

