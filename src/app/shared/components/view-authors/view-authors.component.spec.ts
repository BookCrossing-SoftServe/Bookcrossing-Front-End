import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAuthorsComponent } from './view-authors.component';

describe('ViewAuthorsComponent', () => {
  let component: ViewAuthorsComponent;
  let fixture: ComponentFixture<ViewAuthorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAuthorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAuthorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
