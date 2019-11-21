/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function SerializedRouterStateSnapshot() { }
if (false) {
    /** @type {?} */
    SerializedRouterStateSnapshot.prototype.root;
    /** @type {?} */
    SerializedRouterStateSnapshot.prototype.url;
}
export class DefaultRouterStateSerializer {
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
            component: (/** @type {?} */ ((route.routeConfig
                ? route.routeConfig.component
                : undefined))),
            root: (/** @type {?} */ (undefined)),
            parent: (/** @type {?} */ (undefined)),
            firstChild: children[0],
            pathFromRoot: (/** @type {?} */ (undefined)),
            children,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0EsbURBR0M7OztJQUZDLDZDQUE2Qjs7SUFDN0IsNENBQVk7O0FBR2QsTUFBTSxPQUFPLDRCQUE0Qjs7Ozs7SUFFdkMsU0FBUyxDQUFDLFdBQWdDO1FBQ3hDLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1lBQzNDLEdBQUcsRUFBRSxXQUFXLENBQUMsR0FBRztTQUNyQixDQUFDO0lBQ0osQ0FBQzs7Ozs7O0lBRU8sY0FBYyxDQUNwQixLQUE2Qjs7Y0FFdkIsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBQztRQUNoRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtZQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDNUIsQ0FBQyxDQUFDO29CQUNFLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ3RDLElBQUksRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUk7b0JBQzVCLFNBQVMsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7b0JBQ3RDLFVBQVUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFVBQVU7b0JBQ3hDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU07aUJBQ2pDO2dCQUNILENBQUMsQ0FBQyxJQUFJO1lBQ1IsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsU0FBUyxFQUFFLG1CQUFBLENBQUMsS0FBSyxDQUFDLFdBQVc7Z0JBQzNCLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVM7Z0JBQzdCLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBTztZQUNyQixJQUFJLEVBQUUsbUJBQUEsU0FBUyxFQUFPO1lBQ3RCLE1BQU0sRUFBRSxtQkFBQSxTQUFTLEVBQU87WUFDeEIsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDdkIsWUFBWSxFQUFFLG1CQUFBLFNBQVMsRUFBTztZQUM5QixRQUFRO1NBQ1QsQ0FBQztJQUNKLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGl2YXRlZFJvdXRlU25hcHNob3QsIFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUsIFJvdXRlclN0YXRlU2VyaWFsaXplciB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgZXh0ZW5kcyBCYXNlUm91dGVyU3RvcmVTdGF0ZSB7XG4gIHJvb3Q6IEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgRGVmYXVsdFJvdXRlclN0YXRlU2VyaWFsaXplclxuICBpbXBsZW1lbnRzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuc2VyaWFsaXplUm91dGUocm91dGVyU3RhdGUucm9vdCksXG4gICAgICB1cmw6IHJvdXRlclN0YXRlLnVybCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVSb3V0ZShcbiAgICByb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuICApOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90IHtcbiAgICBjb25zdCBjaGlsZHJlbiA9IHJvdXRlLmNoaWxkcmVuLm1hcChjID0+IHRoaXMuc2VyaWFsaXplUm91dGUoYykpO1xuICAgIHJldHVybiB7XG4gICAgICBwYXJhbXM6IHJvdXRlLnBhcmFtcyxcbiAgICAgIHBhcmFtTWFwOiByb3V0ZS5wYXJhbU1hcCxcbiAgICAgIGRhdGE6IHJvdXRlLmRhdGEsXG4gICAgICB1cmw6IHJvdXRlLnVybCxcbiAgICAgIG91dGxldDogcm91dGUub3V0bGV0LFxuICAgICAgcm91dGVDb25maWc6IHJvdXRlLnJvdXRlQ29uZmlnXG4gICAgICAgID8ge1xuICAgICAgICAgICAgY29tcG9uZW50OiByb3V0ZS5yb3V0ZUNvbmZpZy5jb21wb25lbnQsXG4gICAgICAgICAgICBwYXRoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoLFxuICAgICAgICAgICAgcGF0aE1hdGNoOiByb3V0ZS5yb3V0ZUNvbmZpZy5wYXRoTWF0Y2gsXG4gICAgICAgICAgICByZWRpcmVjdFRvOiByb3V0ZS5yb3V0ZUNvbmZpZy5yZWRpcmVjdFRvLFxuICAgICAgICAgICAgb3V0bGV0OiByb3V0ZS5yb3V0ZUNvbmZpZy5vdXRsZXQsXG4gICAgICAgICAgfVxuICAgICAgICA6IG51bGwsXG4gICAgICBxdWVyeVBhcmFtczogcm91dGUucXVlcnlQYXJhbXMsXG4gICAgICBxdWVyeVBhcmFtTWFwOiByb3V0ZS5xdWVyeVBhcmFtTWFwLFxuICAgICAgZnJhZ21lbnQ6IHJvdXRlLmZyYWdtZW50LFxuICAgICAgY29tcG9uZW50OiAocm91dGUucm91dGVDb25maWdcbiAgICAgICAgPyByb3V0ZS5yb3V0ZUNvbmZpZy5jb21wb25lbnRcbiAgICAgICAgOiB1bmRlZmluZWQpIGFzIGFueSxcbiAgICAgIHJvb3Q6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBwYXJlbnQ6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBmaXJzdENoaWxkOiBjaGlsZHJlblswXSxcbiAgICAgIHBhdGhGcm9tUm9vdDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIGNoaWxkcmVuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==