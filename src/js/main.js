import { LoadingPage } from './components/LoadingPage';
import { StoreConfig } from './StoreConfig';
import { Scene } from './components/Scene';
import { Timeline } from './components/Timeline';
require('../style/main.scss');

const appStore = StoreConfig.init();

LoadingPage.init(appStore);
Scene.init(appStore);
Timeline.init(document.querySelector('#timeline>.container'));