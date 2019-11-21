/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ROUTER_CANCEL, ROUTER_ERROR, ROUTER_NAVIGATION, } from './actions';
/**
 * @template T
 * @param {?} state
 * @param {?} action
 * @return {?}
 */
export function routerReducer(state, action) {
    // Allow compilation with strictFunctionTypes - ref: #1344
    /** @type {?} */
    const routerAction = (/** @type {?} */ (action));
    switch (routerAction.type) {
        case ROUTER_NAVIGATION:
        case ROUTER_ERROR:
        case ROUTER_CANCEL:
            return {
                state: routerAction.payload.routerState,
                navigationId: routerAction.payload.event.id,
            };
        default:
            return (/** @type {?} */ (state));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkdWNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NyYy9yZWR1Y2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLFlBQVksRUFDWixpQkFBaUIsR0FFbEIsTUFBTSxXQUFXLENBQUM7Ozs7Ozs7QUFXbkIsTUFBTSxVQUFVLGFBQWEsQ0FHM0IsS0FBd0MsRUFDeEMsTUFBYzs7O1VBR1IsWUFBWSxHQUFHLG1CQUFBLE1BQU0sRUFBd0I7SUFDbkQsUUFBUSxZQUFZLENBQUMsSUFBSSxFQUFFO1FBQ3pCLEtBQUssaUJBQWlCLENBQUM7UUFDdkIsS0FBSyxZQUFZLENBQUM7UUFDbEIsS0FBSyxhQUFhO1lBQ2hCLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVztnQkFDdkMsWUFBWSxFQUFFLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7YUFDNUMsQ0FBQztRQUNKO1lBQ0UsT0FBTyxtQkFBQSxLQUFLLEVBQXlCLENBQUM7S0FDekM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnQG5ncngvc3RvcmUnO1xuaW1wb3J0IHtcbiAgUk9VVEVSX0NBTkNFTCxcbiAgUk9VVEVSX0VSUk9SLFxuICBST1VURVJfTkFWSUdBVElPTixcbiAgUm91dGVyQWN0aW9uLFxufSBmcm9tICcuL2FjdGlvbnMnO1xuaW1wb3J0IHsgQmFzZVJvdXRlclN0b3JlU3RhdGUgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2Jhc2UnO1xuaW1wb3J0IHsgU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3QgfSBmcm9tICcuL3NlcmlhbGl6ZXJzL2RlZmF1bHRfc2VyaWFsaXplcic7XG5cbmV4cG9ydCB0eXBlIFJvdXRlclJlZHVjZXJTdGF0ZTxcbiAgVCBleHRlbmRzIEJhc2VSb3V0ZXJTdG9yZVN0YXRlID0gU2VyaWFsaXplZFJvdXRlclN0YXRlU25hcHNob3Rcbj4gPSB7XG4gIHN0YXRlOiBUO1xuICBuYXZpZ2F0aW9uSWQ6IG51bWJlcjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByb3V0ZXJSZWR1Y2VyPFxuICBUIGV4dGVuZHMgQmFzZVJvdXRlclN0b3JlU3RhdGUgPSBTZXJpYWxpemVkUm91dGVyU3RhdGVTbmFwc2hvdFxuPihcbiAgc3RhdGU6IFJvdXRlclJlZHVjZXJTdGF0ZTxUPiB8IHVuZGVmaW5lZCxcbiAgYWN0aW9uOiBBY3Rpb25cbik6IFJvdXRlclJlZHVjZXJTdGF0ZTxUPiB7XG4gIC8vIEFsbG93IGNvbXBpbGF0aW9uIHdpdGggc3RyaWN0RnVuY3Rpb25UeXBlcyAtIHJlZjogIzEzNDRcbiAgY29uc3Qgcm91dGVyQWN0aW9uID0gYWN0aW9uIGFzIFJvdXRlckFjdGlvbjxhbnksIFQ+O1xuICBzd2l0Y2ggKHJvdXRlckFjdGlvbi50eXBlKSB7XG4gICAgY2FzZSBST1VURVJfTkFWSUdBVElPTjpcbiAgICBjYXNlIFJPVVRFUl9FUlJPUjpcbiAgICBjYXNlIFJPVVRFUl9DQU5DRUw6XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzdGF0ZTogcm91dGVyQWN0aW9uLnBheWxvYWQucm91dGVyU3RhdGUsXG4gICAgICAgIG5hdmlnYXRpb25JZDogcm91dGVyQWN0aW9uLnBheWxvYWQuZXZlbnQuaWQsXG4gICAgICB9O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gc3RhdGUgYXMgUm91dGVyUmVkdWNlclN0YXRlPFQ+O1xuICB9XG59XG4iXX0=