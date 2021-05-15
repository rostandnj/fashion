import { __decorate, __param } from 'tslib';
import { isPlatformServer } from '@angular/common';
import { EventEmitter, ElementRef, NgZone, Inject, PLATFORM_ID, Optional, Input, Output, Directive, NgModule } from '@angular/core';
import { Subject, Observable, of, ReplaySubject, never, empty } from 'rxjs';
import { filter, tap, take, mergeMap, map, catchError, switchMap, sampleTime, share, startWith } from 'rxjs/operators';

const cssClassNames = {
    loaded: 'ng-lazyloaded',
    loading: 'ng-lazyloading',
    failed: 'ng-failed-lazyloaded'
};
function removeCssClassName(element, cssClassName) {
    element.className = element.className.replace(cssClassName, '');
}
function addCssClassName(element, cssClassName) {
    if (!element.className.includes(cssClassName)) {
        element.className += ` ${cssClassName}`;
    }
}
function hasCssClassName(element, cssClassName) {
    return element.className && element.className.includes(cssClassName);
}

function getNavigator() {
    return typeof window !== 'undefined' ? window.navigator : undefined;
}
function isChildOfPicture(element) {
    return Boolean(element.parentElement && element.parentElement.nodeName.toLowerCase() === 'picture');
}
function isImageElement(element) {
    return element.nodeName.toLowerCase() === 'img';
}
function setImage(element, imagePath, useSrcset) {
    if (isImageElement(element)) {
        if (useSrcset && 'srcset' in element) {
            element.srcset = imagePath;
        }
        else {
            element.src = imagePath;
        }
    }
    else {
        element.style.backgroundImage = `url('${imagePath}')`;
    }
    return element;
}
function setSources(attrName) {
    return (image) => {
        const sources = image.parentElement.getElementsByTagName('source');
        for (let i = 0; i < sources.length; i++) {
            const attrValue = sources[i].getAttribute(attrName);
            if (attrValue) {
                // Check if `srcset` is supported by the current browser
                if ('srcset' in sources[i]) {
                    sources[i].srcset = attrValue;
                }
                else {
                    sources[i].src = attrValue;
                }
            }
        }
    };
}
const setSourcesToDefault = setSources('defaultImage');
const setSourcesToLazy = setSources('lazyLoad');
const setSourcesToError = setSources('errorImage');
function setImageAndSources(setSourcesFn) {
    return (element, imagePath, useSrcset) => {
        if (isImageElement(element) && isChildOfPicture(element)) {
            setSourcesFn(element);
        }
        if (imagePath) {
            setImage(element, imagePath, useSrcset);
        }
    };
}
const setImageAndSourcesToDefault = setImageAndSources(setSourcesToDefault);
const setImageAndSourcesToLazy = setImageAndSources(setSourcesToLazy);
const setImageAndSourcesToError = setImageAndSources(setSourcesToError);

const end = ({ element }) => {
    addCssClassName(element, cssClassNames.loaded);
    removeCssClassName(element, cssClassNames.loading);
};
const ɵ0 = end;
const loadImage = ({ element, useSrcset, imagePath, decode }) => {
    let img;
    if (isImageElement(element) && isChildOfPicture(element)) {
        const parentClone = element.parentNode.cloneNode(true);
        img = parentClone.getElementsByTagName('img')[0];
        setSourcesToLazy(img);
        setImage(img, imagePath, useSrcset);
    }
    else {
        img = new Image();
        if (isImageElement(element) && element.sizes) {
            img.sizes = element.sizes;
        }
        if (useSrcset && 'srcset' in img) {
            img.srcset = imagePath;
        }
        else {
            img.src = imagePath;
        }
    }
    if (decode && img.decode) {
        return img.decode().then(() => imagePath);
    }
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(imagePath);
        img.onerror = () => reject(null);
    });
};
const setErrorImage = ({ element, errorImagePath, useSrcset }) => {
    setImageAndSourcesToError(element, errorImagePath, useSrcset);
    addCssClassName(element, cssClassNames.failed);
};
const ɵ1 = setErrorImage;
const setLoadedImage = ({ element, imagePath, useSrcset }) => {
    setImageAndSourcesToLazy(element, imagePath, useSrcset);
};
const ɵ2 = setLoadedImage;
const setup = ({ element, defaultImagePath, useSrcset }) => {
    setImageAndSourcesToDefault(element, defaultImagePath, useSrcset);
    addCssClassName(element, cssClassNames.loading);
    if (hasCssClassName(element, cssClassNames.loaded)) {
        removeCssClassName(element, cssClassNames.loaded);
    }
};
const ɵ3 = setup;
const isBot = navigator => {
    if (navigator && navigator.userAgent) {
        return /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\ link\ preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|whatsapp|duckduckbot/i.test(navigator.userAgent);
    }
    return false;
};
const sharedPreset = {
    finally: end,
    loadImage,
    setErrorImage,
    setLoadedImage,
    setup,
    isBot
};

const observers = new WeakMap();
const intersectionSubject = new Subject();
function loadingCallback(entrys) {
    entrys.forEach(entry => intersectionSubject.next(entry));
}
const uniqKey = {};
const getIntersectionObserver = (attributes) => {
    const scrollContainerKey = attributes.scrollContainer || uniqKey;
    const options = {
        root: attributes.scrollContainer || null
    };
    if (attributes.offset) {
        options.rootMargin = `${attributes.offset}px`;
    }
    let observer = observers.get(scrollContainerKey);
    if (!observer) {
        observer = new IntersectionObserver(loadingCallback, options);
        observers.set(scrollContainerKey, observer);
    }
    observer.observe(attributes.element);
    return Observable.create((obs) => {
        const subscription = intersectionSubject.pipe(filter(entry => entry.target === attributes.element)).subscribe(obs);
        return () => {
            subscription.unsubscribe();
            observer.unobserve(attributes.element);
        };
    });
};

const isVisible = ({ event }) => {
    return event.isIntersecting;
};
const getObservable = (attributes, _getInterObserver = getIntersectionObserver) => {
    if (attributes.customObservable) {
        return attributes.customObservable;
    }
    return _getInterObserver(attributes);
};
const intersectionObserverPreset = Object.assign({}, sharedPreset, {
    isVisible,
    getObservable
});

const isVisible$1 = () => {
    return true;
};
const ɵ0$1 = isVisible$1;
const getObservable$1 = () => {
    return of('load');
};
const ɵ1$1 = getObservable$1;
const loadImage$1 = ({ imagePath }) => {
    return [imagePath];
};
const ɵ2$1 = loadImage$1;
const ssrPreset = Object.assign({}, sharedPreset, {
    isVisible: isVisible$1,
    getObservable: getObservable$1,
    loadImage: loadImage$1
});

function createHooks(platformId, options) {
    const defaultPreset = intersectionObserverPreset;
    const isBot = options && options.isBot ? options.isBot : defaultPreset.isBot;
    if (isBot(getNavigator(), platformId)) {
        return Object.assign(ssrPreset, { isBot });
    }
    else if (!options) {
        return defaultPreset;
    }
    const hooks = {};
    if (options.preset) {
        Object.assign(hooks, options.preset);
    }
    else {
        Object.assign(hooks, defaultPreset);
    }
    Object.keys(options)
        .filter(key => key !== 'preset')
        .forEach(key => {
        hooks[key] = options[key];
    });
    return hooks;
}

function lazyLoadImage(hookSet, attributes) {
    return (evntObservable) => {
        return evntObservable.pipe(tap(data => attributes.onStateChange.emit({ reason: 'observer-emit', data })), filter(event => hookSet.isVisible({
            element: attributes.element,
            event: event,
            offset: attributes.offset,
            scrollContainer: attributes.scrollContainer
        })), take(1), tap(() => attributes.onStateChange.emit({ reason: 'start-loading' })), mergeMap(() => hookSet.loadImage(attributes)), tap(() => attributes.onStateChange.emit({ reason: 'mount-image' })), tap(imagePath => hookSet.setLoadedImage({
            element: attributes.element,
            imagePath,
            useSrcset: attributes.useSrcset
        })), tap(() => attributes.onStateChange.emit({ reason: 'loading-succeeded' })), map(() => true), catchError(error => {
            attributes.onStateChange.emit({ reason: 'loading-failed', data: error });
            hookSet.setErrorImage(attributes);
            return of(false);
        }), tap(() => {
            attributes.onStateChange.emit({ reason: 'finally' });
            hookSet.finally(attributes);
        }));
    };
}

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

var LazyLoadImageModule_1;
let LazyLoadImageModule = LazyLoadImageModule_1 = class LazyLoadImageModule {
    static forRoot(options) {
        return {
            ngModule: LazyLoadImageModule_1,
            providers: [{ provide: 'options', useValue: options }]
        };
    }
};
LazyLoadImageModule = LazyLoadImageModule_1 = __decorate([
    NgModule({
        declarations: [LazyLoadImageDirective],
        exports: [LazyLoadImageDirective]
    })
], LazyLoadImageModule);

class Rect {
    constructor(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    static fromElement(element) {
        const { left, top, right, bottom } = element.getBoundingClientRect();
        if (left === 0 && top === 0 && right === 0 && bottom === 0) {
            return Rect.empty;
        }
        else {
            return new Rect(left, top, right, bottom);
        }
    }
    static fromWindow(_window) {
        return new Rect(0, 0, _window.innerWidth, _window.innerHeight);
    }
    inflate(inflateBy) {
        this.left -= inflateBy;
        this.top -= inflateBy;
        this.right += inflateBy;
        this.bottom += inflateBy;
    }
    intersectsWith(rect) {
        return rect.left < this.right && this.left < rect.right && rect.top < this.bottom && this.top < rect.bottom;
    }
    getIntersectionWith(rect) {
        const left = Math.max(this.left, rect.left);
        const top = Math.max(this.top, rect.top);
        const right = Math.min(this.right, rect.right);
        const bottom = Math.min(this.bottom, rect.bottom);
        if (right >= left && bottom >= top) {
            return new Rect(left, top, right, bottom);
        }
        else {
            return Rect.empty;
        }
    }
}
Rect.empty = new Rect(0, 0, 0, 0);

const scrollListeners = new WeakMap();
function sampleObservable(obs, scheduler) {
    return obs.pipe(sampleTime(100, scheduler), share(), startWith(''));
}
// Only create one scroll listener per target and share the observable.
// Typical, there will only be one observable per application
const getScrollListener = (scrollTarget) => {
    if (!scrollTarget || typeof scrollTarget.addEventListener !== 'function') {
        console.warn('`addEventListener` on ' + scrollTarget + ' (scrollTarget) is not a function. Skipping this target');
        return empty();
    }
    const scrollListener = scrollListeners.get(scrollTarget);
    if (scrollListener) {
        return scrollListener;
    }
    const srollEvent = Observable.create((observer) => {
        const eventName = 'scroll';
        const handler = (event) => observer.next(event);
        const options = { passive: true, capture: false };
        scrollTarget.addEventListener(eventName, handler, options);
        return () => scrollTarget.removeEventListener(eventName, handler, options);
    });
    const listener = sampleObservable(srollEvent);
    scrollListeners.set(scrollTarget, listener);
    return listener;
};

const isVisible$2 = ({ element, offset, scrollContainer }, getWindow = () => window) => {
    const elementBounds = Rect.fromElement(element);
    if (elementBounds === Rect.empty) {
        return false;
    }
    const windowBounds = Rect.fromWindow(getWindow());
    elementBounds.inflate(offset);
    if (scrollContainer) {
        const scrollContainerBounds = Rect.fromElement(scrollContainer);
        const intersection = scrollContainerBounds.getIntersectionWith(windowBounds);
        return elementBounds.intersectsWith(intersection);
    }
    else {
        return elementBounds.intersectsWith(windowBounds);
    }
};
const getObservable$2 = (attributes) => {
    if (attributes.customObservable) {
        return attributes.customObservable.pipe(startWith(''));
    }
    if (attributes.scrollContainer) {
        return getScrollListener(attributes.scrollContainer);
    }
    return getScrollListener(window);
};
const ɵ0$2 = getObservable$2;
const scrollPreset = Object.assign({}, sharedPreset, {
    isVisible: isVisible$2,
    getObservable: getObservable$2
});

var LazyLoadImageModule$1 = LazyLoadImageModule;

/**
 * Generated bundle index. Do not edit.
 */

export { LazyLoadImageDirective, LazyLoadImageModule, intersectionObserverPreset, scrollPreset };
//# sourceMappingURL=ng-lazyload-image.js.map
