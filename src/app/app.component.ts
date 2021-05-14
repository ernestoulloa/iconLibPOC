import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  rotate = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.rotate = true;
    }, 5000);
  }
}
