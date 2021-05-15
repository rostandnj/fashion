import { __decorate, __param } from "tslib";
import { isPlatformServer } from '@angular/common';
import { AfterContentInit, Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnChanges, OnDestroy, Optional, Output, PLATFORM_ID } from '@angular/core';
import { ReplaySubject, never } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { createHooks } from './hooks-factory';
import { lazyLoadImage } from './lazyload-image';
import { getNavigator } from './util';
let LazyLoadImageDirective = class LazyLoadImageDirective {
    constructor(el, ngZone, platformId, options) {
        this.onStateChange = new EventEmitter(); // Emits an event on every state change
        this.onLoad = new EventEmitter(); // @deprecated use `onStateChange` instead.
        this.elementRef = el;
        this.ngZone = ngZone;
        this.propertyChanges$ = new ReplaySubject();
        this.platformId = platformId;
        this.hooks = createHooks(platformId, options);
    }
    ngOnChanges() {
        if (this.debug === true && !this.debugSubscription) {
            this.debugSubscription = this.onStateChange.subscribe((e) => console.log(e));
        }
        this.propertyChanges$.next({
            element: this.elementRef.nativeElement,
            imagePath: this.lazyImage,
            defaultImagePath: this.defaultImage,
            errorImagePath: this.errorImage,
            useSrcset: this.useSrcset,
            offset: this.offset ? this.offset | 0 : 0,
            scrollContainer: this.scrollTarget,
            customObservable: this.customObservable,
            decode: this.decode,
            onStateChange: this.onStateChange
        });
    }
    ngAfterContentInit() {
        // Don't do anything if SSR and the user isn't a bot
        if (isPlatformServer(this.platformId) && !this.hooks.isBot(getNavigator(), this.platformId)) {
            return null;
        }
        this.ngZone.runOutsideAngular(() => {
            this.loadSubscription = this.propertyChanges$
                .pipe(tap(attributes => attributes.onStateChange.emit({ reason: 'setup' })), tap(attributes => this.hooks.setup(attributes)), switchMap(attributes => {
                if (!attributes.imagePath) {
                    return never();
                }
                return this.hooks.getObservable(attributes).pipe(lazyLoadImage(this.hooks, attributes));
            }))
                .subscribe(success => this.onLoad.emit(success));
        });
    }
    ngOnDestroy() {
        var _a, _b;
        (_a = this.loadSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.debugSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    }
};
LazyLoadImageDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['options',] }] }
];
__decorate([
    Input('lazyLoad')
], LazyLoadImageDirective.prototype, "lazyImage", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "defaultImage", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "errorImage", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "scrollTarget", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "customObservable", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "offset", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "useSrcset", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "decode", void 0);
__decorate([
    Input()
], LazyLoadImageDirective.prototype, "debug", void 0);
__decorate([
    Output()
], LazyLoadImageDirective.prototype, "onStateChange", void 0);
__decorate([
    Output()
], LazyLoadImageDirective.prototype, "onLoad", void 0);
LazyLoadImageDirective = __decorate([
    Directive({
        selector: '[lazyLoad]'
    }),
    __param(2, Inject(PLATFORM_ID)), __param(3, Optional()), __param(3, Inject('options'))
], LazyLoadImageDirective);
export { LazyLoadImageDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eWxvYWQtaW1hZ2UuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbGF6eWxvYWQtaW1hZ2UvIiwic291cmNlcyI6WyJzcmMvbGF6eWxvYWQtaW1hZ2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsSyxPQUFPLEVBQWMsYUFBYSxFQUFnQixLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFLdEMsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFvQmpDLFlBQVksRUFBYyxFQUFFLE1BQWMsRUFBdUIsVUFBa0IsRUFBaUMsT0FBdUI7UUFWakksa0JBQWEsR0FBOEIsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDLHVDQUF1QztRQUN0RyxXQUFNLEdBQTBCLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQywyQ0FBMkM7UUFVdkcsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDNUMs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QUMsVUFBVSxDQUFDO3lEQUFvQjtBQUM3QjtJQUFSLEtBQUssRUFBRTs0REFBdUI7QUFDdEI7SUFBUixLQUFLLEVBQUU7MERBQXFCO0FBQ3BCO0lBQVIsS0FBSyxFQUFFOzREQUFvQjtBQUNuQjtJQUFSLEtBQUssRUFBRTtnRUFBb0M7QUFDbkM7SUFBUixLQUFLLEVBQUU7c0RBQWlCO0FBQ2hCO0lBQVIsS0FBSyxFQUFFO3lEQUFxQjtBQUNwQjtJQUFSLEtBQUssRUFBRTtzREFBa0I7QUFDakI7SUFBUixLQUFLLEVBQUU7cURBQWlCO0FBQ2Y7SUFBVCxNQUFNLEVBQUU7NkRBQStEO0FBQzlEO0lBQVQsTUFBTSxFQUFFO3NEQUFvRDtBQVhsRCxzQkFBc0I7SUFIbEMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLFlBQVk7S0FDdkIsQ0FBQztJQXFCNkMsV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUEsRUFBc0IsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBcEJ4RyxzQkFBc0IsQ0F5RWxDO1NBekVZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1TZXJ2ZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5wdXQsIE5nWm9uZSwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFBMQVRGT1JNX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBTdWJzY3JpcHRpb24sIG5ldmVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGNyZWF0ZUhvb2tzIH0gZnJvbSAnLi9ob29rcy1mYWN0b3J5JztcbmltcG9ydCB7IGxhenlMb2FkSW1hZ2UgfSBmcm9tICcuL2xhenlsb2FkLWltYWdlJztcbmltcG9ydCB7IEF0dHJpYnV0ZXMsIEhvb2tTZXQsIE1vZHVsZU9wdGlvbnMsIFN0YXRlQ2hhbmdlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBnZXROYXZpZ2F0b3IgfSBmcm9tICcuL3V0aWwnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbGF6eUxvYWRdJ1xufSlcbmV4cG9ydCBjbGFzcyBMYXp5TG9hZEltYWdlRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoJ2xhenlMb2FkJykgbGF6eUltYWdlITogc3RyaW5nOyAvLyBUaGUgaW1hZ2UgdG8gYmUgbGF6eSBsb2FkZWRcbiAgQElucHV0KCkgZGVmYXVsdEltYWdlPzogc3RyaW5nOyAvLyBUaGUgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIGJlZm9yZSBsYXp5SW1hZ2UgaXMgbG9hZGVkXG4gIEBJbnB1dCgpIGVycm9ySW1hZ2U/OiBzdHJpbmc7IC8vIFRoZSBpbWFnZSB0byBiZSBkaXNwbGF5ZWQgaWYgbGF6eUltYWdlIGxvYWQgZmFpbHNcbiAgQElucHV0KCkgc2Nyb2xsVGFyZ2V0PzogYW55OyAvLyBTY3JvbGwgY29udGFpbmVyIHRoYXQgY29udGFpbnMgdGhlIGltYWdlIGFuZCBlbWl0cyBzY29sbCBldmVudHNcbiAgQElucHV0KCkgY3VzdG9tT2JzZXJ2YWJsZT86IE9ic2VydmFibGU8YW55PjsgLy8gUGFzcyB5b3VyIG93biBldmVudCBlbWl0dGVyXG4gIEBJbnB1dCgpIG9mZnNldD86IG51bWJlcjsgLy8gVGhlIG51bWJlciBvZiBweCBhIGltYWdlIHNob3VsZCBiZSBsb2FkZWQgYmVmb3JlIGl0IGlzIGluIHZpZXcgcG9ydFxuICBASW5wdXQoKSB1c2VTcmNzZXQ/OiBib29sZWFuOyAvLyBXaGV0aGVyIHNyY3NldCBhdHRyaWJ1dGUgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZCBvZiBzcmNcbiAgQElucHV0KCkgZGVjb2RlPzogYm9vbGVhbjsgLy8gRGVjb2RlIHRoZSBpbWFnZSBiZWZvcmUgYXBwZW5kaW5nIHRvIHRoZSBET01cbiAgQElucHV0KCkgZGVidWc/OiBib29sZWFuOyAvLyBXaWxsIHByaW50IHNvbWUgZGVidWcgaW5mbyB3aGVuIGB0cnVlYFxuICBAT3V0cHV0KCkgb25TdGF0ZUNoYW5nZTogRXZlbnRFbWl0dGVyPFN0YXRlQ2hhbmdlPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTsgLy8gRW1pdHMgYW4gZXZlbnQgb24gZXZlcnkgc3RhdGUgY2hhbmdlXG4gIEBPdXRwdXQoKSBvbkxvYWQ6IEV2ZW50RW1pdHRlcjxib29sZWFuPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTsgLy8gQGRlcHJlY2F0ZWQgdXNlIGBvblN0YXRlQ2hhbmdlYCBpbnN0ZWFkLlxuICBwcml2YXRlIHByb3BlcnR5Q2hhbmdlcyQ6IFJlcGxheVN1YmplY3Q8QXR0cmlidXRlcz47XG4gIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjtcbiAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZTtcbiAgcHJpdmF0ZSBsb2FkU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGRlYnVnU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIGhvb2tzOiBIb29rU2V0PGFueT47XG4gIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0O1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBuZ1pvbmU6IE5nWm9uZSwgQEluamVjdChQTEFURk9STV9JRCkgcGxhdGZvcm1JZDogT2JqZWN0LCBAT3B0aW9uYWwoKSBASW5qZWN0KCdvcHRpb25zJykgb3B0aW9ucz86IE1vZHVsZU9wdGlvbnMpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYgPSBlbDtcbiAgICB0aGlzLm5nWm9uZSA9IG5nWm9uZTtcbiAgICB0aGlzLnByb3BlcnR5Q2hhbmdlcyQgPSBuZXcgUmVwbGF5U3ViamVjdCgpO1xuICAgIHRoaXMucGxhdGZvcm1JZCA9IHBsYXRmb3JtSWQ7XG4gICAgdGhpcy5ob29rcyA9IGNyZWF0ZUhvb2tzKHBsYXRmb3JtSWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuZGVidWcgPT09IHRydWUgJiYgIXRoaXMuZGVidWdTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuZGVidWdTdWJzY3JpcHRpb24gPSB0aGlzLm9uU3RhdGVDaGFuZ2Uuc3Vic2NyaWJlKChlOiBTdGF0ZUNoYW5nZSkgPT4gY29uc29sZS5sb2coZSkpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGVydHlDaGFuZ2VzJC5uZXh0KHtcbiAgICAgIGVsZW1lbnQ6IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LFxuICAgICAgaW1hZ2VQYXRoOiB0aGlzLmxhenlJbWFnZSxcbiAgICAgIGRlZmF1bHRJbWFnZVBhdGg6IHRoaXMuZGVmYXVsdEltYWdlLFxuICAgICAgZXJyb3JJbWFnZVBhdGg6IHRoaXMuZXJyb3JJbWFnZSxcbiAgICAgIHVzZVNyY3NldDogdGhpcy51c2VTcmNzZXQsXG4gICAgICBvZmZzZXQ6IHRoaXMub2Zmc2V0ID8gdGhpcy5vZmZzZXQgfCAwIDogMCxcbiAgICAgIHNjcm9sbENvbnRhaW5lcjogdGhpcy5zY3JvbGxUYXJnZXQsXG4gICAgICBjdXN0b21PYnNlcnZhYmxlOiB0aGlzLmN1c3RvbU9ic2VydmFibGUsXG4gICAgICBkZWNvZGU6IHRoaXMuZGVjb2RlLFxuICAgICAgb25TdGF0ZUNoYW5nZTogdGhpcy5vblN0YXRlQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgU1NSIGFuZCB0aGUgdXNlciBpc24ndCBhIGJvdFxuICAgIGlmIChpc1BsYXRmb3JtU2VydmVyKHRoaXMucGxhdGZvcm1JZCkgJiYgIXRoaXMuaG9va3MuaXNCb3QoZ2V0TmF2aWdhdG9yKCksIHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMubG9hZFN1YnNjcmlwdGlvbiA9IHRoaXMucHJvcGVydHlDaGFuZ2VzJFxuICAgICAgICAucGlwZShcbiAgICAgICAgICB0YXAoYXR0cmlidXRlcyA9PiBhdHRyaWJ1dGVzLm9uU3RhdGVDaGFuZ2UuZW1pdCh7IHJlYXNvbjogJ3NldHVwJyB9KSksXG4gICAgICAgICAgdGFwKGF0dHJpYnV0ZXMgPT4gdGhpcy5ob29rcy5zZXR1cChhdHRyaWJ1dGVzKSksXG4gICAgICAgICAgc3dpdGNoTWFwKGF0dHJpYnV0ZXMgPT4ge1xuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGVzLmltYWdlUGF0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gbmV2ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhvb2tzLmdldE9ic2VydmFibGUoYXR0cmlidXRlcykucGlwZShsYXp5TG9hZEltYWdlKHRoaXMuaG9va3MsIGF0dHJpYnV0ZXMpKTtcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUoc3VjY2VzcyA9PiB0aGlzLm9uTG9hZC5lbWl0KHN1Y2Nlc3MpKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMubG9hZFN1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRlYnVnU3Vic2NyaXB0aW9uPy51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=