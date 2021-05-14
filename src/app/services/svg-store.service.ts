/* tslint:disable:no-any */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface SvgCallback {
  resolve: (val: string) => any;
  reject: (reason: any) => any;
}

interface SvgProgress {
  inProgress: boolean;
  callStack: SvgCallback[];
}

@Injectable({
  providedIn: 'root'
})
export class SvgStoreService {
  private svgStore: Map<string, string> = new Map<string, string>();
  private svgProgressStore: Map<string, SvgProgress> = new Map<string,
    SvgProgress>();

  constructor(private $http: HttpClient) {
  }

  public getSvg(url: string): Promise<string> {
    let svgCallback: SvgCallback;
    const p: Promise<string> = new Promise(
      (resolve: (val: string) => any, reject: (reason: any) => any) =>
        (svgCallback = {resolve, reject})
    );

    setTimeout(() => {
      if (this.isSvgCached(url)) {
        svgCallback.resolve(this.svgStore.get(url) || '');
      } else {
        if (this.isSvgRequestInProgress(url)) {
          this.extendCallbackQueue(url, svgCallback);
        } else {
          this.setCallbackQueue(url, svgCallback);
          this.requestSvg(url)
            .then((svgContent: string) => {
              this.cacheSvg(url, svgContent);
              this.runCallbackQueue(url, true, null);
            })
            .catch(err => {
              this.runCallbackQueue(url, false, err);
            });
        }
      }
    });
    return p;
  }

  private requestSvg(url: string): Promise<string> {
    return new Promise(
      (resolve: (val: string) => any, reject: (reason: any) => any) => {
        this.$http
          .get(url, {responseType: 'text'})
          .toPromise()
          .then((response: any) => {
            resolve(response);
          })
          .catch((err: any) => {
            // tslint:disable-next-line:no-console
            console.error('error while fetching svg file :', err);
            reject(err);
          });
      }
    );
  }

  private cacheSvg(url: string, svgContent: string): void {
    if (this.isSvgCached(url)) {
      // tslint:disable-next-line:no-console
      console.warn(
        'svg path :',
        url,
        'is already in the svg store! check your implementation!'
      );
    } else {
      this.svgStore.set(url, svgContent);
    }
  }

  private isSvgCached(url: string): boolean {
    return this.svgStore.has(url);
  }

  private isSvgRequestInProgress(url: string): boolean {
    return this.svgProgressStore.has(url) &&
      (this.svgProgressStore.get(url)?.inProgress || false);
  }

  private setCallbackQueue(url: string, svgCallback: SvgCallback): void {
    if (!this.svgProgressStore.has(url)) {
      this.svgProgressStore.set(url, {
        inProgress: true,
        callStack: [svgCallback]
      });
    } else {
      this.extendCallbackQueue(url, svgCallback);
      /*console.warn(
        'setCallbackQueue is called but progress store already exists for : "',
        url,
        '" :',
        this.svgProgressStore[url]
      );*/
    }
  }

  private extendCallbackQueue(url: string, svgCallback: SvgCallback): void {
    if (
      this.svgProgressStore.has(url) &&
      this.svgProgressStore.get(url)?.inProgress
    ) {
      this.svgProgressStore.get(url)?.callStack.push(svgCallback);
    } else {
      // tslint:disable-next-line:no-console
      /*console.warn(
        'failed to extend callback(s) queue for "',
        url,
        '",! progress store does not exist! :',
        this.svgProgressStore[url]
      );*/
    }
  }

  private runCallbackQueue(url: string, success: boolean, err?: any): void {
    if (
      this.svgProgressStore.has(url) &&
      this.svgProgressStore.get(url)?.inProgress
    ) {
      const storeUrl = this.svgProgressStore.get(url);
      if (storeUrl) {
        const callStack: SvgCallback[] = storeUrl.callStack;
        callStack.forEach((svgCallback: any) =>
          success
            ? svgCallback.resolve(this.svgStore.get(url))
            : svgCallback.reject(err)
        );
      }
    } else {
      // tslint:disable-next-line:no-console
      console.warn('there is no callbacks in the queue for "', url, '"');
    }
    this.clearCallbackQueue(url);
  }

  private clearCallbackQueue(url: string): void {
    if (!this.svgProgressStore.has(url)) {
      // tslint:disable-next-line:no-console
      console.warn(
        'can not clear progress because it is not found for : "',
        url,
        '" :',
        this.svgProgressStore.get(url)
      );
    } else {
      this.svgProgressStore.delete(url);
    }
  }
}
