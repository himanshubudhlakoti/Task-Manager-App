import { Component, OnInit } from '@angular/core';
import { MainLayoutService } from '../../services/main-layout.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})

export class MainLayoutComponent implements OnInit {

  public getToggleSubs: any = "";
  toggle: boolean = true;
  constructor(private mainLayoutService: MainLayoutService) {
    this.getToggleSubs = this.mainLayoutService.getToggle().subscribe((res) => {
      this.toggle = res
    }, (err) => {

    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {

    this.getToggleSubs.unsubscribe();
  }

}
