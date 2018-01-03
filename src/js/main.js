import storeConfig from './storeConfig';
import LoadingPage from './components/LoadingPage';
import { Scene } from './components/Scene';
import { Timeline } from './components/Timeline';
import { InfoPanel } from './components/InfoPanel';
require('../style/main.scss');

const appStore = storeConfig.init();

LoadingPage.init(appStore);
Scene.init(appStore);
Timeline.init(document.querySelector('#timeline>.container'), appStore);
InfoPanel.init(appStore);