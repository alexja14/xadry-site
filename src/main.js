import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// Efectele de apariție la scroll ascund elementele doar când rulează JavaScript (vezi .reveal în style.css).
document.documentElement.classList.add('js');
createApp(App).mount('#app');
