import { Component, OnInit } from '@angular/core';
import { InstagramService } from '../../../shared/services/instagram.service';
import { InstaSlider } from '../../../shared/data/slider';

@Component({
  selector: 'app-instagram',
  templateUrl: './instagram.component.html',
  styleUrls: ['./instagram.component.scss']
})
export class InstagramComponent implements OnInit {

  constructor(private instaService: InstagramService) {
    // this.instaService.getInstagramData.
    // subscribe(response => this.instagram = response);
  }

  public instagram: any;

  public InstaSliderConfig: any = InstaSlider;

  ngOnInit(): void {
  }

}
