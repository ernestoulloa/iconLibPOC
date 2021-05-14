import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconsModule} from '@ngneat/svg-icon';
import {appAddChartIcon} from './svg/add_chart';
import {appAddCommentIcon} from './svg/add_comment';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SvgIconsModule.forRoot({
      icons: [appAddChartIcon, appAddCommentIcon],
    }),
  ]
})
export class IconsRegistryModule {
}
