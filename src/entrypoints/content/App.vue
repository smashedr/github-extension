<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { getOwnerRepo } from '@/utils/github.ts'
import { getOptions } from '@/utils/options.ts'
import BadgesView from '@/components/BadgesView.vue'

const owner = ref('')
const repo = ref('')

const showIcon = ref(false)
const showPopup = ref(false)

const togglePopup = () => (showPopup.value = !showPopup.value)
const toggleIcon = () => {
  showIcon.value = !showIcon.value
  if (!showIcon.value) showPopup.value = false
}

async function onChanged(changes: Record<string, any>) {
  // console.log('useBackground - onChanged:', changes)
  const items = changes.options // NOTE: Lazy Typing...
  // console.log('items:', items)
  if (!items?.oldValue || !items?.newValue) return
  if (items?.oldValue?.siteIcon !== items?.newValue?.siteIcon) {
    console.log('%c Site Icon Change Detected.', 'color: Yellow')
    showIcon.value = items?.newValue?.siteIcon
  }
}

function handleKeyboard(e: KeyboardEvent) {
  // console.debug('handleKeyboard:', e)
  const target = e.target as HTMLInputElement
  if (['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(target?.tagName)) return
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return
  if (e.key.length !== 1 || e.key === ' ') return

  if (['KeyT'].includes(e.code)) {
    console.log('Pressed T')
    togglePopup()
  } else if (['KeyE'].includes(e.code)) {
    console.log('Pressed E')
    chrome.runtime.sendMessage('openPopup')
  } else if (['KeyR'].includes(e.code)) {
    console.log('Pressed R')
    const result = getOwnerRepo(window.location.href)
    console.log('result:', result)
    if (result) navigateTo(`${result.url}/releases`)
  } else if (e.code === 'KeyH') {
    console.log('Pressed H')
    navigateTo('https://github.com/feed') // Old Home
  }
}

function navigateTo(url: string): void {
  console.log('navigateTo:', url)
  if (window.location.href === url) return
  const a = document.createElement('a')
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onMounted(() => {
  console.log('%c onMounted', 'color: SpringGreen', chrome.runtime.id)
  chrome.storage.sync.onChanged.addListener(onChanged)
  window.addEventListener('keydown', handleKeyboard)

  // const options = await getOptions()
  // if (options.siteIcon) toggleIcon()
  getOptions().then((options) => {
    if (options.siteIcon) toggleIcon()
  })
  console.log('window.location.href', window.location.href)
  const result = getOwnerRepo(window.location.href)
  console.log('result', result)
  if (result) {
    owner.value = result.owner
    repo.value = result.name
  } else {
    console.log('no results from getOwnerRepo.')
  }
})

onUnmounted(() => {
  console.log('%c onUnmounted', 'color: Orange')
  chrome.storage.sync.onChanged.removeListener(onChanged)
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<template>
  <div class="popup-container">
    <div v-show="showPopup" class="popup-content">
      <BadgesView v-if="owner && repo" :owner :repo class="badges" />
      <div v-else>No Repository Detected. This section is not finished.</div>
    </div>
    <button v-show="showIcon" class="toggle-button" @click="togglePopup()">
      <img src="@/assets/icon.svg" alt="T" class="button-icon" />
    </button>
  </div>
</template>

<style scoped>
.badges {
  max-width: 480px;
}

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
  max-width: calc(100vw - 2.5rem);
  max-height: calc(100vh - 2.5rem);
}

.popup-content {
  background-color: white;
  color: #1f2937;
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  width: max-content;
  max-width: 100%;
  max-height: calc(100vh - 2.5rem);
  overflow: auto;
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
