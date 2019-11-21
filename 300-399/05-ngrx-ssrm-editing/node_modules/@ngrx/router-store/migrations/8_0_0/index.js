(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/router-store/migrations/8_0_0/index", ["require", "exports", "typescript", "@angular-devkit/schematics", "@ngrx/router-store/schematics-core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_core_1 = require("@ngrx/router-store/schematics-core");
    function updateRouterStoreImport() {
        return (tree) => {
            schematics_core_1.visitTSSourceFiles(tree, sourceFile => {
                let changes = [];
                ts.forEachChild(sourceFile, function findDecorator(node) {
                    if (!ts.isDecorator(node)) {
                        ts.forEachChild(node, findDecorator);
                        return;
                    }
                    ts.forEachChild(node, function findImports(node) {
                        if (ts.isPropertyAssignment(node) &&
                            ts.isArrayLiteralExpression(node.initializer) &&
                            ts.isIdentifier(node.name) &&
                            node.name.text === 'imports') {
                            node.initializer.elements
                                .filter(ts.isIdentifier)
                                .filter(element => element.text === 'StoreRouterConnectingModule')
                                .forEach(element => {
                                changes.push(schematics_core_1.createReplaceChange(sourceFile, element, 'StoreRouterConnectingModule', 'StoreRouterConnectingModule.forRoot()'));
                            });
                        }
                        ts.forEachChild(node, findImports);
                    });
                });
                schematics_core_1.commitChanges(tree, sourceFile.fileName, changes);
            });
        };
    }
    function default_1() {
        return schematics_1.chain([updateRouterStoreImport()]);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS9taWdyYXRpb25zLzhfMF8wL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsaUNBQWlDO0lBQ2pDLDJEQUErRDtJQUMvRCx3RUFLNEM7SUFFNUMsU0FBUyx1QkFBdUI7UUFDOUIsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLG9DQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxPQUFPLEdBQW9CLEVBQUUsQ0FBQztnQkFDbEMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsU0FBUyxhQUFhLENBQUMsSUFBSTtvQkFDckQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ3pCLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO3dCQUNyQyxPQUFPO3FCQUNSO29CQUVELEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFNBQVMsV0FBVyxDQUFDLElBQUk7d0JBQzdDLElBQ0UsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQzs0QkFDN0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7NEJBQzdDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs0QkFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUM1Qjs0QkFDQSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVE7aUNBQ3RCLE1BQU0sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDO2lDQUN2QixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLDZCQUE2QixDQUFDO2lDQUNqRSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0NBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQ1YscUNBQW1CLENBQ2pCLFVBQVUsRUFDVixPQUFPLEVBQ1AsNkJBQTZCLEVBQzdCLHVDQUF1QyxDQUN4QyxDQUNGLENBQUM7NEJBQ0osQ0FBQyxDQUFDLENBQUM7eUJBQ047d0JBRUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7b0JBQ3JDLENBQUMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDO2dCQUVILCtCQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7UUFDRSxPQUFPLGtCQUFLLENBQUMsQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRkQsNEJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7IFJ1bGUsIGNoYWluLCBUcmVlIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgUmVwbGFjZUNoYW5nZSxcbiAgY3JlYXRlUmVwbGFjZUNoYW5nZSxcbiAgdmlzaXRUU1NvdXJjZUZpbGVzLFxuICBjb21taXRDaGFuZ2VzLFxufSBmcm9tICdAbmdyeC9yb3V0ZXItc3RvcmUvc2NoZW1hdGljcy1jb3JlJztcblxuZnVuY3Rpb24gdXBkYXRlUm91dGVyU3RvcmVJbXBvcnQoKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSkgPT4ge1xuICAgIHZpc2l0VFNTb3VyY2VGaWxlcyh0cmVlLCBzb3VyY2VGaWxlID0+IHtcbiAgICAgIGxldCBjaGFuZ2VzOiBSZXBsYWNlQ2hhbmdlW10gPSBbXTtcbiAgICAgIHRzLmZvckVhY2hDaGlsZChzb3VyY2VGaWxlLCBmdW5jdGlvbiBmaW5kRGVjb3JhdG9yKG5vZGUpIHtcbiAgICAgICAgaWYgKCF0cy5pc0RlY29yYXRvcihub2RlKSkge1xuICAgICAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBmaW5kRGVjb3JhdG9yKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0cy5mb3JFYWNoQ2hpbGQobm9kZSwgZnVuY3Rpb24gZmluZEltcG9ydHMobm9kZSkge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUpICYmXG4gICAgICAgICAgICB0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obm9kZS5pbml0aWFsaXplcikgJiZcbiAgICAgICAgICAgIHRzLmlzSWRlbnRpZmllcihub2RlLm5hbWUpICYmXG4gICAgICAgICAgICBub2RlLm5hbWUudGV4dCA9PT0gJ2ltcG9ydHMnXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBub2RlLmluaXRpYWxpemVyLmVsZW1lbnRzXG4gICAgICAgICAgICAgIC5maWx0ZXIodHMuaXNJZGVudGlmaWVyKVxuICAgICAgICAgICAgICAuZmlsdGVyKGVsZW1lbnQgPT4gZWxlbWVudC50ZXh0ID09PSAnU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlJylcbiAgICAgICAgICAgICAgLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgY3JlYXRlUmVwbGFjZUNoYW5nZShcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRmlsZSxcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICAgICAgJ1N0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZScsXG4gICAgICAgICAgICAgICAgICAgICdTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUuZm9yUm9vdCgpJ1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBmaW5kSW1wb3J0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbW1pdENoYW5nZXModHJlZSwgc291cmNlRmlsZS5maWxlTmFtZSwgY2hhbmdlcyk7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW3VwZGF0ZVJvdXRlclN0b3JlSW1wb3J0KCldKTtcbn1cbiJdfQ==