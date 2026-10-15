import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { AlgorithmWorkspace } from './components/algorithm-workspace/algorithm-workspace';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'workspace', component: AlgorithmWorkspace },
  { path: '**', redirectTo: '' },
];
