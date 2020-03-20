import { createAction, props } from '@ngrx/store';

export const saveRows = createAction(
  '[App Component] Save Rows',
  props<{rows: any[]}>()
);

export const replaceRow = createAction(
  '[App Component] Replace Row',
  props<{id, field, value}>()
);

