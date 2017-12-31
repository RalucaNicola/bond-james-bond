import { LoadingPage } from './components/LoadingPage';
import { StoreConfig } from './StoreConfig';
import { Scene } from './components/Scene';
require('../style/main.scss');

const appStore = StoreConfig.init();

LoadingPage.init(appStore);
Scene.init(appStore);