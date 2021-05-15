/**
 * Shailendra Kumar <shailu.snist@gmail.com>
 * @ignore
 */
import { OnInit, OnDestroy, ElementRef, EventEmitter, AfterContentInit } from '@angular/core';
import { MasonryOptions, Masonry as IMasonry, AnimationOptions } from './ng-masonry-grid.interface';
import { NgMasonryGridService } from './ng-masonry-grid.service';
export declare class NgMasonryGridComponent implements OnInit, OnDestroy, AfterContentInit {
    private _platformId;
    private _element;
    private masonryGridService;
    _msnry: IMasonry;
    masonryOptions: MasonryOptions;
    useAnimation: boolean;
    scrollAnimationOptions: AnimationOptions;
    useImagesLoaded: boolean;
    layoutComplete: EventEmitter<any[]>;
    removeComplete: EventEmitter<any[]>;
    onNgMasonryInit: EventEmitter<IMasonry>;
    constructor(_platformId: any, _element: ElementRef, masonryGridService: NgMasonryGridService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    layout(): void;
    remove(element: HTMLElement[]): void;
    add(element: HTMLElement): void;
    initializeMasonry(): void;
}
