
export const enum Actions {
  init = '@@INIT',
  initAsync = '@@INIT (async)',
  afterInitUpdate = 'After Init Update',
  paused = '|| <PAUSED> ||',
  unpause = '>> UNPAUSE >>',
  loading = 'LOADING...',
  hardResetting = 'HARD RESETTING !!!',
  update = 'Update',
  set = 'Set',
  remove = 'Remove',
  removeRange = 'Remove Range',
  clear = 'Clear',
  reset = 'Reset',
  error = '**ERROR** :(',
  destroy = '@@DESTROY',
}
