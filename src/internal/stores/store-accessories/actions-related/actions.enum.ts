
export const enum Actions {
  init = '@@INIT',
  initAsync = '@@INIT (async)',
  afterInitUpdate = 'After Init Update',
  paused = '|| <PAUSED> ||',
  loading = 'LOADING...',
  hardResetting = 'HARD RESETTING!!!',
  update = 'Update',
  override = 'Override',
  reset = 'Reset',
  error = '**ERROR** :(',
  destroy = '@@DESTROY',
}
