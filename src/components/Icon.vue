<script setup>
// Iconițe simple, desenate inline, ca site-ul să nu încarce biblioteci de iconițe.
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 20 },
});

const PATHS = {
  youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3Z"/>',
  kick: '<path d="M4 3h5v5h2V6h2V3h7v6h-2v2h-2v2h2v2h2v6h-7v-3h-2v-2H9v5H4Z"/>',
  tiktok: '<path d="M16.5 3c.4 2.2 1.8 3.7 4 3.9v3.2a7.4 7.4 0 0 1-4-1.2v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.3a2.5 2.5 0 1 0 1.7 2.3V3Z"/>',
  instagram: '<path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4Zm4.5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5-3.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z"/>',
  discord: '<path d="M19.3 5.3A16 16 0 0 0 15.4 4l-.5 1a14.7 14.7 0 0 0-5.8 0l-.5-1a16 16 0 0 0-3.9 1.3C2.2 9 1.6 12.6 1.9 16.2a16 16 0 0 0 4.8 2.4l1-1.6a10 10 0 0 1-1.6-.8l.4-.3a11.4 11.4 0 0 0 11 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6a16 16 0 0 0 4.8-2.4c.4-4.2-.7-7.8-2.8-10.9ZM8.7 14c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z"/>',
  telegram: '<path d="M21.5 3.6 2.9 10.8c-1.3.5-1.3 1.2-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8L22.9 5c.3-1.3-.5-1.9-1.4-1.4ZM9 14.3l9.2-5.8c.4-.3.8-.1.5.2L11 15.8l-.3 3.3Z"/>',
  play: '<path d="M8 5v14l11-7Z"/>',
  arrow: '<path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  copy: '<path d="M9 9h11v11H9Zm-4 6H4V4h11v1" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  eye: '<path d="M12 5c5 0 9 4.5 10 7-1 2.5-5 7-10 7S3 14.5 2 12c1-2.5 5-7 10-7Zm0 3.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/>',
  heart: '<path d="M12 20.5 4.2 13A5 5 0 0 1 12 6.7 5 5 0 0 1 19.8 13Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  close: '<path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
};
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" v-html="PATHS[name]"></svg>
</template>
