/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function MinimalActivatedRouteSnapshot() { }
if (false) {
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.routeConfig;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.url;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.params;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.queryParams;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.fragment;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.data;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.outlet;
    /** @type {?|undefined} */
    MinimalActivatedRouteSnapshot.prototype.firstChild;
    /** @type {?} */
    MinimalActivatedRouteSnapshot.prototype.children;
}
/**
 * @record
 */
export function MinimalRouterStateSnapshot() { }
if (false) {
    /** @type {?} */
    MinimalRouterStateSnapshot.prototype.root;
    /** @type {?} */
    MinimalRouterStateSnapshot.prototype.url;
}
export class MinimalRouterStateSerializer {
    /**
     * @param {?} routerState
     * @return {?}
     */
    serialize(routerState) {
        return {
            root: this.serializeRoute(routerState.root),
            url: routerState.url,
        };
    }
    /**
     * @private
     * @param {?} route
     * @return {?}
     */
    serializeRoute(route) {
        /** @type {?} */
        const children = route.children.map((/**
         * @param {?} c
         * @return {?}
         */
        c => this.serializeRoute(c)));
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
            children,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1hbF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0EsbURBVUM7OztJQVRDLG9EQUFtRDs7SUFDbkQsNENBQW1DOztJQUNuQywrQ0FBeUM7O0lBQ3pDLG9EQUFtRDs7SUFDbkQsaURBQTZDOztJQUM3Qyw2Q0FBcUM7O0lBQ3JDLCtDQUF5Qzs7SUFDekMsbURBQTJDOztJQUMzQyxpREFBMEM7Ozs7O0FBRzVDLGdEQUdDOzs7SUFGQywwQ0FBb0M7O0lBQ3BDLHlDQUFZOztBQUdkLE1BQU0sT0FBTyw0QkFBNEI7Ozs7O0lBRXZDLFNBQVMsQ0FBQyxXQUFnQztRQUN4QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDckIsQ0FBQztJQUNKLENBQUM7Ozs7OztJQUVPLGNBQWMsQ0FDcEIsS0FBNkI7O2NBRXZCLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUM7UUFDaEUsT0FBTztZQUNMLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtZQUNwQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDNUIsQ0FBQyxDQUFDO29CQUNFLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUk7b0JBQzVCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ3RDLFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVU7b0JBQ3hDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU07aUJBQ2pDO2dCQUNILENBQUMsQ0FBQyxJQUFJO1lBQ1IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN2QixRQUFRO1NBQ1QsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlclN0YXRlU25hcHNob3QsIEFjdGl2YXRlZFJvdXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUsIFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Qge1xuICByb3V0ZUNvbmZpZzogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsncm91dGVDb25maWcnXTtcbiAgdXJsOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90Wyd1cmwnXTtcbiAgcGFyYW1zOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydwYXJhbXMnXTtcbiAgcXVlcnlQYXJhbXM6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3F1ZXJ5UGFyYW1zJ107XG4gIGZyYWdtZW50OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydmcmFnbWVudCddO1xuICBkYXRhOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydkYXRhJ107XG4gIG91dGxldDogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsnb3V0bGV0J107XG4gIGZpcnN0Q2hpbGQ/OiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdDtcbiAgY2hpbGRyZW46IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWluaW1hbFJvdXRlclN0YXRlU25hcHNob3QgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHJvb3Q6IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICB1cmw6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIE1pbmltYWxSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXJcbiAgaW1wbGVtZW50cyBSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXI8TWluaW1hbFJvdXRlclN0YXRlU25hcHNob3Q+IHtcbiAgc2VyaWFsaXplKHJvdXRlclN0YXRlOiBSb3V0ZXJTdGF0ZVNuYXBzaG90KTogTWluaW1hbFJvdXRlclN0YXRlU25hcHNob3Qge1xuICAgIHJldHVybiB7XG4gICAgICByb290OiB0aGlzLnNlcmlhbGl6ZVJvdXRlKHJvdXRlclN0YXRlLnJvb3QpLFxuICAgICAgdXJsOiByb3V0ZXJTdGF0ZS51cmwsXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgc2VyaWFsaXplUm91dGUoXG4gICAgcm91dGU6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RcbiAgKTogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Qge1xuICAgIGNvbnN0IGNoaWxkcmVuID0gcm91dGUuY2hpbGRyZW4ubWFwKGMgPT4gdGhpcy5zZXJpYWxpemVSb3V0ZShjKSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhcmFtczogcm91dGUucGFyYW1zLFxuICAgICAgZGF0YTogcm91dGUuZGF0YSxcbiAgICAgIHVybDogcm91dGUudXJsLFxuICAgICAgb3V0bGV0OiByb3V0ZS5vdXRsZXQsXG4gICAgICByb3V0ZUNvbmZpZzogcm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyB7XG4gICAgICAgICAgICBwYXRoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoLFxuICAgICAgICAgICAgcGF0aE1hdGNoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoTWF0Y2gsXG4gICAgICAgICAgICByZWRpcmVjdFRvOiByb3V0ZS5yb3V0ZUNvbmZpZy5yZWRpcmVjdFRvLFxuICAgICAgICAgICAgb3V0bGV0OiByb3V0ZS5yb3V0ZUNvbmZpZy5vdXRsZXQsXG4gICAgICAgICAgfVxuICAgICAgICA6IG51bGwsXG4gICAgICBxdWVyeVBhcmFtczogcm91dGUucXVlcnlQYXJhbXMsXG4gICAgICBmcmFnbWVudDogcm91dGUuZnJhZ21lbnQsXG4gICAgICBmaXJzdENoaWxkOiBjaGlsZHJlblswXSxcbiAgICAgIGNoaWxkcmVuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==