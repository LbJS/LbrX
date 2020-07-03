
export interface MomentLike {
  _d: Date,
  _i?: Date,
  _isAMomentObject: boolean,
  _l?: string,
  _f?: string,
  _strict?: boolean,
  _useUTC?: boolean
  _isUTC?: boolean
  clone: () => MomentLike
}
