import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {IAuthor} from 'src/app/core/models/author';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthorService} from 'src/app/core/services/author/authors.service';
import {AuthorFormComponent, FormAction} from '../author-form/author-form.component';
import {RefDirective} from '../../../directives/ref.derictive';
import {CompletePaginationParams} from 'src/app/core/models/Pagination/completePaginationParameters';
import {SortParameters} from 'src/app/core/models/Pagination/sortParameters';
import {FilterParameters} from 'src/app/core/models/Pagination/filterParameters';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  @ViewChild(RefDirective, {static: false}) refDir: RefDirective;

  authors: IAuthor[];
  authorDisplayColumns: string[] = ['#', 'First Name', 'Last Name', 'Middle Name', 'Approved'];
  authorProperties: string[] = ['id', 'firstName', 'lastName', 'middleName', 'isConfirmed'];
  queryParams: CompletePaginationParams = new CompletePaginationParams();
  searchText: string;
  searchField = 'lastName';
  totalSize: number;

  selectedRows = [];

  constructor(
    private translate: TranslateService,
    private notificationService: NotificationService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private authorService: AuthorService,
    private resolver: ComponentFactoryResolver
    ) { }


  ngOnInit() {
    this.onAuthorEdited();
    this.routeActive.queryParams.subscribe((params: Params) => {
      this.queryParams = this.queryParams.mapFromQuery(params);
      this.searchText = this.queryParams?.filters[0]?.value;
      this.getAuthors(this.queryParams);
    });
  }

  private onAuthorEdited() {
    this.authorService.authorSubmitted.subscribe((author) => {
      author.isConfirmed = null;
      const editedAuthor = this.authors.find((x) => x.id === author.id);
      if (editedAuthor) {
        const index = this.authors.indexOf(editedAuthor);
        this.authors[index] = author;
      }
    });
  }
  // Pagination/URL
  search(): void {
    if (this.queryParams?.filters[0]?.value === this.searchText) {
      return;
    }
    this.queryParams.page = 1;
    this.queryParams.filters = [];
    this.queryParams.filters[0] = {propertyName: this.searchField, value: this.searchText} as FilterParameters;
    this.changeUrl();
  }
  changeSort(selectedHeader: string) {
    this.queryParams.sort = {orderByField: selectedHeader, orderByAscending: !this.queryParams.sort.orderByAscending} as SortParameters;
    this.changeUrl();
  }
  pageChanged(currentPage: number): void {
      this.queryParams.page = currentPage;
      this.queryParams.firstRequest = false;
      this.changeUrl();
  }
  private changeUrl(): void {
    this.router.navigate(['.'],
      {
        relativeTo: this.routeActive,
        queryParams: this.queryParams.getQueryObject()
      });
  }

  mergeClear() {
    this.selectedRows = [];
  }
  merge() {
    this.showForm(this.selectedRows[0], FormAction.Merge, this.selectedRows);
  }

  // Form
  showAddForm() {
    const newAuthor: IAuthor = {
      firstName: '',
      lastName: '',
      middleName: ''
    };
    this.showForm(newAuthor, FormAction.Add);
  }
  showEditForm(author: IAuthor) {
    this.showForm(author, FormAction.Edit);
  }
  showForm(author: IAuthor, action: FormAction = FormAction.Add, selectedAuthors: IAuthor[] = null) {
    const formFactory = this.resolver.resolveComponentFactory(AuthorFormComponent);
    const instance = this.refDir.containerRef.createComponent(formFactory).instance;
    instance.action = action;
    instance.author = author;
    instance.authorsMerge = selectedAuthors;
    instance.onCancel.subscribe(() => this.refDir.containerRef.clear());
  }

  // Get
  getAuthors(params: CompletePaginationParams): void {
    this.authorService.getAuthorsPage(params)
    .subscribe( {
      next: pageData => {
      this.authors = pageData.page;
      this.authors.forEach(a => {
        if (a.isConfirmed) {
          a.isConfirmed = null;
        } else {
          a.isConfirmed = 'unapproved';
        }
      });
      if (pageData.totalCount) {
        this.totalSize = pageData.totalCount;
      }
    },
    error: () => {
      this.notificationService.warn(this.translate
        .instant('Something went wrong!'), 'X');
    }
   });
  }
}
