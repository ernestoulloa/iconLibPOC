import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SvgStoreService} from '../services/svg-store.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'icon',
  template: `
    <div #icon [class]="'icon icon-'+name" [attr.icon]="name"></div>
  `,
  styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit, AfterViewInit, OnChanges {
  public url: string | null = null;

  private initialized = false;

  // set the svg end point here
  private staticResourcesHost = '';

  @Input() public name = '';
  @Input() height: string | undefined;
  @Input() width: string | undefined;
  @Input() color: string | undefined;

  @ViewChild('icon')
  public element!: ElementRef;

  constructor(private svgStoreService: SvgStoreService) {
  }

  public ngOnInit(): void {
    this.initialized = true;
    this.setSvgUrl();
  }

  public ngAfterViewInit(): void {
    this.bindSvgContent();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized && changes.name && changes.name.currentValue) {
      this.name = changes.name.currentValue;
      this.setSvgUrl();
      this.bindSvgContent();
    } else {
      this.url = null;
    }
  }

  private bindSvgContent(): void {
    if (this.url !== null) {
      this.svgStoreService.getSvg(this.url).then((svgContent: string) => {
        if (this.element) {
          this.element.nativeElement.innerHTML = svgContent;
          const svg = this.element.nativeElement.querySelector('svg') as SVGElement;
          svg.setAttribute('fit', '');
          if (this.height) {
            svg.setAttribute('height', this.coerceCssPixelValue(this.height));
          }
          if (this.width) {
            svg.setAttribute('width', this.coerceCssPixelValue(this.width));
          }
          if (this.color) {
            this.element.nativeElement.style.color = this.color;
          }
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svg.setAttribute('focusable', 'false');
        }
      });
    }
  }

  private setSvgUrl(): void {
    this.url =
      `${this.staticResourcesHost}/assets/svg/${this.name}.svg`;
  }

  // tslint:disable-next-line:no-any
  private coerceCssPixelValue(value: any): string {
    if (value == null) {
      return '';
    }

    return typeof value === 'string' ? value : `${value}px`;
  }

}
