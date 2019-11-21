import * as tslib_1 from "tslib";
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { RouterStateSerializer, } from './serializers/base';
import { DefaultRouterStateSerializer, } from './serializers/default_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
export var NavigationActionTiming;
(function (NavigationActionTiming) {
    NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
    NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
export var _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
export var ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
export var DEFAULT_ROUTER_FEATURENAME = 'router';
export function _createRouterConfig(config) {
    return tslib_1.__assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: DefaultRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
}
var RouterTrigger;
(function (RouterTrigger) {
    RouterTrigger[RouterTrigger["NONE"] = 1] = "NONE";
    RouterTrigger[RouterTrigger["ROUTER"] = 2] = "ROUTER";
    RouterTrigger[RouterTrigger["STORE"] = 3] = "STORE";
})(RouterTrigger || (RouterTrigger = {}));
/**
 * Connects RouterModule with StoreModule.
 *
 * During the navigation, before any guards or resolvers run, the router will dispatch
 * a ROUTER_NAVIGATION action, which has the following signature:
 *
 * ```
 * export type RouterNavigationPayload = {
 *   routerState: SerializedRouterStateSnapshot,
 *   event: RoutesRecognized
 * }
 * ```
 *
 * Either a reducer or an effect can be invoked in response to this action.
 * If the invoked reducer throws, the navigation will be canceled.
 *
 * If navigation gets canceled because of a guard, a ROUTER_CANCEL action will be
 * dispatched. If navigation results in an error, a ROUTER_ERROR action will be dispatched.
 *
 * Both ROUTER_CANCEL and ROUTER_ERROR contain the store state before the navigation
 * which can be used to restore the consistency of the store.
 *
 * Usage:
 *
 * ```typescript
 * @NgModule({
 *   declarations: [AppCmp, SimpleCmp],
 *   imports: [
 *     BrowserModule,
 *     StoreModule.forRoot(mapOfReducers),
 *     RouterModule.forRoot([
 *       { path: '', component: SimpleCmp },
 *       { path: 'next', component: SimpleCmp }
 *     ]),
 *     StoreRouterConnectingModule.forRoot()
 *   ],
 *   bootstrap: [AppCmp]
 * })
 * export class AppModule {
 * }
 * ```
 */
var StoreRouterConnectingModule = /** @class */ (function () {
    function StoreRouterConnectingModule(store, router, serializer, errorHandler, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.lastEvent = null;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = this.config.stateKey;
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    StoreRouterConnectingModule_1 = StoreRouterConnectingModule;
    StoreRouterConnectingModule.forRoot = function (config) {
        if (config === void 0) { config = {}; }
        return {
            ngModule: StoreRouterConnectingModule_1,
            providers: [
                { provide: _ROUTER_CONFIG, useValue: config },
                {
                    provide: ROUTER_CONFIG,
                    useFactory: _createRouterConfig,
                    deps: [_ROUTER_CONFIG],
                },
                {
                    provide: RouterStateSerializer,
                    useClass: config.serializer
                        ? config.serializer
                        : config.routerState === 1 /* Minimal */
                            ? MinimalRouterStateSerializer
                            : DefaultRouterStateSerializer,
                },
            ],
        };
    };
    StoreRouterConnectingModule.prototype.setUpStoreStateListener = function () {
        var _this = this;
        this.store
            .pipe(select(this.stateKey), withLatestFrom(this.store))
            .subscribe(function (_a) {
            var _b = tslib_1.__read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
            _this.navigateIfNeeded(routerStoreState, storeState);
        });
    };
    StoreRouterConnectingModule.prototype.navigateIfNeeded = function (routerStoreState, storeState) {
        var _this = this;
        if (!routerStoreState || !routerStoreState.state) {
            return;
        }
        if (this.trigger === RouterTrigger.ROUTER) {
            return;
        }
        if (this.lastEvent instanceof NavigationStart) {
            return;
        }
        var url = routerStoreState.state.url;
        if (this.router.url !== url) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch(function (error) {
                _this.errorHandler.handleError(error);
            });
        }
    };
    StoreRouterConnectingModule.prototype.setUpRouterEventsListener = function () {
        var _this = this;
        var dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
        var routesRecognized;
        this.router.events
            .pipe(withLatestFrom(this.store))
            .subscribe(function (_a) {
            var _b = tslib_1.__read(_a, 2), event = _b[0], storeState = _b[1];
            _this.lastEvent = event;
            if (event instanceof NavigationStart) {
                _this.routerState = _this.serializer.serialize(_this.router.routerState.snapshot);
                if (_this.trigger !== RouterTrigger.STORE) {
                    _this.storeState = storeState;
                    _this.dispatchRouterRequest(event);
                }
            }
            else if (event instanceof RoutesRecognized) {
                routesRecognized = event;
                if (!dispatchNavLate && _this.trigger !== RouterTrigger.STORE) {
                    _this.dispatchRouterNavigation(event);
                }
            }
            else if (event instanceof NavigationCancel) {
                _this.dispatchRouterCancel(event);
                _this.reset();
            }
            else if (event instanceof NavigationError) {
                _this.dispatchRouterError(event);
                _this.reset();
            }
            else if (event instanceof NavigationEnd) {
                if (_this.trigger !== RouterTrigger.STORE) {
                    if (dispatchNavLate) {
                        _this.dispatchRouterNavigation(routesRecognized);
                    }
                    _this.dispatchRouterNavigated(event);
                }
                _this.reset();
            }
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterRequest = function (event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event: event });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterNavigation = function (lastRoutesRecognized) {
        var nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterCancel = function (event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            storeState: this.storeState,
            event: event,
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterError = function (event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, "" + event),
        });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterNavigated = function (event) {
        var routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event: event, routerState: routerState });
    };
    StoreRouterConnectingModule.prototype.dispatchRouterAction = function (type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type: type,
                payload: tslib_1.__assign({ routerState: this.routerState }, payload, { event: this.config.routerState === 1 /* Minimal */
                        ? { id: payload.event.id, url: payload.event.url }
                        : payload.event }),
            });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    };
    StoreRouterConnectingModule.prototype.reset = function () {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    };
    var StoreRouterConnectingModule_1;
    StoreRouterConnectingModule = StoreRouterConnectingModule_1 = tslib_1.__decorate([
        NgModule({}),
        tslib_1.__param(4, Inject(ROUTER_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Store,
            Router,
            RouterStateSerializer,
            ErrorHandler, Object])
    ], StoreRouterConnectingModule);
    return StoreRouterConnectingModule;
}());
export { StoreRouterConnectingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLHFCQUFxQixHQUV0QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsR0FFN0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQTBDaEYsTUFBTSxDQUFOLElBQVksc0JBR1g7QUFIRCxXQUFZLHNCQUFzQjtJQUNoQyxxRkFBaUIsQ0FBQTtJQUNqQix1RkFBa0IsQ0FBQTtBQUNwQixDQUFDLEVBSFcsc0JBQXNCLEtBQXRCLHNCQUFzQixRQUdqQztBQUVELE1BQU0sQ0FBQyxJQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDLENBQUM7QUFDRixNQUFNLENBQUMsSUFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFr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UUFBUSxDQUFDO2dCQUNsQixJQUFJLE1BQUE7Z0JBQ0osT0FBTyxxQkFDTCxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsSUFDMUIsT0FBTyxJQUNWLEtBQUssRUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsb0JBQXdCO3dCQUM3QyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO3dCQUNsRCxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssR0FDcEI7YUFDRixDQUFDLENBQUM7U0FDSjtnQkFBUztZQUNSLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztTQUNuQztJQUNILENBQUM7SUFFTywyQ0FBSyxHQUFiO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzFCLENBQUM7O0lBak1VLDJCQUEyQjtRQUR2QyxRQUFRLENBQUMsRUFBRSxDQUFDO1FBd0NSLG1CQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtpREFKUCxLQUFLO1lBQ0osTUFBTTtZQUNGLHFCQUFxQjtZQUNuQixZQUFZO09BdEN6QiwyQkFBMkIsQ0FrTXZDO0lBQUQsa0NBQUM7Q0FBQSxBQWxNRCxJQWtNQztTQWxNWSwyQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBNb2R1bGVXaXRoUHJvdmlkZXJzLFxuICBOZ01vZHVsZSxcbiAgRXJyb3JIYW5kbGVyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE5hdmlnYXRpb25DYW5jZWwsXG4gIE5hdmlnYXRpb25FcnJvcixcbiAgTmF2aWdhdGlvbkVuZCxcbiAgUm91dGVyLFxuICBSb3V0ZXNSZWNvZ25pemVkLFxuICBOYXZpZ2F0aW9uU3RhcnQsXG4gIEV2ZW50LFxuICBSb3V0ZXJFdmVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IHNlbGVjdCwgU2VsZWN0b3IsIFN0b3JlIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHsgd2l0aExhdGVzdEZyb20gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7XG4gIFJPVVRFUl9DQU5DRUwsXG4gIFJPVVRFUl9FUlJPUixcbiAgUk9VVEVSX05BVklHQVRFRCxcbiAgUk9VVEVSX05BVklHQVRJT04sXG4gIFJPVVRFUl9SRVFVRVNULFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgUm91dGVyUmVkdWNlclN0YXRlIH0gZnJvbSAnLi9yZWR1Y2VyJztcbmltcG9ydCB7XG4gIFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgQmFzZVJvdXRlclN0b3JlU3RhdGUsXG59IGZyb20gJy4vc2VyaWFsaXplcnMvYmFzZSc7XG5pbXBvcnQge1xuICBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9kZWZhdWx0X3NlcmlhbGl6ZXInO1xuaW1wb3J0IHsgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vc2VyaWFsaXplcnMvbWluaW1hbF9zZXJpYWxpemVyJztcblxuZXhwb3J0IHR5cGUgU3RhdGVLZXlPclNlbGVjdG9yPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiA9IHN0cmluZyB8IFNlbGVjdG9yPGFueSwgUm91dGVyUmVkdWNlclN0YXRlPFQ+PjtcblxuLyoqXG4gKiBGdWxsID0gU2VyaWFsaXplcyB0aGUgcm91dGVyIGV2ZW50IHdpdGggRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICogTWluaW1hbCA9IFNlcmlhbGl6ZXMgdGhlIHJvdXRlciBldmVudCB3aXRoIE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGVudW0gUm91dGVyU3RhdGUge1xuICBGdWxsLFxuICBNaW5pbWFsLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0b3JlUm91dGVyQ29uZmlnPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPiB7XG4gIHN0YXRlS2V5PzogU3RhdGVLZXlPclNlbGVjdG9yPFQ+O1xuICBzZXJpYWxpemVyPzogbmV3ICguLi5hcmdzOiBhbnlbXSkgPT4gUm91dGVyU3RhdGVTZXJpYWxpemVyO1xuICAvKipcbiAgICogQnkgZGVmYXVsdCwgUk9VVEVSX05BVklHQVRJT04gaXMgZGlzcGF0Y2hlZCBiZWZvcmUgZ3VhcmRzIGFuZCByZXNvbHZlcnMgcnVuLlxuICAgKiBUaGVyZWZvcmUsIHRoZSBhY3Rpb24gY291bGQgcnVuIHRvbyBzb29uLCBmb3IgZXhhbXBsZVxuICAgKiB0aGVyZSBtYXkgYmUgYSBuYXZpZ2F0aW9uIGNhbmNlbCBkdWUgdG8gYSBndWFyZCBzYXlpbmcgdGhlIG5hdmlnYXRpb24gaXMgbm90IGFsbG93ZWQuXG4gICAqIFRvIHJ1biBST1VURVJfTkFWSUdBVElPTiBhZnRlciBndWFyZHMgYW5kIHJlc29sdmVycyxcbiAgICogc2V0IHRoaXMgcHJvcGVydHkgdG8gTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbi5cbiAgICovXG4gIG5hdmlnYXRpb25BY3Rpb25UaW1pbmc/OiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nO1xuICAvKipcbiAgICogRGVjaWRlcyB3aGljaCByb3V0ZXIgc2VyaWFsaXplciBzaG91bGQgYmUgdXNlZCwgaWYgdGhlcmUgaXMgbm9uZSBwcm92aWRlZCwgYW5kIHRoZSBtZXRhZGF0YSBvbiB0aGUgZGlzcGF0Y2hlZCBAbmdyeC9yb3V0ZXItc3RvcmUgYWN0aW9uIHBheWxvYWQuXG4gICAqIFNldCB0byBgRnVsbGAgdG8gdXNlIHRoZSBgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCB0aGUgYW5ndWxhciByb3V0ZXIgZXZlbnRzIGFzIHBheWxvYWQuXG4gICAqIFNldCB0byBgTWluaW1hbGAgdG8gdXNlIHRoZSBgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplcmAgYW5kIHRvIHNldCBhIG1pbmltYWwgcm91dGVyIGV2ZW50IHdpdGggdGhlIG5hdmlnYXRpb24gaWQgYW5kIHVybCBhcyBwYXlsb2FkLlxuICAgKi9cbiAgcm91dGVyU3RhdGU/OiBSb3V0ZXJTdGF0ZTtcbn1cblxuaW50ZXJmYWNlIFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZCB7XG4gIGV2ZW50OiBSb3V0ZXJFdmVudDtcbiAgcm91dGVyU3RhdGU/OiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdDtcbiAgc3RvcmVTdGF0ZT86IGFueTtcbn1cblxuZXhwb3J0IGVudW0gTmF2aWdhdGlvbkFjdGlvblRpbWluZyB7XG4gIFByZUFjdGl2YXRpb24gPSAxLFxuICBQb3N0QWN0aXZhdGlvbiA9IDIsXG59XG5cbmV4cG9ydCBjb25zdCBfUk9VVEVSX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbihcbiAgJ0BuZ3J4L3JvdXRlci1zdG9yZSBJbnRlcm5hbCBDb25maWd1cmF0aW9uJ1xuKTtcbmV4cG9ydCBjb25zdCBST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FID0gJ3JvdXRlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBfY3JlYXRlUm91dGVyQ29uZmlnKFxuICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnXG4pOiBTdG9yZVJvdXRlckNvbmZpZyB7XG4gIHJldHVybiB7XG4gICAgc3RhdGVLZXk6IERFRkFVTFRfUk9VVEVSX0ZFQVRVUkVOQU1FLFxuICAgIHNlcmlhbGl6ZXI6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgbmF2aWdhdGlvbkFjdGlvblRpbWluZzogTmF2aWdhdGlvbkFjdGlvblRpbWluZy5QcmVBY3RpdmF0aW9uLFxuICAgIC4uLmNvbmZpZyxcbiAgfTtcbn1cblxuZW51bSBSb3V0ZXJUcmlnZ2VyIHtcbiAgTk9ORSA9IDEsXG4gIFJPVVRFUiA9IDIsXG4gIFNUT1JFID0gMyxcbn1cblxuLyoqXG4gKiBDb25uZWN0cyBSb3V0ZXJNb2R1bGUgd2l0aCBTdG9yZU1vZHVsZS5cbiAqXG4gKiBEdXJpbmcgdGhlIG5hdmlnYXRpb24sIGJlZm9yZSBhbnkgZ3VhcmRzIG9yIHJlc29sdmVycyBydW4sIHRoZSByb3V0ZXIgd2lsbCBkaXNwYXRjaFxuICogYSBST1VURVJfTkFWSUdBVElPTiBhY3Rpb24sIHdoaWNoIGhhcyB0aGUgZm9sbG93aW5nIHNpZ25hdHVyZTpcbiAqXG4gKiBgYGBcbiAqIGV4cG9ydCB0eXBlIFJvdXRlck5hdmlnYXRpb25QYXlsb2FkID0ge1xuICogICByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QsXG4gKiAgIGV2ZW50OiBSb3V0ZXNSZWNvZ25pemVkXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBFaXRoZXIgYSByZWR1Y2VyIG9yIGFuIGVmZmVjdCBjYW4gYmUgaW52b2tlZCBpbiByZXNwb25zZSB0byB0aGlzIGFjdGlvbi5cbiAqIElmIHRoZSBpbnZva2VkIHJlZHVjZXIgdGhyb3dzLCB0aGUgbmF2aWdhdGlvbiB3aWxsIGJlIGNhbmNlbGVkLlxuICpcbiAqIElmIG5hdmlnYXRpb24gZ2V0cyBjYW5jZWxlZCBiZWNhdXNlIG9mIGEgZ3VhcmQsIGEgUk9VVEVSX0NBTkNFTCBhY3Rpb24gd2lsbCBiZVxuICogZGlzcGF0Y2hlZC4gSWYgbmF2aWdhdGlvbiByZXN1bHRzIGluIGFuIGVycm9yLCBhIFJPVVRFUl9FUlJPUiBhY3Rpb24gd2lsbCBiZSBkaXNwYXRjaGVkLlxuICpcbiAqIEJvdGggUk9VVEVSX0NBTkNFTCBhbmQgUk9VVEVSX0VSUk9SIGNvbnRhaW4gdGhlIHN0b3JlIHN0YXRlIGJlZm9yZSB0aGUgbmF2aWdhdGlvblxuICogd2hpY2ggY2FuIGJlIHVzZWQgdG8gcmVzdG9yZSB0aGUgY29uc2lzdGVuY3kgb2YgdGhlIHN0b3JlLlxuICpcbiAqIFVzYWdlOlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBOZ01vZHVsZSh7XG4gKiAgIGRlY2xhcmF0aW9uczogW0FwcENtcCwgU2ltcGxlQ21wXSxcbiAqICAgaW1wb3J0czogW1xuICogICAgIEJyb3dzZXJNb2R1bGUsXG4gKiAgICAgU3RvcmVNb2R1bGUuZm9yUm9vdChtYXBPZlJlZHVjZXJzKSxcbiAqICAgICBSb3V0ZXJNb2R1bGUuZm9yUm9vdChbXG4gKiAgICAgICB7IHBhdGg6ICcnLCBjb21wb25lbnQ6IFNpbXBsZUNtcCB9LFxuICogICAgICAgeyBwYXRoOiAnbmV4dCcsIGNvbXBvbmVudDogU2ltcGxlQ21wIH1cbiAqICAgICBdKSxcbiAqICAgICBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUuZm9yUm9vdCgpXG4gKiAgIF0sXG4gKiAgIGJvb3RzdHJhcDogW0FwcENtcF1cbiAqIH0pXG4gKiBleHBvcnQgY2xhc3MgQXBwTW9kdWxlIHtcbiAqIH1cbiAqIGBgYFxuICovXG5ATmdNb2R1bGUoe30pXG5leHBvcnQgY2xhc3MgU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3Q8XG4gICAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3RcbiAgPihcbiAgICBjb25maWc6IFN0b3JlUm91dGVyQ29uZmlnPFQ+ID0ge31cbiAgKTogTW9kdWxlV2l0aFByb3ZpZGVyczxTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7IHByb3ZpZGU6IF9ST1VURVJfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBST1VURVJfQ09ORklHLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IF9jcmVhdGVSb3V0ZXJDb25maWcsXG4gICAgICAgICAgZGVwczogW19ST1VURVJfQ09ORklHXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgICB1c2VDbGFzczogY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgID8gY29uZmlnLnNlcmlhbGl6ZXJcbiAgICAgICAgICAgIDogY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5NaW5pbWFsXG4gICAgICAgICAgICAgID8gTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICAgICAgICAgICAgICA6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGxhc3RFdmVudDogRXZlbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByb3V0ZXJTdGF0ZTogU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfCBudWxsO1xuICBwcml2YXRlIHN0b3JlU3RhdGU6IGFueTtcbiAgcHJpdmF0ZSB0cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5OT05FO1xuXG4gIHByaXZhdGUgc3RhdGVLZXk6IFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxhbnk+LFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSBzZXJpYWxpemVyOiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8U2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Q+LFxuICAgIHByaXZhdGUgZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG4gICAgQEluamVjdChST1VURVJfQ09ORklHKSBwcml2YXRlIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbiAgKSB7XG4gICAgdGhpcy5zdGF0ZUtleSA9IHRoaXMuY29uZmlnLnN0YXRlS2V5IGFzIFN0YXRlS2V5T3JTZWxlY3RvcjtcblxuICAgIHRoaXMuc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTtcbiAgICB0aGlzLnNldFVwUm91dGVyRXZlbnRzTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBTdG9yZVN0YXRlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5zdG9yZVxuICAgICAgLnBpcGUoXG4gICAgICAgIHNlbGVjdCh0aGlzLnN0YXRlS2V5IGFzIGFueSksXG4gICAgICAgIHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKChbcm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZV0pID0+IHtcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZUlmTmVlZGVkKHJvdXRlclN0b3JlU3RhdGUsIHN0b3JlU3RhdGUpO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG5hdmlnYXRlSWZOZWVkZWQoXG4gICAgcm91dGVyU3RvcmVTdGF0ZTogUm91dGVyUmVkdWNlclN0YXRlLFxuICAgIHN0b3JlU3RhdGU6IGFueVxuICApOiB2b2lkIHtcbiAgICBpZiAoIXJvdXRlclN0b3JlU3RhdGUgfHwgIXJvdXRlclN0b3JlU3RhdGUuc3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMudHJpZ2dlciA9PT0gUm91dGVyVHJpZ2dlci5ST1VURVIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdEV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdXJsID0gcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZS51cmw7XG4gICAgaWYgKHRoaXMucm91dGVyLnVybCAhPT0gdXJsKSB7XG4gICAgICB0aGlzLnN0b3JlU3RhdGUgPSBzdG9yZVN0YXRlO1xuICAgICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5TVE9SRTtcbiAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlQnlVcmwodXJsKS5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLmhhbmRsZUVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICBjb25zdCBkaXNwYXRjaE5hdkxhdGUgPVxuICAgICAgdGhpcy5jb25maWcubmF2aWdhdGlvbkFjdGlvblRpbWluZyA9PT1cbiAgICAgIE5hdmlnYXRpb25BY3Rpb25UaW1pbmcuUG9zdEFjdGl2YXRpb247XG4gICAgbGV0IHJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWQ7XG5cbiAgICB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKHdpdGhMYXRlc3RGcm9tKHRoaXMuc3RvcmUpKVxuICAgICAgLnN1YnNjcmliZSgoW2V2ZW50LCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RFdmVudCA9IGV2ZW50O1xuXG4gICAgICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25TdGFydCkge1xuICAgICAgICAgIHRoaXMucm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgUm91dGVzUmVjb2duaXplZCkge1xuICAgICAgICAgIHJvdXRlc1JlY29nbml6ZWQgPSBldmVudDtcblxuICAgICAgICAgIGlmICghZGlzcGF0Y2hOYXZMYXRlICYmIHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oZXZlbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25DYW5jZWwpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyQ2FuY2VsKGV2ZW50KTtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpIHtcbiAgICAgICAgICBpZiAodGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICBpZiAoZGlzcGF0Y2hOYXZMYXRlKSB7XG4gICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKHJvdXRlc1JlY29nbml6ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRlZChldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyUmVxdWVzdChldmVudDogTmF2aWdhdGlvblN0YXJ0KTogdm9pZCB7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfUkVRVUVTVCwgeyBldmVudCB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0aW9uKFxuICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkOiBSb3V0ZXNSZWNvZ25pemVkXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IG5leHRSb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5zdGF0ZVxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVElPTiwge1xuICAgICAgcm91dGVyU3RhdGU6IG5leHRSb3V0ZXJTdGF0ZSxcbiAgICAgIGV2ZW50OiBuZXcgUm91dGVzUmVjb2duaXplZChcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQuaWQsXG4gICAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnVybCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsQWZ0ZXJSZWRpcmVjdHMsXG4gICAgICAgIG5leHRSb3V0ZXJTdGF0ZVxuICAgICAgKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQ6IE5hdmlnYXRpb25DYW5jZWwpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9DQU5DRUwsIHtcbiAgICAgIHN0b3JlU3RhdGU6IHRoaXMuc3RvcmVTdGF0ZSxcbiAgICAgIGV2ZW50LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckVycm9yKGV2ZW50OiBOYXZpZ2F0aW9uRXJyb3IpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9FUlJPUiwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBOYXZpZ2F0aW9uRXJyb3IoZXZlbnQuaWQsIGV2ZW50LnVybCwgYCR7ZXZlbnR9YCksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50OiBOYXZpZ2F0aW9uRW5kKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGVyU3RhdGUgPSB0aGlzLnNlcmlhbGl6ZXIuc2VyaWFsaXplKFxuICAgICAgdGhpcy5yb3V0ZXIucm91dGVyU3RhdGUuc25hcHNob3RcbiAgICApO1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX05BVklHQVRFRCwgeyBldmVudCwgcm91dGVyU3RhdGUgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyQWN0aW9uKFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBwYXlsb2FkOiBTdG9yZVJvdXRlckFjdGlvblBheWxvYWRcbiAgKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyID0gUm91dGVyVHJpZ2dlci5ST1VURVI7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe1xuICAgICAgICB0eXBlLFxuICAgICAgICBwYXlsb2FkOiB7XG4gICAgICAgICAgcm91dGVyU3RhdGU6IHRoaXMucm91dGVyU3RhdGUsXG4gICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICBldmVudDpcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLnJvdXRlclN0YXRlID09PSBSb3V0ZXJTdGF0ZS5NaW5pbWFsXG4gICAgICAgICAgICAgID8geyBpZDogcGF5bG9hZC5ldmVudC5pZCwgdXJsOiBwYXlsb2FkLmV2ZW50LnVybCB9XG4gICAgICAgICAgICAgIDogcGF5bG9hZC5ldmVudCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNldCgpIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG4gICAgdGhpcy5zdG9yZVN0YXRlID0gbnVsbDtcbiAgICB0aGlzLnJvdXRlclN0YXRlID0gbnVsbDtcbiAgfVxufVxuIl19