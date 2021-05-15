import { __decorate, __param } from 'tslib';
import { isPlatformServer } from '@angular/common';
import { EventEmitter, ElementRef, NgZone, Inject, PLATFORM_ID, Optional, Input, Output, Directive, NgModule } from '@angular/core';
import { Subject, Observable, of, ReplaySubject, never, empty } from 'rxjs';
import { filter, tap, take, mergeMap, map, catchError, switchMap, sampleTime, share, startWith } from 'rxjs/operators';

var cssClassNames = {
    loaded: 'ng-lazyloaded',
    loading: 'ng-lazyloading',
    failed: 'ng-failed-lazyloaded'
};
function removeCssClassName(element, cssClassName) {
    element.className = element.className.replace(cssClassName, '');
}
function addCssClassName(element, cssClassName) {
    if (!element.className.includes(cssClassName)) {
        element.className += " " + cssClassName;
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
        element.style.backgroundImage = "url('" + imagePath + "')";
    }
    return element;
}
function setSources(attrName) {
    return function (image) {
        var sources = image.parentElement.getElementsByTagName('source');
        for (var i = 0; i < sources.length; i++) {
            var attrValue = sources[i].getAttribute(attrName);
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
var setSourcesToDefault = setSources('defaultImage');
var setSourcesToLazy = setSources('lazyLoad');
var setSourcesToError = setSources('errorImage');
function setImageAndSources(setSourcesFn) {
    return function (element, imagePath, useSrcset) {
        if (isImageElement(element) && isChildOfPicture(element)) {
            setSourcesFn(element);
        }
        if (imagePath) {
            setImage(element, imagePath, useSrcset);
        }
    };
}
var setImageAndSourcesToDefault = setImageAndSources(setSourcesToDefault);
var setImageAndSourcesToLazy = setImageAndSources(setSourcesToLazy);
var setImageAndSourcesToError = setImageAndSources(setSourcesToError);

var end = function (_a) {
    var element = _a.element;
    addCssClassName(element, cssClassNames.loaded);
    removeCssClassName(element, cssClassNames.loading);
};
var ɵ0 = end;
var loadImage = function (_a) {
    var element = _a.element, useSrcset = _a.useSrcset, imagePath = _a.imagePath, decode = _a.decode;
    var img;
    if (isImageElement(element) && isChildOfPicture(element)) {
        var parentClone = element.parentNode.cloneNode(true);
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
        return img.decode().then(function () { return imagePath; });
    }
    return new Promise(function (resolve, reject) {
        img.onload = function () { return resolve(imagePath); };
        img.onerror = function () { return reject(null); };
    });
};
var setErrorImage = function (_a) {
    var element = _a.element, errorImagePath = _a.errorImagePath, useSrcset = _a.useSrcset;
    setImageAndSourcesToError(element, errorImagePath, useSrcset);
    addCssClassName(element, cssClassNames.failed);
};
var ɵ1 = setErrorImage;
var setLoadedImage = function (_a) {
    var element = _a.element, imagePath = _a.imagePath, useSrcset = _a.useSrcset;
    setImageAndSourcesToLazy(element, imagePath, useSrcset);
};
var ɵ2 = setLoadedImage;
var setup = function (_a) {
    var element = _a.element, defaultImagePath = _a.defaultImagePath, useSrcset = _a.useSrcset;
    setImageAndSourcesToDefault(element, defaultImagePath, useSrcset);
    addCssClassName(element, cssClassNames.loading);
    if (hasCssClassName(element, cssClassNames.loaded)) {
        removeCssClassName(element, cssClassNames.loaded);
    }
};
var ɵ3 = setup;
var isBot = function (navigator) {
    if (navigator && navigator.userAgent) {
        return /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora\ link\ preview|showyoubot|outbrain|pinterest\/0\.|pinterestbot|slackbot|vkShare|W3C_Validator|whatsapp|duckduckbot/i.test(navigator.userAgent);
    }
    return false;
};
var sharedPreset = {
    finally: end,
    loadImage: loadImage,
    setErrorImage: setErrorImage,
    setLoadedImage: setLoadedImage,
    setup: setup,
    isBot: isBot
};

var observers = new WeakMap();
var intersectionSubject = new Subject();
function loadingCallback(entrys) {
    entrys.forEach(function (entry) { return intersectionSubject.next(entry); });
}
var uniqKey = {};
var getIntersectionObserver = function (attributes) {
    var scrollContainerKey = attributes.scrollContainer || uniqKey;
    var options = {
        root: attributes.scrollContainer || null
    };
    if (attributes.offset) {
        options.rootMargin = attributes.offset + "px";
    }
    var observer = observers.get(scrollContainerKey);
    if (!observer) {
        observer = new IntersectionObserver(loadingCallback, options);
        observers.set(scrollContainerKey, observer);
    }
    observer.observe(attributes.element);
    return Observable.create(function (obs) {
        var subscription = intersectionSubject.pipe(filter(function (entry) { return entry.target === attributes.element; })).subscribe(obs);
        return function () {
            subscription.unsubscribe();
            observer.unobserve(attributes.element);
        };
    });
};

var isVisible = function (_a) {
    var event = _a.event;
    return event.isIntersecting;
};
var getObservable = function (attributes, _getInterObserver) {
    if (_getInterObserver === void 0) { _getInterObserver = getIntersectionObserver; }
    if (attributes.customObservable) {
        return attributes.customObservable;
    }
    return _getInterObserver(attributes);
};
var intersectionObserverPreset = Object.assign({}, sharedPreset, {
    isVisible: isVisible,
    getObservable: getObservable
});

var isVisible$1 = function () {
    return true;
};
var ɵ0$1 = isVisible$1;
var getObservable$1 = function () {
    return of('load');
};
var ɵ1$1 = getObservable$1;
var loadImage$1 = function (_a) {
    var imagePath = _a.imagePath;
    return [imagePath];
};
var ɵ2$1 = loadImage$1;
var ssrPreset = Object.assign({}, sharedPreset, {
    isVisible: isVisible$1,
    getObservable: getObservable$1,
    loadImage: loadImage$1
});

function createHooks(platformId, options) {
    var defaultPreset = intersectionObserverPreset;
    var isBot = options && options.isBot ? options.isBot : defaultPreset.isBot;
    if (isBot(getNavigator(), platformId)) {
        return Object.assign(ssrPreset, { isBot: isBot });
    }
    else if (!options) {
        return defaultPreset;
    }
    var hooks = {};
    if (options.preset) {
        Object.assign(hooks, options.preset);
    }
    else {
        Object.assign(hooks, defaultPreset);
    }
    Object.keys(options)
        .filter(function (key) { return key !== 'preset'; })
        .forEach(function (key) {
        hooks[key] = options[key];
    });
    return hooks;
}

function lazyLoadImage(hookSet, attributes) {
    return function (evntObservable) {
        return evntObservable.pipe(tap(function (data) { return attributes.onStateChange.emit({ reason: 'observer-emit', data: data }); }), filter(function (event) {
            return hookSet.isVisible({
                element: attributes.element,
                event: event,
                offset: attributes.offset,
                scrollContainer: attributes.scrollContainer
            });
        }), take(1), tap(function () { return attributes.onStateChange.emit({ reason: 'start-loading' }); }), mergeMap(function () { return hookSet.loadImage(attributes); }), tap(function () { return attributes.onStateChange.emit({ reason: 'mount-image' }); }), tap(function (imagePath) {
            return hookSet.setLoadedImage({
                element: attributes.element,
                imagePath: imagePath,
                useSrcset: attributes.useSrcset
            });
        }), tap(function () { return attributes.onStateChange.emit({ reason: 'loading-succeeded' }); }), map(function () { return true; }), catchError(function (error) {
            attributes.onStateChange.emit({ reason: 'loading-failed', data: error });
            hookSet.setErrorImage(attributes);
            return of(false);
        }), tap(function () {
            attributes.onStateChange.emit({ reason: 'finally' });
            hookSet.finally(attributes);
        }));
    };
}

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

var LazyLoadImageModule = /** @class */ (function () {
    function LazyLoadImageModule() {
    }
    LazyLoadImageModule_1 = LazyLoadImageModule;
    LazyLoadImageModule.forRoot = function (options) {
        return {
            ngModule: LazyLoadImageModule_1,
            providers: [{ provide: 'options', useValue: options }]
        };
    };
    var LazyLoadImageModule_1;
    LazyLoadImageModule = LazyLoadImageModule_1 = __decorate([
        NgModule({
            declarations: [LazyLoadImageDirective],
            exports: [LazyLoadImageDirective]
        })
    ], LazyLoadImageModule);
    return LazyLoadImageModule;
}());

var Rect = /** @class */ (function () {
    function Rect(left, top, right, bottom) {
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }
    Rect.fromElement = function (element) {
        var _a = element.getBoundingClientRect(), left = _a.left, top = _a.top, right = _a.right, bottom = _a.bottom;
        if (left === 0 && top === 0 && right === 0 && bottom === 0) {
            return Rect.empty;
        }
        else {
            return new Rect(left, top, right, bottom);
        }
    };
    Rect.fromWindow = function (_window) {
        return new Rect(0, 0, _window.innerWidth, _window.innerHeight);
    };
    Rect.prototype.inflate = function (inflateBy) {
        this.left -= inflateBy;
        this.top -= inflateBy;
        this.right += inflateBy;
        this.bottom += inflateBy;
    };
    Rect.prototype.intersectsWith = function (rect) {
        return rect.left < this.right && this.left < rect.right && rect.top < this.bottom && this.top < rect.bottom;
    };
    Rect.prototype.getIntersectionWith = function (rect) {
        var left = Math.max(this.left, rect.left);
        var top = Math.max(this.top, rect.top);
        var right = Math.min(this.right, rect.right);
        var bottom = Math.min(this.bottom, rect.bottom);
        if (right >= left && bottom >= top) {
            return new Rect(left, top, right, bottom);
        }
        else {
            return Rect.empty;
        }
    };
    Rect.empty = new Rect(0, 0, 0, 0);
    return Rect;
}());

var scrollListeners = new WeakMap();
function sampleObservable(obs, scheduler) {
    return obs.pipe(sampleTime(100, scheduler), share(), startWith(''));
}
// Only create one scroll listener per target and share the observable.
// Typical, there will only be one observable per application
var getScrollListener = function (scrollTarget) {
    if (!scrollTarget || typeof scrollTarget.addEventListener !== 'function') {
        console.warn('`addEventListener` on ' + scrollTarget + ' (scrollTarget) is not a function. Skipping this target');
        return empty();
    }
    var scrollListener = scrollListeners.get(scrollTarget);
    if (scrollListener) {
        return scrollListener;
    }
    var srollEvent = Observable.create(function (observer) {
        var eventName = 'scroll';
        var handler = function (event) { return observer.next(event); };
        var options = { passive: true, capture: false };
        scrollTarget.addEventListener(eventName, handler, options);
        return function () { return scrollTarget.removeEventListener(eventName, handler, options); };
    });
    var listener = sampleObservable(srollEvent);
    scrollListeners.set(scrollTarget, listener);
    return listener;
};

var isVisible$2 = function (_a, getWindow) {
    var element = _a.element, offset = _a.offset, scrollContainer = _a.scrollContainer;
    if (getWindow === void 0) { getWindow = function () { return window; }; }
    var elementBounds = Rect.fromElement(element);
    if (elementBounds === Rect.empty) {
        return false;
    }
    var windowBounds = Rect.fromWindow(getWindow());
    elementBounds.inflate(offset);
    if (scrollContainer) {
        var scrollContainerBounds = Rect.fromElement(scrollContainer);
        var intersection = scrollContainerBounds.getIntersectionWith(windowBounds);
        return elementBounds.intersectsWith(intersection);
    }
    else {
        return elementBounds.intersectsWith(windowBounds);
    }
};
var getObservable$2 = function (attributes) {
    if (attributes.customObservable) {
        return attributes.customObservable.pipe(startWith(''));
    }
    if (attributes.scrollContainer) {
        return getScrollListener(attributes.scrollContainer);
    }
    return getScrollListener(window);
};
var ɵ0$2 = getObservable$2;
var scrollPreset = Object.assign({}, sharedPreset, {
    isVisible: isVisible$2,
    getObservable: getObservable$2
});

/**
 * Generated bundle index. Do not edit.
 */

export { LazyLoadImageDirective, LazyLoadImageModule, intersectionObserverPreset, scrollPreset };
//# sourceMappingURL=ng-lazyload-image.js.map
