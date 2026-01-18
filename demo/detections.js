import { mount } from 'svelte';

import Detections from './Detections.svelte';

const app = mount(Detections, {
	target: document.querySelector('main'),
});

export default app;
