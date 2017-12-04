import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as types from '../../types';
import { UserService } from '../../user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../session.service';
import { CreatePostDialogService } from '../posts/create-post-dialog.service';
import { HttpClient } from '@angular/common/http';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {
  @Input () refresh: () => void;
  @Input () author: string;
  posts: types.Post[] = [];
  postId = '';
  search = '';

  constructor(
    public us: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private ss: SessionService,
    private cpds: CreatePostDialogService,
    private ps: PostService
  ) {
   }

   getPosts() {
    this.ps.list(this.author)
    .then(posts => (this.posts))
    .catch(err => (console.log('error')));
   }

   create () {
    this.cpds.openDialog(this.author, () => this.getPosts());
  }

  ngOnInit() {
    this.getPosts();
  }

}
