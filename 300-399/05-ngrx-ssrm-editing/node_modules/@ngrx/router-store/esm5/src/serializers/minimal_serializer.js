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
export { MinimalRouterStateSerializer };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluaW1hbF9zZXJpYWxpemVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9yb3V0ZXItc3RvcmUvc3JjL3NlcmlhbGl6ZXJzL21pbmltYWxfc2VyaWFsaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFvQkE7SUFBQTtJQWdDQSxDQUFDO0lBOUJDLGdEQUFTLEdBQVQsVUFBVSxXQUFnQztRQUN4QyxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEdBQUc7U0FDckIsQ0FBQztJQUNKLENBQUM7SUFFTyxxREFBYyxHQUF0QixVQUNFLEtBQTZCO1FBRC9CLGlCQXNCQztRQW5CQyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUNqRSxPQUFPO1lBQ0wsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3BCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO2dCQUM1QixDQUFDLENBQUM7b0JBQ0UsSUFBSSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSTtvQkFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUztvQkFDdEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsVUFBVTtvQkFDeEMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTTtpQkFDakM7Z0JBQ0gsQ0FBQyxDQUFDLElBQUk7WUFDUixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLFFBQVEsVUFBQTtTQUNULENBQUM7SUFDSixDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBaENELElBZ0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVyU3RhdGVTbmFwc2hvdCwgQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBCYXNlUm91dGVyU3RvcmVTdGF0ZSwgUm91dGVyU3RhdGVTZXJpYWxpemVyIH0gZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGludGVyZmFjZSBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gIHJvdXRlQ29uZmlnOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90Wydyb3V0ZUNvbmZpZyddO1xuICB1cmw6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3VybCddO1xuICBwYXJhbXM6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ3BhcmFtcyddO1xuICBxdWVyeVBhcmFtczogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFsncXVlcnlQYXJhbXMnXTtcbiAgZnJhZ21lbnQ6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ2ZyYWdtZW50J107XG4gIGRhdGE6IEFjdGl2YXRlZFJvdXRlU25hcHNob3RbJ2RhdGEnXTtcbiAgb3V0bGV0OiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90WydvdXRsZXQnXTtcbiAgZmlyc3RDaGlsZD86IE1pbmltYWxBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90O1xuICBjaGlsZHJlbjogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3RbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlIHtcbiAgcm9vdDogTWluaW1hbEFjdGl2YXRlZFJvdXRlU25hcHNob3Q7XG4gIHVybDogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTWluaW1hbFJvdXRlclN0YXRlU2VyaWFsaXplclxuICBpbXBsZW1lbnRzIFJvdXRlclN0YXRlU2VyaWFsaXplcjxNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdD4ge1xuICBzZXJpYWxpemUocm91dGVyU3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QpOiBNaW5pbWFsUm91dGVyU3RhdGVTbmFwc2hvdCB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJvb3Q6IHRoaXMuc2VyaWFsaXplUm91dGUocm91dGVyU3RhdGUucm9vdCksXG4gICAgICB1cmw6IHJvdXRlclN0YXRlLnVybCxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzZXJpYWxpemVSb3V0ZShcbiAgICByb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdFxuICApOiBNaW5pbWFsQWN0aXZhdGVkUm91dGVTbmFwc2hvdCB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSByb3V0ZS5jaGlsZHJlbi5tYXAoYyA9PiB0aGlzLnNlcmlhbGl6ZVJvdXRlKGMpKTtcbiAgICByZXR1cm4ge1xuICAgICAgcGFyYW1zOiByb3V0ZS5wYXJhbXMsXG4gICAgICBkYXRhOiByb3V0ZS5kYXRhLFxuICAgICAgdXJsOiByb3V0ZS51cmwsXG4gICAgICBvdXRsZXQ6IHJvdXRlLm91dGxldCxcbiAgICAgIHJvdXRlQ29uZmlnOiByb3V0ZS5yb3V0ZUNvbmZpZ1xuICAgICAgICA/IHtcbiAgICAgICAgICAgIHBhdGg6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGgsXG4gICAgICAgICAgICBwYXRoTWF0Y2g6IHJvdXRlLnJvdXRlQ29uZmlnLnBhdGhNYXRjaCxcbiAgICAgICAgICAgIHJlZGlyZWN0VG86IHJvdXRlLnJvdXRlQ29uZmlnLnJlZGlyZWN0VG8sXG4gICAgICAgICAgICBvdXRsZXQ6IHJvdXRlLnJvdXRlQ29uZmlnLm91dGxldCxcbiAgICAgICAgICB9XG4gICAgICAgIDogbnVsbCxcbiAgICAgIHF1ZXJ5UGFyYW1zOiByb3V0ZS5xdWVyeVBhcmFtcyxcbiAgICAgIGZyYWdtZW50OiByb3V0ZS5mcmFnbWVudCxcbiAgICAgIGZpcnN0Q2hpbGQ6IGNoaWxkcmVuWzBdLFxuICAgICAgY2hpbGRyZW4sXG4gICAgfTtcbiAgfVxufVxuIl19