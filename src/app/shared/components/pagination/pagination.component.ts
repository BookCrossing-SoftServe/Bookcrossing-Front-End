import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

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
      return;
    }
    this.pageList = [];
    for(let i = Math.max(this.current-2, 1); i <= Math.max(this.current+2,Math.min(5,this.total)); i++){
      this.pageList.push(i);
    }
  }
// TODO: DELETE
//different implementation TODO:
//   ngOnInit(): void {
//     this.initPageList();
//   }

//   selectPage(pageNumber : number){
//     this.current = pageNumber;
//     this.changePageList();
//   }

//   private changePageList(){
//     if(this.current < 3)
//       this.initPageList() //to make sure 4 -> 2 page change display correct pageList
//     else if (this.current + 1 >= this.total)
//       return;
//     else
//       this.pageList = [this.current-2,this.current-1,this.current,this.current+1,this.current+2]
//   }

//   private initPageList(){
//     let size = (this.total < 5) ? this.total : 5;
//     this.pageList = [...Array(size+1).keys()];
//     this.pageList.shift();
//   }
}

