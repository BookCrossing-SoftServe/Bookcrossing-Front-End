import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import {IUserInfo} from '../../../../core/models/userInfo';
import {CommentService} from '../../../../core/services/commment/comment.service';
import {IChildDeleteComment} from '../../../../core/models/comments/child-comment/childDelete';
import {IChildUpdateComment} from '../../../../core/models/comments/child-comment/childUpdate';
import {IChildInsertComment} from '../../../../core/models/comments/child-comment/childInsert';


@Component({
  selector: 'app-childcomment',
  templateUrl: './childcomment.component.html',
  styleUrls: ['./childcomment.component.scss']
})
export class ChildcommentComponent implements OnInit {
  @Input() comments;
  @Input() level;
  @Input() user: IUserInfo;
  @Input() ids;
  @Output() update = new EventEmitter();
  @Input() isAuthorized;
  text = '';


  UpdateComments() {
    this.update.next();
  }
  increment() {
    return this.level++;
  }

  constructor(private  commentservice: CommentService) {
  }

  ngOnInit(): void {

  }

  formatDate(date) {

    TimeAgo.addLocale(en);
    const d = new Date(date);
    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(d);
  }

  CanEditCommnet(owner) {
    if (owner === null || this.user === null) {
      return false;
    } else {
      return owner.id === this.user.id;
    }
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
  canCommit() {
    return this.isAuthorized && (this.text !== '');
  }
  returnID(id) {
    let newids = this.ids.slice();
    newids.push(id);
    return newids;
  }

  async deleateComment(id) {
    let newids = this.returnID(id);
    let deleteComment: IChildDeleteComment = {
      ids: newids, ownerId: this.user.id
    }
    this.commentservice.deleteChildComment(deleteComment).subscribe(() => this.UpdateComments());
  }

  updateComment(id, text) {
    let newids = this.returnID(id);
    let updateComment: IChildUpdateComment = {
      ids: newids, ownerId: this.user.id, text: text
    }
    this.commentservice.updateChildComment(updateComment).subscribe(() => this.UpdateComments());
  }

  PostComment(ids: string[]) {
    const postComment: IChildInsertComment = {
      ids: ids, ownerId: this.user.id, text: this.text
    };
    this.commentservice.postChildComment(postComment).subscribe(() => this.UpdateComments());
    this.text = '';
  }
}
