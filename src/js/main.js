import { StoreConfig } from './StoreConfig';
import { LoadingPage } from './components/LoadingPage';
import { Scene } from './components/Scene';
import { Timeline } from './components/Timeline';
import { InfoPanel } from './components/InfoPanel';
require('../style/main.scss');

const appStore = StoreConfig.init();

LoadingPage.init(appStore);
Scene.init(appStore);
Timeline.init(document.querySelector('#timeline>.container'), appStore);
InfoPanel.init(appStore);