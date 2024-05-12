import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-btn.component.html',
  styleUrl: './small-btn.component.scss',
})
export class SmallBtnComponent {
  @Input() imgSrc: string = '';
  @Input() imgSize: string = '14px';
  @Input() imgFilter: string =
    'brightness(0) saturate(100%) invert(33%) sepia(23%) saturate(5211%) hue-rotate(224deg) brightness(96%) contrast(97%)';
  @Input() btnSize: string = '28px';
  @Input() btnBgColor: string = '';
  @Input() btnBgHoverColor: string = '#edeefe';
}
