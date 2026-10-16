import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AlgorithmWorkspace } from './algorithm-workspace';

describe('AlgorithmWorkspace', () => {
  let component: AlgorithmWorkspace;
  let fixture: ComponentFixture<AlgorithmWorkspace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlgorithmWorkspace],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: () => null,
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AlgorithmWorkspace);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps maze help out of the starter code until requested and removes it on restore', async () => {
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const buttons = fixture.nativeElement.querySelectorAll('.editor-toolbar button') as NodeListOf<HTMLButtonElement>;
    const exercise = component.exercises[0];
    const restoreButton = Array.from(buttons).find((button) => button.textContent?.includes('visszaállítása'));
    const helpButton = Array.from(buttons).find((button) => button.textContent?.trim() === 'Segítség');

    expect(exercise.helpCode).toContain('Állítsd meg a keresést');
    expect(textarea.value).not.toContain('Állítsd meg a keresést');

    helpButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(exercise.starterCode).toContain('Állítsd meg a keresést');
    expect(textarea.value).toContain('Állítsd meg a keresést');

    restoreButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(textarea.value).not.toContain('Állítsd meg a keresést');
  });
});
