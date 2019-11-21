import { InjectionToken, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { Selector, Store } from '@ngrx/store';
import { RouterReducerState } from './reducer';
import { RouterStateSerializer, BaseRouterStoreState } from './serializers/base';
import { SerializedRouterStateSnapshot } from './serializers/default_serializer';
export declare type StateKeyOrSelector<T extends BaseRouterStoreState = SerializedRouterStateSnapshot> = string | Selector<any, RouterReducerState<T>>;
/**
 * Full = Serializes the router event with DefaultRouterStateSerializer
 * Minimal = Serializes the router event with MinimalRouterStateSerializer
 */
export declare const enum RouterState {
    Full = 0,
    Minimal = 1
}
export interface StoreRouterConfig<T extends BaseRouterStoreState = SerializedRouterStateSnapshot> {
    stateKey?: StateKeyOrSelector<T>;
    serializer?: new (...args: any[]) => RouterStateSerializer;
    /**
     * By default, ROUTER_NAVIGATION is dispatched before guards and resolvers run.
     * Therefore, the action could run too soon, for example
     * there may be a navigation cancel due to a guard saying the navigation is not allowed.
     * To run ROUTER_NAVIGATION after guards and resolvers,
     * set this property to NavigationActionTiming.PostActivation.
     */
    navigationActionTiming?: NavigationActionTiming;
    /**
     * Decides which router serializer should be used, if there is none provided, and the metadata on the dispatched @ngrx/router-store action payload.
     * Set to `Full` to use the `DefaultRouterStateSerializer` and to set the angular router events as payload.
     * Set to `Minimal` to use the `MinimalRouterStateSerializer` and to set a minimal router event with the navigation id and url as payload.
     */
    routerState?: RouterState;
}
export declare enum NavigationActionTiming {
    PreActivation = 1,
    PostActivation = 2
}
export declare const _ROUTER_CONFIG: InjectionToken<{}>;
export declare const ROUTER_CONFIG: InjectionToken<{}>;
export declare const DEFAULT_ROUTER_FEATURENAME = "router";
export declare function _createRouterConfig(config: StoreRouterConfig): StoreRouterConfig;
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
export declare class StoreRouterConnectingModule {
    private store;
    private router;
    private serializer;
    private errorHandler;
    private config;
    static forRoot<T extends BaseRouterStoreState = SerializedRouterStateSnapshot>(config?: StoreRouterConfig<T>): ModuleWithProviders<StoreRouterConnectingModule>;
    private lastEvent;
    private routerState;
    private storeState;
    private trigger;
    private stateKey;
    constructor(store: Store<any>, router: Router, serializer: RouterStateSerializer<SerializedRouterStateSnapshot>, errorHandler: ErrorHandler, config: StoreRouterConfig);
    private setUpStoreStateListener;
    private navigateIfNeeded;
    private setUpRouterEventsListener;
    private dispatchRouterRequest;
    private dispatchRouterNavigation;
    private dispatchRouterCancel;
    private dispatchRouterError;
    private dispatchRouterNavigated;
    private dispatchRouterAction;
    private reset;
}
