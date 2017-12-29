import { LoadingPage } from './components/LoadingPage';
import { appStore } from './appStore';
import { Scene } from './components/Scene';
require('../style/main.scss');

LoadingPage.init(appStore);
Scene.init(appStore);