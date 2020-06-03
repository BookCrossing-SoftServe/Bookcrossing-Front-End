import {Component, OnInit, Input} from '@angular/core';
import {CommentService} from 'src/app/core/services/commment/comment.service';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUser} from '../../../core/models/user';
import {__await} from 'tslib';
import {AuthenticationService} from '../../../core/services/authentication/authentication.service';
import {UserService} from '../../../core/services/user/user.service';
import {IRootComment} from '../../../core/models/comments/root-comment/root';
import {IRootInsertComment} from '../../../core/models/comments/root-comment/rootInsert';
import {IRootDeleteComment} from '../../../core/models/comments/root-comment/rootDelete';
import {IRootUpdateComment} from '../../../core/models/comments/root-comment/rootUpdate';
import {element} from 'protractor';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],

})
export class CommentComponent implements OnInit {
  @Input() bookId = 0;
  comments: IRootComment[];
  user: IUser;
  text = '';
  rating = 0;
  level = 0;


  constructor(private  commentservice: CommentService, private authenticationService: AuthenticationService,
              private userService: UserService
  ) {
  }

  increment() {
    return this.level++;
  }

  ngOnInit() {
    this.updateComments();
    this.getUser()
  }

  isAuthenticated(){
    return this.authenticationService.isAuthenticated()
  }

  getUser(){
    if(this.isAuthenticated()){
      console.log("Authencicated")
      this.authenticationService.getUserId().subscribe((value: number)=> {
        this.userService.getUserById(value).subscribe((value: IUser)=>{
          this.user = value;
        })
      })
    }
  }


  canCommit() {
    return this.isAuthenticated() && (this.text !== '');
  }

  CopyText(text) {
    return text;
  }


  getUserName(owner) {
    if (owner === null) {
      return 'deleted user';
    } else {
      if ((this.user !== null) && (this.user.id === owner.id)) {
        return 'Me';

      } else {
        return owner.firstName + ' ' + owner.lastName;
      }

    }
  }

  CanEditCommnet(owner) {
    if (owner === null || typeof this.user === 'undefined') {
      return false;
    } else {
      return owner.id === this.user.id;
    }
  }

  formatDate(date) {

    TimeAgo.addLocale(en);
    const d = new Date(date);
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(d);
  }

  returnID(id) {
    let ids = [];
    ids.push(id);
    return ids;
  }

  updateComments() {
    this.commentservice.getComments(this.bookId).subscribe((value: IRootComment[])=> {
      this.comments = value;
    });
  }

  async PostComment() {
    let postComment: IRootInsertComment = {
      bookId: this.bookId, ownerId: this.user.id, rating: this.rating, text: this.text
    }
    this.commentservice.postComment(postComment).subscribe((r) => {

    });
    this.text = '';
    this.ngOnInit()
  }

  async deleateComment(id) {
    let deleteComment: IRootDeleteComment = {
      id: id, ownerId: this.user.id

    }
    this.commentservice.deleteComment(deleteComment).subscribe((r) => {
    });
    this.ngOnInit()
  }

  async updateComment(id, text) {
    let updateComment: IRootUpdateComment = {
      id: id, ownerId: this.user.id, rating: this.rating, text: text
    }
    this.commentservice.updateComment(updateComment).subscribe((r) => {
    });
    this.ngOnInit()
  }

  onRatingSet($event: number) {
    this.rating = $event;
  }

}
