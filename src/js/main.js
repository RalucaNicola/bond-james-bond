import {LoadingPage} from './components/LoadingPage';
import {appStore} from './appStore';
require('../style/main.scss');

console.log(appStore);
LoadingPage.init(appStore);