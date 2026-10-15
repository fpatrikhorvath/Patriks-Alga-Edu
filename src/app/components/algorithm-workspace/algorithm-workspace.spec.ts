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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
