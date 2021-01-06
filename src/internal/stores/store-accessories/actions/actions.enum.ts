
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
  removeRange = 'Remove Range',
  reset = 'Reset',
  error = '**ERROR** :(',
  destroy = '@@DESTROY',
}
