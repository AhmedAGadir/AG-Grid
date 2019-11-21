import { RouterStateSelectors } from './models';
import { RouterReducerState } from './reducer';
export declare function getSelectors<V>(selectState: (state: V) => RouterReducerState<any>): RouterStateSelectors<V>;
