/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Inject, InjectionToken, NgModule, ErrorHandler, } from '@angular/core';
import { NavigationCancel, NavigationError, NavigationEnd, Router, RoutesRecognized, NavigationStart, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { withLatestFrom } from 'rxjs/operators';
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATED, ROUTER_NAVIGATION, ROUTER_REQUEST, } from './actions';
import { RouterStateSerializer, } from './serializers/base';
import { DefaultRouterStateSerializer, } from './serializers/default_serializer';
import { MinimalRouterStateSerializer } from './serializers/minimal_serializer';
/** @enum {number} */
const RouterState = {
    Full: 0,
    Minimal: 1,
};
export { RouterState };
/**
 * @record
 * @template T
 */
export function StoreRouterConfig() { }
if (false) {
    /** @type {?|undefined} */
    StoreRouterConfig.prototype.stateKey;
    /** @type {?|undefined} */
    StoreRouterConfig.prototype.serializer;
    /**
     * By default, ROUTER_NAVIGATION is dispatched before guards and resolvers run.
     * Therefore, the action could run too soon, for example
     * there may be a navigation cancel due to a guard saying the navigation is not allowed.
     * To run ROUTER_NAVIGATION after guards and resolvers,
     * set this property to NavigationActionTiming.PostActivation.
     * @type {?|undefined}
     */
    StoreRouterConfig.prototype.navigationActionTiming;
    /**
     * Decides which router serializer should be used, if there is none provided, and the metadata on the dispatched \@ngrx/router-store action payload.
     * Set to `Full` to use the `DefaultRouterStateSerializer` and to set the angular router events as payload.
     * Set to `Minimal` to use the `MinimalRouterStateSerializer` and to set a minimal router event with the navigation id and url as payload.
     * @type {?|undefined}
     */
    StoreRouterConfig.prototype.routerState;
}
/**
 * @record
 */
function StoreRouterActionPayload() { }
if (false) {
    /** @type {?} */
    StoreRouterActionPayload.prototype.event;
    /** @type {?|undefined} */
    StoreRouterActionPayload.prototype.routerState;
    /** @type {?|undefined} */
    StoreRouterActionPayload.prototype.storeState;
}
/** @enum {number} */
const NavigationActionTiming = {
    PreActivation: 1,
    PostActivation: 2,
};
export { NavigationActionTiming };
NavigationActionTiming[NavigationActionTiming.PreActivation] = 'PreActivation';
NavigationActionTiming[NavigationActionTiming.PostActivation] = 'PostActivation';
/** @type {?} */
export const _ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Internal Configuration');
/** @type {?} */
export const ROUTER_CONFIG = new InjectionToken('@ngrx/router-store Configuration');
/** @type {?} */
export const DEFAULT_ROUTER_FEATURENAME = 'router';
/**
 * @param {?} config
 * @return {?}
 */
export function _createRouterConfig(config) {
    return Object.assign({ stateKey: DEFAULT_ROUTER_FEATURENAME, serializer: DefaultRouterStateSerializer, navigationActionTiming: NavigationActionTiming.PreActivation }, config);
}
/** @enum {number} */
const RouterTrigger = {
    NONE: 1,
    ROUTER: 2,
    STORE: 3,
};
RouterTrigger[RouterTrigger.NONE] = 'NONE';
RouterTrigger[RouterTrigger.ROUTER] = 'ROUTER';
RouterTrigger[RouterTrigger.STORE] = 'STORE';
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
 * \@NgModule({
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
export class StoreRouterConnectingModule {
    /**
     * @param {?} store
     * @param {?} router
     * @param {?} serializer
     * @param {?} errorHandler
     * @param {?} config
     */
    constructor(store, router, serializer, errorHandler, config) {
        this.store = store;
        this.router = router;
        this.serializer = serializer;
        this.errorHandler = errorHandler;
        this.config = config;
        this.lastEvent = null;
        this.trigger = RouterTrigger.NONE;
        this.stateKey = (/** @type {?} */ (this.config.stateKey));
        this.setUpStoreStateListener();
        this.setUpRouterEventsListener();
    }
    /**
     * @template T
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: StoreRouterConnectingModule,
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
    }
    /**
     * @private
     * @return {?}
     */
    setUpStoreStateListener() {
        this.store
            .pipe(select((/** @type {?} */ (this.stateKey))), withLatestFrom(this.store))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ([routerStoreState, storeState]) => {
            this.navigateIfNeeded(routerStoreState, storeState);
        }));
    }
    /**
     * @private
     * @param {?} routerStoreState
     * @param {?} storeState
     * @return {?}
     */
    navigateIfNeeded(routerStoreState, storeState) {
        if (!routerStoreState || !routerStoreState.state) {
            return;
        }
        if (this.trigger === RouterTrigger.ROUTER) {
            return;
        }
        if (this.lastEvent instanceof NavigationStart) {
            return;
        }
        /** @type {?} */
        const url = routerStoreState.state.url;
        if (this.router.url !== url) {
            this.storeState = storeState;
            this.trigger = RouterTrigger.STORE;
            this.router.navigateByUrl(url).catch((/**
             * @param {?} error
             * @return {?}
             */
            error => {
                this.errorHandler.handleError(error);
            }));
        }
    }
    /**
     * @private
     * @return {?}
     */
    setUpRouterEventsListener() {
        /** @type {?} */
        const dispatchNavLate = this.config.navigationActionTiming ===
            NavigationActionTiming.PostActivation;
        /** @type {?} */
        let routesRecognized;
        this.router.events
            .pipe(withLatestFrom(this.store))
            .subscribe((/**
         * @param {?} __0
         * @return {?}
         */
        ([event, storeState]) => {
            this.lastEvent = event;
            if (event instanceof NavigationStart) {
                this.routerState = this.serializer.serialize(this.router.routerState.snapshot);
                if (this.trigger !== RouterTrigger.STORE) {
                    this.storeState = storeState;
                    this.dispatchRouterRequest(event);
                }
            }
            else if (event instanceof RoutesRecognized) {
                routesRecognized = event;
                if (!dispatchNavLate && this.trigger !== RouterTrigger.STORE) {
                    this.dispatchRouterNavigation(event);
                }
            }
            else if (event instanceof NavigationCancel) {
                this.dispatchRouterCancel(event);
                this.reset();
            }
            else if (event instanceof NavigationError) {
                this.dispatchRouterError(event);
                this.reset();
            }
            else if (event instanceof NavigationEnd) {
                if (this.trigger !== RouterTrigger.STORE) {
                    if (dispatchNavLate) {
                        this.dispatchRouterNavigation(routesRecognized);
                    }
                    this.dispatchRouterNavigated(event);
                }
                this.reset();
            }
        }));
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterRequest(event) {
        this.dispatchRouterAction(ROUTER_REQUEST, { event });
    }
    /**
     * @private
     * @param {?} lastRoutesRecognized
     * @return {?}
     */
    dispatchRouterNavigation(lastRoutesRecognized) {
        /** @type {?} */
        const nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
        this.dispatchRouterAction(ROUTER_NAVIGATION, {
            routerState: nextRouterState,
            event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState),
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterCancel(event) {
        this.dispatchRouterAction(ROUTER_CANCEL, {
            storeState: this.storeState,
            event,
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterError(event) {
        this.dispatchRouterAction(ROUTER_ERROR, {
            storeState: this.storeState,
            event: new NavigationError(event.id, event.url, `${event}`),
        });
    }
    /**
     * @private
     * @param {?} event
     * @return {?}
     */
    dispatchRouterNavigated(event) {
        /** @type {?} */
        const routerState = this.serializer.serialize(this.router.routerState.snapshot);
        this.dispatchRouterAction(ROUTER_NAVIGATED, { event, routerState });
    }
    /**
     * @private
     * @param {?} type
     * @param {?} payload
     * @return {?}
     */
    dispatchRouterAction(type, payload) {
        this.trigger = RouterTrigger.ROUTER;
        try {
            this.store.dispatch({
                type,
                payload: Object.assign({ routerState: this.routerState }, payload, { event: this.config.routerState === 1 /* Minimal */
                        ? { id: payload.event.id, url: payload.event.url }
                        : payload.event }),
            });
        }
        finally {
            this.trigger = RouterTrigger.NONE;
        }
    }
    /**
     * @private
     * @return {?}
     */
    reset() {
        this.trigger = RouterTrigger.NONE;
        this.storeState = null;
        this.routerState = null;
    }
}
StoreRouterConnectingModule.decorators = [
    { type: NgModule, args: [{},] }
];
/** @nocollapse */
StoreRouterConnectingModule.ctorParameters = () => [
    { type: Store },
    { type: Router },
    { type: RouterStateSerializer },
    { type: ErrorHandler },
    { type: undefined, decorators: [{ type: Inject, args: [ROUTER_CONFIG,] }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.lastEvent;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.routerState;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.storeState;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.trigger;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.stateKey;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.store;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.router;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.serializer;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.errorHandler;
    /**
     * @type {?}
     * @private
     */
    StoreRouterConnectingModule.prototype.config;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3N0b3JlX21vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yb3V0ZXJfc3RvcmVfbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsTUFBTSxFQUNOLGNBQWMsRUFFZCxRQUFRLEVBQ1IsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxnQkFBZ0IsRUFDaEIsZUFBZSxFQUNmLGFBQWEsRUFDYixNQUFNLEVBQ04sZ0JBQWdCLEVBQ2hCLGVBQWUsR0FHaEIsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsTUFBTSxFQUFZLEtBQUssRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN0RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFaEQsT0FBTyxFQUNMLGFBQWEsRUFDYixZQUFZLEVBQ1osZ0JBQWdCLEVBQ2hCLGlCQUFpQixFQUNqQixjQUFjLEdBQ2YsTUFBTSxXQUFXLENBQUM7QUFFbkIsT0FBTyxFQUNMLHFCQUFxQixHQUV0QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsR0FFN0IsTUFBTSxrQ0FBa0MsQ0FBQztBQUMxQyxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0lBVzlFLE9BQUk7SUFDSixVQUFPOzs7Ozs7O0FBR1QsdUNBbUJDOzs7SUFoQkMscUNBQWlDOztJQUNqQyx1Q0FBMkQ7Ozs7Ozs7OztJQVEzRCxtREFBZ0Q7Ozs7Ozs7SUFNaEQsd0NBQTBCOzs7OztBQUc1Qix1Q0FJQzs7O0lBSEMseUNBQW1COztJQUNuQiwrQ0FBNEM7O0lBQzVDLDhDQUFpQjs7OztJQUlqQixnQkFBaUI7SUFDakIsaUJBQWtCOzs7Ozs7QUFHcEIsTUFBTSxPQUFPLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDOUMsMkNBQTJDLENBQzVDOztBQUNELE1BQU0sT0FBTyxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQzdDLGtDQUFrQyxDQUNuQzs7QUFDRCxNQUFNLE9BQU8sMEJBQTBCLEdBQUcsUUFBUTs7Ozs7QUFFbEQsTUFBTSxVQUFVLG1CQUFtQixDQUNqQyxNQUF5QjtJQUV6Qix1QkFDRSxRQUFRLEVBQUUsMEJBQTBCLEVBQ3BDLFVBQVUsRUFBRSw0QkFBNEIsRUFDeEMsc0JBQXNCLEVBQUUsc0JBQXNCLENBQUMsYUFBYSxJQUN6RCxNQUFNLEVBQ1Q7QUFDSixDQUFDOzs7SUFHQyxPQUFRO0lBQ1IsU0FBVTtJQUNWLFFBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBOENYLE1BQU0sT0FBTywyQkFBMkI7Ozs7Ozs7O0lBa0N0QyxZQUNVLEtBQWlCLEVBQ2pCLE1BQWMsRUFDZCxVQUFnRSxFQUNoRSxZQUEwQixFQUNILE1BQXlCO1FBSmhELFVBQUssR0FBTCxLQUFLLENBQVk7UUFDakIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGVBQVUsR0FBVixVQUFVLENBQXNEO1FBQ2hFLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQ0gsV0FBTSxHQUFOLE1BQU0sQ0FBbUI7UUFabEQsY0FBUyxHQUFpQixJQUFJLENBQUM7UUFHL0IsWUFBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFXbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBc0IsQ0FBQztRQUUzRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztJQUNuQyxDQUFDOzs7Ozs7SUE1Q0QsTUFBTSxDQUFDLE9BQU8sQ0FHWixTQUErQixFQUFFO1FBRWpDLE9BQU87WUFDTCxRQUFRLEVBQUUsMkJBQTJCO1lBQ3JDLFNBQVMsRUFBRTtnQkFDVCxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtnQkFDN0M7b0JBQ0UsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFVBQVUsRUFBRSxtQkFBbUI7b0JBQy9CLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQztpQkFDdkI7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLHFCQUFxQjtvQkFDOUIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxVQUFVO3dCQUN6QixDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVU7d0JBQ25CLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxvQkFBd0I7NEJBQzFDLENBQUMsQ0FBQyw0QkFBNEI7NEJBQzlCLENBQUMsQ0FBQyw0QkFBNEI7aUJBQ25DO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7Ozs7SUFzQk8sdUJBQXVCO1FBQzdCLElBQUksQ0FBQyxLQUFLO2FBQ1AsSUFBSSxDQUNILE1BQU0sQ0FBQyxtQkFBQSxJQUFJLENBQUMsUUFBUSxFQUFPLENBQUMsRUFDNUIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FDM0I7YUFDQSxTQUFTOzs7O1FBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7OztJQUVPLGdCQUFnQixDQUN0QixnQkFBb0MsRUFDcEMsVUFBZTtRQUVmLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRTtZQUNoRCxPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUN6QyxPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLFlBQVksZUFBZSxFQUFFO1lBQzdDLE9BQU87U0FDUjs7Y0FFSyxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLEdBQUc7UUFDdEMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxHQUFHLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUs7Ozs7WUFBQyxLQUFLLENBQUMsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdkMsQ0FBQyxFQUFDLENBQUM7U0FDSjtJQUNILENBQUM7Ozs7O0lBRU8seUJBQXlCOztjQUN6QixlQUFlLEdBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCO1lBQ2xDLHNCQUFzQixDQUFDLGNBQWM7O1lBQ25DLGdCQUFrQztRQUV0QyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU07YUFDZixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoQyxTQUFTOzs7O1FBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBRXZCLElBQUksS0FBSyxZQUFZLGVBQWUsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUNqQyxDQUFDO2dCQUNGLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUMsS0FBSyxFQUFFO29CQUN4QyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztvQkFDN0IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNuQzthQUNGO2lCQUFNLElBQUksS0FBSyxZQUFZLGdCQUFnQixFQUFFO2dCQUM1QyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7Z0JBRXpCLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUMsS0FBSyxFQUFFO29CQUM1RCxJQUFJLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3RDO2FBQ0Y7aUJBQU0sSUFBSSxLQUFLLFlBQVksZ0JBQWdCLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7aUJBQU0sSUFBSSxLQUFLLFlBQVksZUFBZSxFQUFFO2dCQUMzQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO2lCQUFNLElBQUksS0FBSyxZQUFZLGFBQWEsRUFBRTtnQkFDekMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLGFBQWEsQ0FBQyxLQUFLLEVBQUU7b0JBQ3hDLElBQUksZUFBZSxFQUFFO3dCQUNuQixJQUFJLENBQUMsd0JBQXdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztxQkFDakQ7b0JBQ0QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNyQztnQkFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDZDtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ1AsQ0FBQzs7Ozs7O0lBRU8scUJBQXFCLENBQUMsS0FBc0I7UUFDbEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGNBQWMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdkQsQ0FBQzs7Ozs7O0lBRU8sd0JBQXdCLENBQzlCLG9CQUFzQzs7Y0FFaEMsZUFBZSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUMvQyxvQkFBb0IsQ0FBQyxLQUFLLENBQzNCO1FBQ0QsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGlCQUFpQixFQUFFO1lBQzNDLFdBQVcsRUFBRSxlQUFlO1lBQzVCLEtBQUssRUFBRSxJQUFJLGdCQUFnQixDQUN6QixvQkFBb0IsQ0FBQyxFQUFFLEVBQ3ZCLG9CQUFvQixDQUFDLEdBQUcsRUFDeEIsb0JBQW9CLENBQUMsaUJBQWlCLEVBQ3RDLGVBQWUsQ0FDaEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDOzs7Ozs7SUFFTyxvQkFBb0IsQ0FBQyxLQUF1QjtRQUNsRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsYUFBYSxFQUFFO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixLQUFLO1NBQ04sQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7O0lBRU8sbUJBQW1CLENBQUMsS0FBc0I7UUFDaEQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFlBQVksRUFBRTtZQUN0QyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDM0IsS0FBSyxFQUFFLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDO1NBQzVELENBQUMsQ0FBQztJQUNMLENBQUM7Ozs7OztJQUVPLHVCQUF1QixDQUFDLEtBQW9COztjQUM1QyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FDakM7UUFDRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsZ0JBQWdCLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN0RSxDQUFDOzs7Ozs7O0lBRU8sb0JBQW9CLENBQzFCLElBQVksRUFDWixPQUFpQztRQUVqQyxJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDcEMsSUFBSTtZQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO2dCQUNsQixJQUFJO2dCQUNKLE9BQU8sa0JBQ0wsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLElBQzFCLE9BQU8sSUFDVixLQUFLLEVBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLG9CQUF3Qjt3QkFDN0MsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTt3QkFDbEQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQ3BCO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7Z0JBQVM7WUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7U0FDbkM7SUFDSCxDQUFDOzs7OztJQUVPLEtBQUs7UUFDWCxJQUFJLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQzs7O1lBbE1GLFFBQVEsU0FBQyxFQUFFOzs7O1lBckllLEtBQUs7WUFOOUIsTUFBTTtZQWtCTixxQkFBcUI7WUF4QnJCLFlBQVk7NENBeUxULE1BQU0sU0FBQyxhQUFhOzs7Ozs7O0lBWnZCLGdEQUF1Qzs7Ozs7SUFDdkMsa0RBQTBEOzs7OztJQUMxRCxpREFBd0I7Ozs7O0lBQ3hCLDhDQUFxQzs7Ozs7SUFFckMsK0NBQXFDOzs7OztJQUduQyw0Q0FBeUI7Ozs7O0lBQ3pCLDZDQUFzQjs7Ozs7SUFDdEIsaURBQXdFOzs7OztJQUN4RSxtREFBa0M7Ozs7O0lBQ2xDLDZDQUF3RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIE1vZHVsZVdpdGhQcm92aWRlcnMsXG4gIE5nTW9kdWxlLFxuICBFcnJvckhhbmRsZXIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTmF2aWdhdGlvbkNhbmNlbCxcbiAgTmF2aWdhdGlvbkVycm9yLFxuICBOYXZpZ2F0aW9uRW5kLFxuICBSb3V0ZXIsXG4gIFJvdXRlc1JlY29nbml6ZWQsXG4gIE5hdmlnYXRpb25TdGFydCxcbiAgRXZlbnQsXG4gIFJvdXRlckV2ZW50LFxufSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgc2VsZWN0LCBTZWxlY3RvciwgU3RvcmUgfSBmcm9tICdAbmdyeC9zdG9yZSc7XG5pbXBvcnQgeyB3aXRoTGF0ZXN0RnJvbSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVEVELFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUk9VVEVSX1JFUVVFU1QsXG59IGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgeyBSb3V0ZXJSZWR1Y2VyU3RhdGUgfSBmcm9tICcuL3JlZHVjZXInO1xuaW1wb3J0IHtcbiAgUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICBCYXNlUm91dGVyU3RvcmVTdGF0ZSxcbn0gZnJvbSAnLi9zZXJpYWxpemVycy9iYXNlJztcbmltcG9ydCB7XG4gIERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXIsXG4gIFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90LFxufSBmcm9tICcuL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplcic7XG5pbXBvcnQgeyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9zZXJpYWxpemVycy9taW5pbWFsX3NlcmlhbGl6ZXInO1xuXG5leHBvcnQgdHlwZSBTdGF0ZUtleU9yU2VsZWN0b3I8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+ID0gc3RyaW5nIHwgU2VsZWN0b3I8YW55LCBSb3V0ZXJSZWR1Y2VyU3RhdGU8VD4+O1xuXG4vKipcbiAqIEZ1bGwgPSBTZXJpYWxpemVzIHRoZSByb3V0ZXIgZXZlbnQgd2l0aCBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyXG4gKiBNaW5pbWFsID0gU2VyaWFsaXplcyB0aGUgcm91dGVyIGV2ZW50IHdpdGggTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICovXG5leHBvcnQgY29uc3QgZW51bSBSb3V0ZXJTdGF0ZSB7XG4gIEZ1bGwsXG4gIE1pbmltYWwsXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RvcmVSb3V0ZXJDb25maWc8XG4gIFQgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSA9IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90XG4+IHtcbiAgc3RhdGVLZXk/OiBTdGF0ZUtleU9yU2VsZWN0b3I8VD47XG4gIHNlcmlhbGl6ZXI/OiBuZXcgKC4uLmFyZ3M6IGFueVtdKSA9PiBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI7XG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0LCBST1VURVJfTkFWSUdBVElPTiBpcyBkaXNwYXRjaGVkIGJlZm9yZSBndWFyZHMgYW5kIHJlc29sdmVycyBydW4uXG4gICAqIFRoZXJlZm9yZSwgdGhlIGFjdGlvbiBjb3VsZCBydW4gdG9vIHNvb24sIGZvciBleGFtcGxlXG4gICAqIHRoZXJlIG1heSBiZSBhIG5hdmlnYXRpb24gY2FuY2VsIGR1ZSB0byBhIGd1YXJkIHNheWluZyB0aGUgbmF2aWdhdGlvbiBpcyBub3QgYWxsb3dlZC5cbiAgICogVG8gcnVuIFJPVVRFUl9OQVZJR0FUSU9OIGFmdGVyIGd1YXJkcyBhbmQgcmVzb2x2ZXJzLFxuICAgKiBzZXQgdGhpcyBwcm9wZXJ0eSB0byBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlBvc3RBY3RpdmF0aW9uLlxuICAgKi9cbiAgbmF2aWdhdGlvbkFjdGlvblRpbWluZz86IE5hdmlnYXRpb25BY3Rpb25UaW1pbmc7XG4gIC8qKlxuICAgKiBEZWNpZGVzIHdoaWNoIHJvdXRlciBzZXJpYWxpemVyIHNob3VsZCBiZSB1c2VkLCBpZiB0aGVyZSBpcyBub25lIHByb3ZpZGVkLCBhbmQgdGhlIG1ldGFkYXRhIG9uIHRoZSBkaXNwYXRjaGVkIEBuZ3J4L3JvdXRlci1zdG9yZSBhY3Rpb24gcGF5bG9hZC5cbiAgICogU2V0IHRvIGBGdWxsYCB0byB1c2UgdGhlIGBEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyYCBhbmQgdG8gc2V0IHRoZSBhbmd1bGFyIHJvdXRlciBldmVudHMgYXMgcGF5bG9hZC5cbiAgICogU2V0IHRvIGBNaW5pbWFsYCB0byB1c2UgdGhlIGBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyYCBhbmQgdG8gc2V0IGEgbWluaW1hbCByb3V0ZXIgZXZlbnQgd2l0aCB0aGUgbmF2aWdhdGlvbiBpZCBhbmQgdXJsIGFzIHBheWxvYWQuXG4gICAqL1xuICByb3V0ZXJTdGF0ZT86IFJvdXRlclN0YXRlO1xufVxuXG5pbnRlcmZhY2UgU3RvcmVSb3V0ZXJBY3Rpb25QYXlsb2FkIHtcbiAgZXZlbnQ6IFJvdXRlckV2ZW50O1xuICByb3V0ZXJTdGF0ZT86IFNlcmlhbGl6ZWRSb3V0ZXJTdGF0ZVNuYXBzaG90O1xuICBzdG9yZVN0YXRlPzogYW55O1xufVxuXG5leHBvcnQgZW51bSBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nIHtcbiAgUHJlQWN0aXZhdGlvbiA9IDEsXG4gIFBvc3RBY3RpdmF0aW9uID0gMixcbn1cblxuZXhwb3J0IGNvbnN0IF9ST1VURVJfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuKFxuICAnQG5ncngvcm91dGVyLXN0b3JlIEludGVybmFsIENvbmZpZ3VyYXRpb24nXG4pO1xuZXhwb3J0IGNvbnN0IFJPVVRFUl9DT05GSUcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oXG4gICdAbmdyeC9yb3V0ZXItc3RvcmUgQ29uZmlndXJhdGlvbidcbik7XG5leHBvcnQgY29uc3QgREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUgPSAncm91dGVyJztcblxuZXhwb3J0IGZ1bmN0aW9uIF9jcmVhdGVSb3V0ZXJDb25maWcoXG4gIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWdcbik6IFN0b3JlUm91dGVyQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBzdGF0ZUtleTogREVGQVVMVF9ST1VURVJfRkVBVFVSRU5BTUUsXG4gICAgc2VyaWFsaXplcjogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICBuYXZpZ2F0aW9uQWN0aW9uVGltaW5nOiBOYXZpZ2F0aW9uQWN0aW9uVGltaW5nLlByZUFjdGl2YXRpb24sXG4gICAgLi4uY29uZmlnLFxuICB9O1xufVxuXG5lbnVtIFJvdXRlclRyaWdnZXIge1xuICBOT05FID0gMSxcbiAgUk9VVEVSID0gMixcbiAgU1RPUkUgPSAzLFxufVxuXG4vKipcbiAqIENvbm5lY3RzIFJvdXRlck1vZHVsZSB3aXRoIFN0b3JlTW9kdWxlLlxuICpcbiAqIER1cmluZyB0aGUgbmF2aWdhdGlvbiwgYmVmb3JlIGFueSBndWFyZHMgb3IgcmVzb2x2ZXJzIHJ1biwgdGhlIHJvdXRlciB3aWxsIGRpc3BhdGNoXG4gKiBhIFJPVVRFUl9OQVZJR0FUSU9OIGFjdGlvbiwgd2hpY2ggaGFzIHRoZSBmb2xsb3dpbmcgc2lnbmF0dXJlOlxuICpcbiAqIGBgYFxuICogZXhwb3J0IHR5cGUgUm91dGVyTmF2aWdhdGlvblBheWxvYWQgPSB7XG4gKiAgIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCxcbiAqICAgZXZlbnQ6IFJvdXRlc1JlY29nbml6ZWRcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEVpdGhlciBhIHJlZHVjZXIgb3IgYW4gZWZmZWN0IGNhbiBiZSBpbnZva2VkIGluIHJlc3BvbnNlIHRvIHRoaXMgYWN0aW9uLlxuICogSWYgdGhlIGludm9rZWQgcmVkdWNlciB0aHJvd3MsIHRoZSBuYXZpZ2F0aW9uIHdpbGwgYmUgY2FuY2VsZWQuXG4gKlxuICogSWYgbmF2aWdhdGlvbiBnZXRzIGNhbmNlbGVkIGJlY2F1c2Ugb2YgYSBndWFyZCwgYSBST1VURVJfQ0FOQ0VMIGFjdGlvbiB3aWxsIGJlXG4gKiBkaXNwYXRjaGVkLiBJZiBuYXZpZ2F0aW9uIHJlc3VsdHMgaW4gYW4gZXJyb3IsIGEgUk9VVEVSX0VSUk9SIGFjdGlvbiB3aWxsIGJlIGRpc3BhdGNoZWQuXG4gKlxuICogQm90aCBST1VURVJfQ0FOQ0VMIGFuZCBST1VURVJfRVJST1IgY29udGFpbiB0aGUgc3RvcmUgc3RhdGUgYmVmb3JlIHRoZSBuYXZpZ2F0aW9uXG4gKiB3aGljaCBjYW4gYmUgdXNlZCB0byByZXN0b3JlIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgc3RvcmUuXG4gKlxuICogVXNhZ2U6XG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQE5nTW9kdWxlKHtcbiAqICAgZGVjbGFyYXRpb25zOiBbQXBwQ21wLCBTaW1wbGVDbXBdLFxuICogICBpbXBvcnRzOiBbXG4gKiAgICAgQnJvd3Nlck1vZHVsZSxcbiAqICAgICBTdG9yZU1vZHVsZS5mb3JSb290KG1hcE9mUmVkdWNlcnMpLFxuICogICAgIFJvdXRlck1vZHVsZS5mb3JSb290KFtcbiAqICAgICAgIHsgcGF0aDogJycsIGNvbXBvbmVudDogU2ltcGxlQ21wIH0sXG4gKiAgICAgICB7IHBhdGg6ICduZXh0JywgY29tcG9uZW50OiBTaW1wbGVDbXAgfVxuICogICAgIF0pLFxuICogICAgIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZS5mb3JSb290KClcbiAqICAgXSxcbiAqICAgYm9vdHN0cmFwOiBbQXBwQ21wXVxuICogfSlcbiAqIGV4cG9ydCBjbGFzcyBBcHBNb2R1bGUge1xuICogfVxuICogYGBgXG4gKi9cbkBOZ01vZHVsZSh7fSlcbmV4cG9ydCBjbGFzcyBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdDxcbiAgICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuICA+KFxuICAgIGNvbmZpZzogU3RvcmVSb3V0ZXJDb25maWc8VD4gPSB7fVxuICApOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHsgcHJvdmlkZTogX1JPVVRFUl9DT05GSUcsIHVzZVZhbHVlOiBjb25maWcgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IFJPVVRFUl9DT05GSUcsXG4gICAgICAgICAgdXNlRmFjdG9yeTogX2NyZWF0ZVJvdXRlckNvbmZpZyxcbiAgICAgICAgICBkZXBzOiBbX1JPVVRFUl9DT05GSUddLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogUm91dGVyU3RhdGVTZXJpYWxpemVyLFxuICAgICAgICAgIHVzZUNsYXNzOiBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgPyBjb25maWcuc2VyaWFsaXplclxuICAgICAgICAgICAgOiBjb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLk1pbmltYWxcbiAgICAgICAgICAgICAgPyBNaW5pbWFsUm91dGVyU3RhdGVTZXJpYWxpemVyXG4gICAgICAgICAgICAgIDogRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplcixcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgbGFzdEV2ZW50OiBFdmVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHJvdXRlclN0YXRlOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB8IG51bGw7XG4gIHByaXZhdGUgc3RvcmVTdGF0ZTogYW55O1xuICBwcml2YXRlIHRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLk5PTkU7XG5cbiAgcHJpdmF0ZSBzdGF0ZUtleTogU3RhdGVLZXlPclNlbGVjdG9yO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPGFueT4sXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHNlcmlhbGl6ZXI6IFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4sXG4gICAgcHJpdmF0ZSBlcnJvckhhbmRsZXI6IEVycm9ySGFuZGxlcixcbiAgICBASW5qZWN0KFJPVVRFUl9DT05GSUcpIHByaXZhdGUgY29uZmlnOiBTdG9yZVJvdXRlckNvbmZpZ1xuICApIHtcbiAgICB0aGlzLnN0YXRlS2V5ID0gdGhpcy5jb25maWcuc3RhdGVLZXkgYXMgU3RhdGVLZXlPclNlbGVjdG9yO1xuXG4gICAgdGhpcy5zZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpO1xuICAgIHRoaXMuc2V0VXBSb3V0ZXJFdmVudHNMaXN0ZW5lcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFN0b3JlU3RhdGVMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3JlXG4gICAgICAucGlwZShcbiAgICAgICAgc2VsZWN0KHRoaXMuc3RhdGVLZXkgYXMgYW55KSxcbiAgICAgICAgd2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKFtyb3V0ZXJTdG9yZVN0YXRlLCBzdG9yZVN0YXRlXSkgPT4ge1xuICAgICAgICB0aGlzLm5hdmlnYXRlSWZOZWVkZWQocm91dGVyU3RvcmVTdGF0ZSwgc3RvcmVTdGF0ZSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgbmF2aWdhdGVJZk5lZWRlZChcbiAgICByb3V0ZXJTdG9yZVN0YXRlOiBSb3V0ZXJSZWR1Y2VyU3RhdGUsXG4gICAgc3RvcmVTdGF0ZTogYW55XG4gICk6IHZvaWQge1xuICAgIGlmICghcm91dGVyU3RvcmVTdGF0ZSB8fCAhcm91dGVyU3RvcmVTdGF0ZS5zdGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy50cmlnZ2VyID09PSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5sYXN0RXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1cmwgPSByb3V0ZXJTdG9yZVN0YXRlLnN0YXRlLnVybDtcbiAgICBpZiAodGhpcy5yb3V0ZXIudXJsICE9PSB1cmwpIHtcbiAgICAgIHRoaXMuc3RvcmVTdGF0ZSA9IHN0b3JlU3RhdGU7XG4gICAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlNUT1JFO1xuICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGVCeVVybCh1cmwpLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgdGhpcy5lcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRVcFJvdXRlckV2ZW50c0xpc3RlbmVyKCk6IHZvaWQge1xuICAgIGNvbnN0IGRpc3BhdGNoTmF2TGF0ZSA9XG4gICAgICB0aGlzLmNvbmZpZy5uYXZpZ2F0aW9uQWN0aW9uVGltaW5nID09PVxuICAgICAgTmF2aWdhdGlvbkFjdGlvblRpbWluZy5Qb3N0QWN0aXZhdGlvbjtcbiAgICBsZXQgcm91dGVzUmVjb2duaXplZDogUm91dGVzUmVjb2duaXplZDtcblxuICAgIHRoaXMucm91dGVyLmV2ZW50c1xuICAgICAgLnBpcGUod2l0aExhdGVzdEZyb20odGhpcy5zdG9yZSkpXG4gICAgICAuc3Vic2NyaWJlKChbZXZlbnQsIHN0b3JlU3RhdGVdKSA9PiB7XG4gICAgICAgIHRoaXMubGFzdEV2ZW50ID0gZXZlbnQ7XG5cbiAgICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvblN0YXJ0KSB7XG4gICAgICAgICAgdGhpcy5yb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICAgICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJpZ2dlciAhPT0gUm91dGVyVHJpZ2dlci5TVE9SRSkge1xuICAgICAgICAgICAgdGhpcy5zdG9yZVN0YXRlID0gc3RvcmVTdGF0ZTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgaW5zdGFuY2VvZiBSb3V0ZXNSZWNvZ25pemVkKSB7XG4gICAgICAgICAgcm91dGVzUmVjb2duaXplZCA9IGV2ZW50O1xuXG4gICAgICAgICAgaWYgKCFkaXNwYXRjaE5hdkxhdGUgJiYgdGhpcy50cmlnZ2VyICE9PSBSb3V0ZXJUcmlnZ2VyLlNUT1JFKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGlvbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkNhbmNlbCkge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJDYW5jZWwoZXZlbnQpO1xuICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJFcnJvcihldmVudCk7XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkge1xuICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXIgIT09IFJvdXRlclRyaWdnZXIuU1RPUkUpIHtcbiAgICAgICAgICAgIGlmIChkaXNwYXRjaE5hdkxhdGUpIHtcbiAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJvdXRlck5hdmlnYXRpb24ocm91dGVzUmVjb2duaXplZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUm91dGVyTmF2aWdhdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJSZXF1ZXN0KGV2ZW50OiBOYXZpZ2F0aW9uU3RhcnQpOiB2b2lkIHtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9SRVFVRVNULCB7IGV2ZW50IH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlck5hdmlnYXRpb24oXG4gICAgbGFzdFJvdXRlc1JlY29nbml6ZWQ6IFJvdXRlc1JlY29nbml6ZWRcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dFJvdXRlclN0YXRlID0gdGhpcy5zZXJpYWxpemVyLnNlcmlhbGl6ZShcbiAgICAgIGxhc3RSb3V0ZXNSZWNvZ25pemVkLnN0YXRlXG4gICAgKTtcbiAgICB0aGlzLmRpc3BhdGNoUm91dGVyQWN0aW9uKFJPVVRFUl9OQVZJR0FUSU9OLCB7XG4gICAgICByb3V0ZXJTdGF0ZTogbmV4dFJvdXRlclN0YXRlLFxuICAgICAgZXZlbnQ6IG5ldyBSb3V0ZXNSZWNvZ25pemVkKFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC5pZCxcbiAgICAgICAgbGFzdFJvdXRlc1JlY29nbml6ZWQudXJsLFxuICAgICAgICBsYXN0Um91dGVzUmVjb2duaXplZC51cmxBZnRlclJlZGlyZWN0cyxcbiAgICAgICAgbmV4dFJvdXRlclN0YXRlXG4gICAgICApLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBkaXNwYXRjaFJvdXRlckNhbmNlbChldmVudDogTmF2aWdhdGlvbkNhbmNlbCk6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0NBTkNFTCwge1xuICAgICAgc3RvcmVTdGF0ZTogdGhpcy5zdG9yZVN0YXRlLFxuICAgICAgZXZlbnQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3BhdGNoUm91dGVyRXJyb3IoZXZlbnQ6IE5hdmlnYXRpb25FcnJvcik6IHZvaWQge1xuICAgIHRoaXMuZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oUk9VVEVSX0VSUk9SLCB7XG4gICAgICBzdG9yZVN0YXRlOiB0aGlzLnN0b3JlU3RhdGUsXG4gICAgICBldmVudDogbmV3IE5hdmlnYXRpb25FcnJvcihldmVudC5pZCwgZXZlbnQudXJsLCBgJHtldmVudH1gKSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJOYXZpZ2F0ZWQoZXZlbnQ6IE5hdmlnYXRpb25FbmQpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZXJTdGF0ZSA9IHRoaXMuc2VyaWFsaXplci5zZXJpYWxpemUoXG4gICAgICB0aGlzLnJvdXRlci5yb3V0ZXJTdGF0ZS5zbmFwc2hvdFxuICAgICk7XG4gICAgdGhpcy5kaXNwYXRjaFJvdXRlckFjdGlvbihST1VURVJfTkFWSUdBVEVELCB7IGV2ZW50LCByb3V0ZXJTdGF0ZSB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcGF0Y2hSb3V0ZXJBY3Rpb24oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHBheWxvYWQ6IFN0b3JlUm91dGVyQWN0aW9uUGF5bG9hZFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnRyaWdnZXIgPSBSb3V0ZXJUcmlnZ2VyLlJPVVRFUjtcbiAgICB0cnkge1xuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICByb3V0ZXJTdGF0ZTogdGhpcy5yb3V0ZXJTdGF0ZSxcbiAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgIGV2ZW50OlxuICAgICAgICAgICAgdGhpcy5jb25maWcucm91dGVyU3RhdGUgPT09IFJvdXRlclN0YXRlLk1pbmltYWxcbiAgICAgICAgICAgICAgPyB7IGlkOiBwYXlsb2FkLmV2ZW50LmlkLCB1cmw6IHBheWxvYWQuZXZlbnQudXJsIH1cbiAgICAgICAgICAgICAgOiBwYXlsb2FkLmV2ZW50LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2V0KCkge1xuICAgIHRoaXMudHJpZ2dlciA9IFJvdXRlclRyaWdnZXIuTk9ORTtcbiAgICB0aGlzLnN0b3JlU3RhdGUgPSBudWxsO1xuICAgIHRoaXMucm91dGVyU3RhdGUgPSBudWxsO1xuICB9XG59XG4iXX0=