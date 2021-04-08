import {fileActions} from './fileActions.jsx'
import {rowSelectedActions} from './rowSelectedActions.jsx'

export const actions = {
  ...fileActions,
  ...rowSelectedActions
}