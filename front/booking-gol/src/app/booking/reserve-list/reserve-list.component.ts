import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reserve-list',
  standalone: true,
  imports: [],
  templateUrl: './reserve-list.component.html',
  styleUrl: './reserve-list.component.scss'
})
export class ReserveListComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    console.log('ReserveListComponent initialized');
  }

}
