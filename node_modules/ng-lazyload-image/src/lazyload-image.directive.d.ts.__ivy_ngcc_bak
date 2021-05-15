import { AfterContentInit, ElementRef, EventEmitter, NgZone, OnChanges, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleOptions, StateChange } from './types';
export declare class LazyLoadImageDirective implements OnChanges, AfterContentInit, OnDestroy {
    lazyImage: string;
    defaultImage?: string;
    errorImage?: string;
    scrollTarget?: any;
    customObservable?: Observable<any>;
    offset?: number;
    useSrcset?: boolean;
    decode?: boolean;
    debug?: boolean;
    onStateChange: EventEmitter<StateChange>;
    onLoad: EventEmitter<boolean>;
    private propertyChanges$;
    private elementRef;
    private ngZone;
    private loadSubscription?;
    private debugSubscription?;
    private hooks;
    private platformId;
    constructor(el: ElementRef, ngZone: NgZone, platformId: Object, options?: ModuleOptions);
    ngOnChanges(): void;
    ngAfterContentInit(): any;
    ngOnDestroy(): void;
}
