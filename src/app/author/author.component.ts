import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as types from '../types';
import { Router, NavigationStart, Event } from '@angular/router';
import { ChargeService } from '../charge.service';
import { ProjectService } from '../project.service';
import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../user.service';
import { MatTabGroup } from '@angular/material';
import { Location } from '@angular/common';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit {
  amount = 9;
  author = '';
  name = '';
  projects: types.Project[] = [];
  user: types.User;
  userFound = true;
  selectedTabIndex = 0; // workaround for bug https://github.com/angular/material2/issues/5269
  postId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notif: NotificationsService,
    public us: UserService,
    public ps: ProjectService,
    private charge: ChargeService,
    private location: Location
  ) {}

  ngOnInit() {
    this.refresh();
    // This is to force reload when going from one profile to another TODO: fix this
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        setTimeout(() => {
          this.refresh();
        }, 500);
      }
    });
    this.postId = this.route.snapshot.params['postId'];
  }

  refresh() {
    this.author = this.route.snapshot.params['author'];
    this.ps
      .listByNick(this.author)
      .then(projects => (this.projects = projects))
      .catch(err => (this.userFound = false));
    this.us
      .getByNick(this.author)
      .then(user => {
        this.user = user;
      })
      .catch(err => {
        this.userFound = false;
      });
  }

  getAllCallsLeft(): number {
    if (!this.us.user.Tokens) {
      return 0;
    }
    return this.us.user.Tokens.map(t => t.Quota).reduce((prev, curr) => {
      return prev + curr;
    });
  }

  purchase() {
    const that = this;
    this.charge.charge(this.amount * 100, () => {
      that.us.get();
    });
  }
  selectedIndexChange(tabGroup: MatTabGroup) {
    const pid = tabGroup._tabs.find((e, i, a) => i === tabGroup.selectedIndex)
      .content.viewContainerRef.element.nativeElement.dataset.pid;
    if (pid !== 'projects') {
      this.location.go('/' + this.author + '/' + pid);
    } else {
      this.location.go('/' + this.author);
    }
  }
}
