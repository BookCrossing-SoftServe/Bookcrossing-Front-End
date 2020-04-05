import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, SimpleChange} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {  
  @Output() onPageChange : EventEmitter<number> = new EventEmitter<number>()
  @Input() arraySize : number;
  @Input() pageSize : number;
  current : number = 1;
  total : number;
  pageList : number[];
  constructor() { }

  ngOnInit(): void {    
    this.total = Math.ceil(this.arraySize / this.pageSize);
    this.changePageList();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes.arraySize;
    if(currentItem.currentValue > 0){
      this.total = changes.arraySize.currentValue;
      this.current = 1;
      this.ngOnInit();
    }
  }
  selectPage(pageNumber : number){
    if(pageNumber == this.current){
      return;
    }
    this.onPageChange.emit(pageNumber);
    this.current = pageNumber;
    this.changePageList();
  }
  private changePageList(){
    if (this.current + 1 >= this.total){      
      if (this.total <= 2){
      this.pageList = [];
        for(let i = 1; i <= this.total; i++){
          this.pageList.push(i);
        }
      }
      return; 
    }
    this.pageList = [];
    for(let i = Math.max(this.current-2, 1); i <= Math.max(this.current+2,Math.min(5,this.total)); i++){
      this.pageList.push(i);
    }
  }
}
