import { registerRootComponent } from 'expo';

import App from './App';

// Este arquivo e o ponto de entrada usado pelo Expo.
//
// registerRootComponent registra o componente App como raiz do projeto.
// O Expo faz a configuracao correta tanto no Expo Go quanto em builds nativas.
registerRootComponent(App);
