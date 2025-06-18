<script lang="ts">
  import { goto } from '$app/navigation';
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
    font-family: 'VT323', monospace;
    font-size: 24px;
    color: white;
    text-shadow: 1px 1px 0px rgba(0,0,0,0.5);
  }

  .pixel-button:hover {
    filter: brightness(1.1);
  }

  .pixel-button:active {
    filter: brightness(0.9);
    transform: translateY(1px);
  }

  .button-container {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
</style>

<div class="login">
  <h1 class="headline">Nini and Sora's secret diary~</h1>
  <div class="button-container">
    <button type="button" class="pixel-button" on:click={() => goto('/login')}>
      LOGIN
    </button>
    <button type="button" class="pixel-button" on:click={() => goto('/signup')}>
      SIGN UP
    </button>
  </div>
</div>