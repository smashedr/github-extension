<script setup lang="ts">
import { ref } from 'vue'
import { getOwnerRepo } from '@/utils/github.ts'
// import Logo from '@/assets/crx.svg'

window.addEventListener('keydown', handleKeyboard)

const show = ref(false)

const toggle = () => (show.value = !show.value)

function handleKeyboard(e: KeyboardEvent) {
  // console.debug('handleKeyboard:', e)
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) {
    return
  }
  // if (e.code === 'Escape') {
  //   e.preventDefault()
  //   e.target?.blur()
  // }
  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) {
    return
  }
  if (['KeyT'].includes(e.code)) {
    toggle()
  } else if (['KeyE'].includes(e.code)) {
    console.log('The E')
    chrome.runtime.sendMessage('openPopup')
  } else if (['KeyR'].includes(e.code)) {
    console.log('The R')
    const result = getOwnerRepo(window.location.href)
    console.log('result:', result)
    if (result) {
      const url = `${result.url}/releases`
      console.log('url:', url)
      // history.pushState(null, '', url)
      // window.dispatchEvent(new PopStateEvent('popstate', { state: null }))
      navigateTo(url)
    }
  }
}

function navigateTo(url: string): void {
  if (window.location.href === url) return
  const a = document.createElement('a')
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<template>
  <div class="popup-container">
    <div v-show="show" class="popup-content" :class="show ? 'opacity-100' : 'opacity-0'">
      <h1>Ralf Broke This</h1>
    </div>
    <button class="toggle-button" @click="toggle()">
      <img src="@/assets/logo.svg" alt="T" class="button-icon" />
    </button>
  </div>
</template>

<style scoped>
.popup-container {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 1.25rem;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  font-family: ui-sans-serif, system-ui, sans-serif;
  user-select: none;
  line-height: 1em;
}

.popup-content {
  background-color: white;
  color: #1f2937;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: max-content;
  height: min-content;
  padding: 0.5rem 1rem;
  margin: auto 0.5rem 0 0;
  transition: opacity 300ms;
}

.toggle-button {
  display: flex;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  /*box-shadow:*/
  /*  0 1px 3px 0 rgb(0 0 0 / 0.1),*/
  /*  0 1px 2px -1px rgb(0 0 0 / 0.1);*/
  cursor: pointer;
  border: none;
  background-color: transparent;
}

.toggle-button:hover {
  background-color: #34495e;
}

.button-icon {
  padding: 4px;
}
</style>
