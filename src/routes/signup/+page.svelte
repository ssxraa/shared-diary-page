<script>
  import { goto } from '$app/navigation';

  let username1 = '';
  let username2 = '';
  let password = '';

  async function handleSignup() {
    if (!username1 || !username2 || !password) {
      alert('Please fill in all fields!');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username1, username2, password })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      alert('Diary created successfully! You can now login.');
      goto('/login');
    } catch (error) {
      alert('Failed to create diary: ' + error.message);
    }
  }
</script>

<style>
 .login {
    display: flex;
    font-family: 'PF Pixelscript pro';
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: rgb(173, 217, 255);
    margin: 0;
    min-height: 100vh;
    box-sizing: border-box;
  }

  .headline {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: #333;
    text-align: center;
  }

  .pixel-button {
    background: none;
    border: none;
    margin: 4px 2px;
    cursor: pointer;
    padding: 0;
    transform: translateX(3px);
    width: 150px;
    height: 50px;
    background-image: url('/pixel-pressed.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    image-rendering: pixelated;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'vt323 regular';
    font-size: 24px;
    color: white;
    text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
  }

  .passcontainer {
    background: none;
    background-image: url('/pixel-button.png');
    border: none;
    width: 300px;
    height: 66px;
    margin-bottom: 1rem;
    font-size: 16px; 
    font-family: 'PF Pixelscript pro', monospace;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;

    color: #ffffff;
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    margin-bottom: 1rem;
  }
.pixel-button:hover {
    filter: brightness(1.1);
  }

.pixel-button:active {
    filter: brightness(0.9);
    transform: translateY(1px);
  }

    .passcontainer input {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    color: #ffffff;
    font-size: 16px; 
    font-family: 'PF Pixelscript pro', monospace;
    outline: none;
    padding-left: 20px;
    padding-right: 20px;
  }
  .passcontainer input::placeholder {
    color: #ffffff;
    opacity: 0.8;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
</style>

<div class="login">
  <h1 class="headline">Create your diary~</h1>
  <div class="input-container">
    <div class="passcontainer">
      <input 
        type="text" 
        bind:value={username1} 
        placeholder=" first username~" 
      />
    </div>
    <div class="passcontainer">
      <input 
        type="text" 
        bind:value={username2} 
        placeholder=" second username~" 
      />
    </div>
    <div class="passcontainer">
      <input 
        type="password" 
        bind:value={password} 
        placeholder=" shared password~" 
      />
    </div>
  </div>
  <button type="button" class="pixel-button" on:click={handleSignup}>
    CREATE
  </button>
</div>