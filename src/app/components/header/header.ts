import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { ALGORITHM_TASKS, AlgorithmTask } from '../algorithm-workspace/algorithm-data';

@Component({
  selector: 'header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  algorithmTabs: AlgorithmTask[] = [...ALGORITHM_TASKS].sort(
    (first, second) => first.difficultyRank - second.difficultyRank,
  );
  activeTabId: number | null = null;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const match = event.urlAfterRedirects.match(/\/workspace\?id=(\d+)/);
        this.activeTabId = match ? Number(match[1]) : null;
      });
  }

  selectTask(tab: AlgorithmTask): void {
    this.activeTabId = tab.id;
    this.router.navigate(['/workspace'], { queryParams: { id: tab.id } });
  }
}