import { __decorate, __param } from "tslib";
import { isPlatformServer } from '@angular/common';
import { AfterContentInit, Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnChanges, OnDestroy, Optional, Output, PLATFORM_ID } from '@angular/core';
import { ReplaySubject, never } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { createHooks } from './hooks-factory';
import { lazyLoadImage } from './lazyload-image';
import { getNavigator } from './util';
var LazyLoadImageDirective = /** @class */ (function () {
    function LazyLoadImageDirective(el, ngZone, platformId, options) {
        this.onStateChange = new EventEmitter(); // Emits an event on every state change
        this.onLoad = new EventEmitter(); // @deprecated use `onStateChange` instead.
        this.elementRef = el;
        this.ngZone = ngZone;
        this.propertyChanges$ = new ReplaySubject();
        this.platformId = platformId;
        this.hooks = createHooks(platformId, options);
    }
    LazyLoadImageDirective.prototype.ngOnChanges = function () {
        if (this.debug === true && !this.debugSubscription) {
            this.debugSubscription = this.onStateChange.subscribe(function (e) { return console.log(e); });
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
    };
    LazyLoadImageDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        // Don't do anything if SSR and the user isn't a bot
        if (isPlatformServer(this.platformId) && !this.hooks.isBot(getNavigator(), this.platformId)) {
            return null;
        }
        this.ngZone.runOutsideAngular(function () {
            _this.loadSubscription = _this.propertyChanges$
                .pipe(tap(function (attributes) { return attributes.onStateChange.emit({ reason: 'setup' }); }), tap(function (attributes) { return _this.hooks.setup(attributes); }), switchMap(function (attributes) {
                if (!attributes.imagePath) {
                    return never();
                }
                return _this.hooks.getObservable(attributes).pipe(lazyLoadImage(_this.hooks, attributes));
            }))
                .subscribe(function (success) { return _this.onLoad.emit(success); });
        });
    };
    LazyLoadImageDirective.prototype.ngOnDestroy = function () {
        var _a, _b;
        (_a = this.loadSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.debugSubscription) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    };
    LazyLoadImageDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: NgZone },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: ['options',] }] }
    ]; };
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
    return LazyLoadImageDirective;
}());
export { LazyLoadImageDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF6eWxvYWQtaW1hZ2UuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctbGF6eWxvYWQtaW1hZ2UvIiwic291cmNlcyI6WyJzcmMvbGF6eWxvYWQtaW1hZ2UuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsSyxPQUFPLEVBQWMsYUFBYSxFQUFnQixLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFLdEM7SUFvQkUsZ0NBQVksRUFBYyxFQUFFLE1BQWMsRUFBdUIsVUFBa0IsRUFBaUMsT0FBdUI7UUFWakksa0JBQWEsR0FBOEIsSUFBSSxZQUFZLEVBQUUsQ0FBQyxDQUFDLHVDQUF1QztRQUN0RyxXQUFNLEdBQTBCLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQywyQ0FBMkM7UUFVdkcsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7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bkIvRjtRQUFsQixLQUFLLENBQUMsVUFBVSxDQUFDOzZEQUFvQjtJQUM3QjtRQUFSLEtBQUssRUFBRTtnRUFBdUI7SUFDdEI7UUFBUixLQUFLLEVBQUU7OERBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFO2dFQUFvQjtJQUNuQjtRQUFSLEtBQUssRUFBRTtvRUFBb0M7SUFDbkM7UUFBUixLQUFLLEVBQUU7MERBQWlCO0lBQ2hCO1FBQVIsS0FBSyxFQUFFOzZEQUFxQjtJQUNwQjtRQUFSLEtBQUssRUFBRTswREFBa0I7SUFDakI7UUFBUixLQUFLLEVBQUU7eURBQWlCO0lBQ2Y7UUFBVCxNQUFNLEVBQUU7aUVBQStEO0lBQzlEO1FBQVQsTUFBTSxFQUFFOzBEQUFvRDtJQVhsRCxzQkFBc0I7UUFIbEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7U0FDdkIsQ0FBQztRQXFCNkMsV0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUEsRUFBc0IsV0FBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BcEJ4RyxzQkFBc0IsQ0F5RWxDO0lBQUQsNkJBQUM7Q0FBQSxBQXpFRCxJQXlFQztTQXpFWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBpc1BsYXRmb3JtU2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBOZ1pvbmUsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCwgU3Vic2NyaXB0aW9uLCBuZXZlciB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBjcmVhdGVIb29rcyB9IGZyb20gJy4vaG9va3MtZmFjdG9yeSc7XG5pbXBvcnQgeyBsYXp5TG9hZEltYWdlIH0gZnJvbSAnLi9sYXp5bG9hZC1pbWFnZSc7XG5pbXBvcnQgeyBBdHRyaWJ1dGVzLCBIb29rU2V0LCBNb2R1bGVPcHRpb25zLCBTdGF0ZUNoYW5nZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0TmF2aWdhdG9yIH0gZnJvbSAnLi91dGlsJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2xhenlMb2FkXSdcbn0pXG5leHBvcnQgY2xhc3MgTGF6eUxvYWRJbWFnZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCdsYXp5TG9hZCcpIGxhenlJbWFnZSE6IHN0cmluZzsgLy8gVGhlIGltYWdlIHRvIGJlIGxhenkgbG9hZGVkXG4gIEBJbnB1dCgpIGRlZmF1bHRJbWFnZT86IHN0cmluZzsgLy8gVGhlIGltYWdlIHRvIGJlIGRpc3BsYXllZCBiZWZvcmUgbGF6eUltYWdlIGlzIGxvYWRlZFxuICBASW5wdXQoKSBlcnJvckltYWdlPzogc3RyaW5nOyAvLyBUaGUgaW1hZ2UgdG8gYmUgZGlzcGxheWVkIGlmIGxhenlJbWFnZSBsb2FkIGZhaWxzXG4gIEBJbnB1dCgpIHNjcm9sbFRhcmdldD86IGFueTsgLy8gU2Nyb2xsIGNvbnRhaW5lciB0aGF0IGNvbnRhaW5zIHRoZSBpbWFnZSBhbmQgZW1pdHMgc2NvbGwgZXZlbnRzXG4gIEBJbnB1dCgpIGN1c3RvbU9ic2VydmFibGU/OiBPYnNlcnZhYmxlPGFueT47IC8vIFBhc3MgeW91ciBvd24gZXZlbnQgZW1pdHRlclxuICBASW5wdXQoKSBvZmZzZXQ/OiBudW1iZXI7IC8vIFRoZSBudW1iZXIgb2YgcHggYSBpbWFnZSBzaG91bGQgYmUgbG9hZGVkIGJlZm9yZSBpdCBpcyBpbiB2aWV3IHBvcnRcbiAgQElucHV0KCkgdXNlU3Jjc2V0PzogYm9vbGVhbjsgLy8gV2hldGhlciBzcmNzZXQgYXR0cmlidXRlIHNob3VsZCBiZSB1c2VkIGluc3RlYWQgb2Ygc3JjXG4gIEBJbnB1dCgpIGRlY29kZT86IGJvb2xlYW47IC8vIERlY29kZSB0aGUgaW1hZ2UgYmVmb3JlIGFwcGVuZGluZyB0byB0aGUgRE9NXG4gIEBJbnB1dCgpIGRlYnVnPzogYm9vbGVhbjsgLy8gV2lsbCBwcmludCBzb21lIGRlYnVnIGluZm8gd2hlbiBgdHJ1ZWBcbiAgQE91dHB1dCgpIG9uU3RhdGVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxTdGF0ZUNoYW5nZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7IC8vIEVtaXRzIGFuIGV2ZW50IG9uIGV2ZXJ5IHN0YXRlIGNoYW5nZVxuICBAT3V0cHV0KCkgb25Mb2FkOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7IC8vIEBkZXByZWNhdGVkIHVzZSBgb25TdGF0ZUNoYW5nZWAgaW5zdGVhZC5cbiAgcHJpdmF0ZSBwcm9wZXJ0eUNoYW5nZXMkOiBSZXBsYXlTdWJqZWN0PEF0dHJpYnV0ZXM+O1xuICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWY7XG4gIHByaXZhdGUgbmdab25lOiBOZ1pvbmU7XG4gIHByaXZhdGUgbG9hZFN1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBkZWJ1Z1N1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBob29rczogSG9va1NldDxhbnk+O1xuICBwcml2YXRlIHBsYXRmb3JtSWQ6IE9iamVjdDtcblxuICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgbmdab25lOiBOZ1pvbmUsIEBJbmplY3QoUExBVEZPUk1fSUQpIHBsYXRmb3JtSWQ6IE9iamVjdCwgQE9wdGlvbmFsKCkgQEluamVjdCgnb3B0aW9ucycpIG9wdGlvbnM/OiBNb2R1bGVPcHRpb25zKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmID0gZWw7XG4gICAgdGhpcy5uZ1pvbmUgPSBuZ1pvbmU7XG4gICAgdGhpcy5wcm9wZXJ0eUNoYW5nZXMkID0gbmV3IFJlcGxheVN1YmplY3QoKTtcbiAgICB0aGlzLnBsYXRmb3JtSWQgPSBwbGF0Zm9ybUlkO1xuICAgIHRoaXMuaG9va3MgPSBjcmVhdGVIb29rcyhwbGF0Zm9ybUlkLCBvcHRpb25zKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmRlYnVnID09PSB0cnVlICYmICF0aGlzLmRlYnVnU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmRlYnVnU3Vic2NyaXB0aW9uID0gdGhpcy5vblN0YXRlQ2hhbmdlLnN1YnNjcmliZSgoZTogU3RhdGVDaGFuZ2UpID0+IGNvbnNvbGUubG9nKGUpKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BlcnR5Q2hhbmdlcyQubmV4dCh7XG4gICAgICBlbGVtZW50OiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCxcbiAgICAgIGltYWdlUGF0aDogdGhpcy5sYXp5SW1hZ2UsXG4gICAgICBkZWZhdWx0SW1hZ2VQYXRoOiB0aGlzLmRlZmF1bHRJbWFnZSxcbiAgICAgIGVycm9ySW1hZ2VQYXRoOiB0aGlzLmVycm9ySW1hZ2UsXG4gICAgICB1c2VTcmNzZXQ6IHRoaXMudXNlU3Jjc2V0LFxuICAgICAgb2Zmc2V0OiB0aGlzLm9mZnNldCA/IHRoaXMub2Zmc2V0IHwgMCA6IDAsXG4gICAgICBzY3JvbGxDb250YWluZXI6IHRoaXMuc2Nyb2xsVGFyZ2V0LFxuICAgICAgY3VzdG9tT2JzZXJ2YWJsZTogdGhpcy5jdXN0b21PYnNlcnZhYmxlLFxuICAgICAgZGVjb2RlOiB0aGlzLmRlY29kZSxcbiAgICAgIG9uU3RhdGVDaGFuZ2U6IHRoaXMub25TdGF0ZUNoYW5nZVxuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIFNTUiBhbmQgdGhlIHVzZXIgaXNuJ3QgYSBib3RcbiAgICBpZiAoaXNQbGF0Zm9ybVNlcnZlcih0aGlzLnBsYXRmb3JtSWQpICYmICF0aGlzLmhvb2tzLmlzQm90KGdldE5hdmlnYXRvcigpLCB0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLmxvYWRTdWJzY3JpcHRpb24gPSB0aGlzLnByb3BlcnR5Q2hhbmdlcyRcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgdGFwKGF0dHJpYnV0ZXMgPT4gYXR0cmlidXRlcy5vblN0YXRlQ2hhbmdlLmVtaXQoeyByZWFzb246ICdzZXR1cCcgfSkpLFxuICAgICAgICAgIHRhcChhdHRyaWJ1dGVzID0+IHRoaXMuaG9va3Muc2V0dXAoYXR0cmlidXRlcykpLFxuICAgICAgICAgIHN3aXRjaE1hcChhdHRyaWJ1dGVzID0+IHtcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlcy5pbWFnZVBhdGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5ldmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ob29rcy5nZXRPYnNlcnZhYmxlKGF0dHJpYnV0ZXMpLnBpcGUobGF6eUxvYWRJbWFnZSh0aGlzLmhvb2tzLCBhdHRyaWJ1dGVzKSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgKVxuICAgICAgICAuc3Vic2NyaWJlKHN1Y2Nlc3MgPT4gdGhpcy5vbkxvYWQuZW1pdChzdWNjZXNzKSk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmxvYWRTdWJzY3JpcHRpb24/LnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kZWJ1Z1N1YnNjcmlwdGlvbj8udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19