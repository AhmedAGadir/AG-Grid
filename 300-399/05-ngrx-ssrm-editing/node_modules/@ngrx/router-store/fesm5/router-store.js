/**
 * @license NgRx 8.5.1
 * (c) 2015-2018 Brandon Roberts, Mike Ryan, Rob Wormald, Victor Savkin
 * License: MIT
 */
import { __assign, __read, __decorate, __param, __metadata } from 'tslib';
import { InjectionToken, NgModule, Inject, ErrorHandler } from '@angular/core';
import { NavigationStart, RoutesRecognized, NavigationCancel, NavigationError, NavigationEnd, Router } from '@angular/router';
import { select, Store, createSelector } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';

/**
 * An action dispatched when a router navigation request is fired.
 */
var ROUTER_REQUEST = '@ngrx/router-store/request';
/**
 * An action dispatched when the router navigates.
 */
var ROUTER_NAVIGATION = '@ngrx/router-store/navigation';
/**
 * An action dispatched when the router cancels navigation.
 */
var ROUTER_CANCEL = '@ngrx/router-store/cancel';
/**
 * An action dispatched when the router errors.
 */
var ROUTER_ERROR = '@ngrx/router-store/error';
/**
 * An action dispatched after navigation has ended and new route is active.
 */
var ROUTER_NAVIGATED = '@ngrx/router-store/navigated';

function routerReducer(state, action) {
    // Allow compilation with strictFunctionTypes - ref: #1344
    var routerAction = action;
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return state;
    }
}

var RouterStateSerializer = /** @class */ (function () {
    function RouterStateSerializer() {
    }
    return RouterStateSerializer;
}());

var DefaultRouterStateSerializer = /** @class */ (function () {
    function DefaultRouterStateSerializer() {
    }
    DefaultRouterStateSerializer.prototype.serialize = function (routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    };
    DefaultRouterStateSerializer.prototype.serializeRoute = function (route) {
        var _this = this;
        var children = route.children.map(function (c) { return _this.serializeRoute(c); });
        return {
            params: route.params,
            paramMap: route.paramMap,
            data: route.data,
            url: route.url,
            outlet: route.outlet,
            routeConfig: route.routeConfig
                ? {
                    component: route.routeConfig.component,
                    path: route.routeConfig.path,
                    pathMatch: route.routeConfig.pathMatch,
                    redirectTo: route.routeConfig.redirectTo,
                    outlet: route.routeConfig.outlet,
                }
                : null,
            queryParams: route.queryParams,
            queryParamMap: route.queryParamMap,
            fragment: route.fragment,
            component: (route.routeConfig
                ? route.routeConfig.component
                : undefined),
            root: undefined,
            parent: undefined,
            firstChild: children[0],
            pathFromRoot: undefined,
            children: children,
        };
    };
    return DefaultRouterStateSerializer;
}());

var MinimalRouterStateSerializer = /** @class */ (function () {
    function MinimalRouterStateSerializer() {
    }
    MinimalRouterStateSerializer.prototype.serialize = function (routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    };
    MinimalRouterStateSerializer.prototype.serializeRoute = function (route) {
        var _this = this;
        var children = route.children.map(function (c) { return _this.serializeRoute(c); });
        return {
            params: route.params,
            data: route.data,
            url: route.url,
            outlet: route.outlet,
            routeConfig: route.routeConfig
                ? {
                    path: route.routeConfig.path,
                    pathMatch: route.routeConfig.pathMatch,
                    redirectTo: route.routeConfig.redirectTo,
                    outlet: route.routeConfig.outlet,
                }
                : null,
            queryParams: route.queryParams,
            fragment: route.fragment,
            firstChild: children[0],
            children: children,
        };
    };
    return MinimalRouterStateSerializer;
}());

var NavigationActionTiming;
(function (NavigationActionTiming) {
    NavigationActionTiming[NavigationActionTiming["PreActivation"] = 1] = "PreActivation";
    NavigationActionTiming[NavigationActionTiming["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
var _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
var ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
var DEFAULT_ROUTER_FEATURENAME = 'router';
function _createRouterConfig(config) {
    return __assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: DefaultRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
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
            var _b = __read(_a, 2), routerStoreState = _b[0], storeState = _b[1];
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
            var _b = __read(_a, 2), event = _b[0], storeState = _b[1];
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
                payload: __assign({ routerState: this.routerState }, payload, { event: this.config.routerState === 1 /* Minimal */
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
    StoreRouterConnectingModule = StoreRouterConnectingModule_1 = __decorate([
        NgModule({}),
        __param(4, Inject(ROUTER_CONFIG)),
        __metadata("design:paramtypes", [Store,
            Router,
            RouterStateSerializer,
            ErrorHandler, Object])
    ], StoreRouterConnectingModule);
    return StoreRouterConnectingModule;
}());

function getSelectors(selectState) {
    var selectRouterState = createSelector(selectState, function (router) { return router && router.state; });
    var selectCurrentRoute = createSelector(selectRouterState, function (routerState) {
        if (!routerState) {
            return undefined;
        }
        var route = routerState.root;
        while (route.firstChild) {
            route = route.firstChild;
        }
        return route;
    });
    var selectQueryParams = createSelector(selectCurrentRoute, function (route) { return route && route.queryParams; });
    var selectQueryParam = function (param) {
        return createSelector(selectQueryParams, function (params) { return params && params[param]; });
    };
    var selectRouteParams = createSelector(selectCurrentRoute, function (route) { return route && route.params; });
    var selectRouteParam = function (param) {
        return createSelector(selectRouteParams, function (params) { return params && params[param]; });
    };
    var selectRouteData = createSelector(selectCurrentRoute, function (route) { return route && route.data; });
    var selectUrl = createSelector(selectRouterState, function (routerState) { return routerState && routerState.url; });
    return {
        selectCurrentRoute: selectCurrentRoute,
        selectQueryParams: selectQueryParams,
        selectQueryParam: selectQueryParam,
        selectRouteParams: selectRouteParams,
        selectRouteParam: selectRouteParam,
        selectRouteData: selectRouteData,
        selectUrl: selectUrl,
    };
}

/**
 * DO NOT EDIT
 *
 * This file is automatically generated at build
 */

/**
 * Generated bundle index. Do not edit.
 */

export { _ROUTER_CONFIG as ɵngrx_modules_router_store_router_store_a, _createRouterConfig as ɵngrx_modules_router_store_router_store_b, ROUTER_ERROR, ROUTER_CANCEL, ROUTER_NAVIGATION, ROUTER_NAVIGATED, ROUTER_REQUEST, routerReducer, StoreRouterConnectingModule, NavigationActionTiming, ROUTER_CONFIG, DEFAULT_ROUTER_FEATURENAME, RouterStateSerializer, DefaultRouterStateSerializer, MinimalRouterStateSerializer, getSelectors };
//# sourceMappingURL=router-store.js.map
