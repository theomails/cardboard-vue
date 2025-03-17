import './assets/base.css'
import './assets/app.css'

import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faRotate, faCaretDown, faDownload, faPalette, faArrowRotateLeft, faCopy, faSquarePlus, faSquareUpRight } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add icons to the library
library.add(faRotate, faCaretDown, faDownload, faPalette, faArrowRotateLeft, faCopy, faSquarePlus, faSquareUpRight, faCircleXmark);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
