import { iif, Observable, of, throwError as rxjsThrowError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import { isDev, isStackTracingErrors, SortFactory } from '../core'
import { assert, isArray, isBool, isCalledBy, isFrozen, isFunction, isNull, isNumber, isString, isUndefined, logError, objectAssign, objectFreeze, throwError } from '../helpers'
import { KeyValue } from '../types'
import { SortMethod } from '../types/sort-method'
import { ListStoreConfigCompleteInfo, ListStoreConfigOptions } from './config'
import { ListStoreContext } from './list-store-context'
import { QueryableListStoreAdapter } from './queryable-list-store-adapter'
import { Actions, Predicate, Project, ProjectsOrKeys, SetStateParam, State, ValueObservableMethodParam } from './store-accessories'


export class ListStore<S extends object, Id extends string | number | symbol = number, E = any> extends QueryableListStoreAdapter<S, E> {

  //#region id-helpers

  /** @internal */
  protected _idIndexMap: KeyValue<string | number | symbol, number> = {}

  /** @internal */
  protected _idsSet = new Set<string | number | symbol>()

  /** @internal */
  protected _idsToDelete: Id[] = []

  /** @internal */
  protected _idsClearFlag = false

  //#region id-helpers
  //#region state

  /**
   * @internal
   * @override
   */
  protected get _state(): State<S[], E> {
    return objectAssign({}, this._stateSource)
  }
  protected set _state(value: State<S[], E>) {
    if (isStackTracingErrors() && isDev() && !isCalledBy(`_setState`, 0)) {
      logError(`Store: "${this._storeName}" has called "_state" setter not from "_setState" method.`)
    }
    if (value.value) {
      value.value = this._sortHandler(value.value)
      const idKey = this._idKey
      if (idKey) {
        this._handleIdHelpers(value.value, idKey)
        this._assertUniqueIds(value.value)
      }
    } else {
      this._clearIdHelpers()
    }
    this._stateSource = value
    this._distributeState(value)
  }

  //#region state
  //#endregion config

  protected readonly _config!: ListStoreConfigCompleteInfo<S>

  /**
   * @get Returns store's configuration.
   */
  public get config(): ListStoreConfigCompleteInfo<S> {
    return this._config
  }

  /** @internal */
  protected readonly _idKey: keyof S | null

  /** @internal */
  protected readonly _sort: SortMethod<S> | null

  //#endregion config
  //#region constructor

  /**
   * Synchronous initialization.
   */
  constructor(initialValue: S[], storeConfig?: ListStoreConfigOptions<S>)
  /**
   * Asynchronous or delayed initialization.
   * The store will be set into loading state till initialization.
   */
  constructor(initialValue: null, storeConfig?: ListStoreConfigOptions<S>)
  /**
   * Dynamic initialization.
   */
  constructor(initialValue: S[] | null, storeConfig?: ListStoreConfigOptions<S>)
  constructor(initialValueOrNull: S[] | null, storeConfig?: ListStoreConfigOptions<S>) {
    super(storeConfig)
    const config = this._config
    this._idKey = config.idKey = config.idKey || null
    this._sort = config.orderBy ?
      isFunction(config.orderBy) ?
        config.orderBy :
        SortFactory.create(config.orderBy) :
      null
    this._preInit(initialValueOrNull)
  }

  //#endregion constructor
  //#region helper-methods

  /** @internal */
  protected _noSort(value: S[]): S[] {
    return value
  }

  /** @internal */
  protected _sortHandler(value: readonly S[]): readonly S[] {
    if (isNull(this._sort)) return value
    value = this._sort(isFrozen(value) ? [...value] : value)
    return isDev() ? objectFreeze(value) : value
  }

  //#endregion helper-methods
  //#region id-helpers-methods

  /** @internal */
  protected _handleIdHelpers(value: readonly S[], key: string | number | symbol): void {
    if (!this._value || this._idsClearFlag) this._clearIdHelpers()
    const deletePerformanceThreshold = 100
    const idsToDelete = this._idsToDelete
    if (idsToDelete.length > deletePerformanceThreshold
      && idsToDelete.length > value.length / 2
    ) {
      this._clearIdHelpers()
    } else {
      idsToDelete.forEach(id => {
        delete this._idIndexMap[id]
        this._idsSet.delete(id)
      })
      this._idsToDelete = []
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < value.length; i++) {
      const id: Id = value[i][key] as any
      if (this._idIndexMap[id] !== i) this._idIndexMap[id] = i
      if (!this._idsSet.has(id)) this._idsSet.add(id)
    }
  }

  /** @internal */
  protected _clearIdHelpers(): void {
    this._idIndexMap = {}
    this._idsSet.clear()
    this._idsToDelete = []
    this._idsClearFlag = false
  }

  /** @internal */
  protected _assertUniqueIds(value: S[] | readonly S[]): boolean | never {
    const idKey = this._idKey
    if (!idKey) return false
    let isIdsValid = value.length == this._idsSet.size
    if (!isIdsValid) {
      this._clearIdHelpers()
      this._handleIdHelpers(value, idKey)
      isIdsValid = value.length == this._idsSet.size
    }
    if (!isIdsValid) throwError(`Store: "${this._storeName}" has received a duplicate key.`)
    return true
  }

  //#endregion id-helpers-methods
  //#region state-methods

  /**
   * @internal
   * @override
   */
  protected _setState({
    valueFnOrState,
    actionName,
    stateExtension,
    doSkipClone,
    doSkipFreeze,
  }: SetStateParam<S[] | readonly S[], E>): void {
    super._setState({
      valueFnOrState,
      actionName,
      stateExtension,
      doSkipClone: isUndefined(doSkipClone) ? false : doSkipClone,
      doSkipFreeze: isUndefined(doSkipFreeze) ? false : doSkipFreeze,
    })
  }

  //#endregion state-methods
  //#region delete-methods

  public remove(predicate: Predicate<S>, actionName?: string): boolean {
    const value: readonly S[] | null = this._value
    if (!value || this.isPaused) return false
    const newValue: S[] = []
    let isItemNotFound = true
    const idKey = this._idKey
    value.forEach((x, i, a) => {
      let doSkipItem = false
      if (isItemNotFound) doSkipItem = predicate(x, i, a)
      if (doSkipItem) {
        isItemNotFound = false
        if (idKey) this._idsToDelete.push(x[idKey as any])
      } else {
        newValue.push(x)
      }
    })
    if (!isItemNotFound) {
      this._setState({
        valueFnOrState: { value: this._freezeHandler(newValue, true) },
        actionName: actionName || Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return !isItemNotFound
  }

  public removeRange(predicate: Predicate<S>, actionName?: string): number {
    const value: readonly S[] | null = this._value
    if (!value || this.isPaused) return 0
    const newValue: S[] = []
    let itemsRemoved = 0
    const idKey = this._idKey
    value.forEach((x, i, a) => {
      const doSkipItem = predicate(x, i, a)
      if (doSkipItem) {
        itemsRemoved++
        if (idKey) this._idsToDelete.push(x[idKey] as any)
      } else {
        newValue.push(x)
      }
    })
    if (itemsRemoved) {
      this._setState({
        valueFnOrState: { value: this._freezeHandler(newValue, true) },
        actionName: actionName || Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return itemsRemoved
  }

  public delete(id: Id, actionName?: string): boolean
  public delete(ids: Id[], actionName?: string): number
  public delete(idOrIds: Id | Id[], actionName?: string): boolean | number {
    const isArr = isArray(idOrIds)
    if (!isArr) idOrIds = [idOrIds] as Id[]
    const idKey = this._idKey
    const value: readonly S[] | null = this._value
    if (!idKey || !value || this.isPaused) return isArr ? 0 : false
    const filteredValue = value.filter(x => !(idOrIds as Id[]).includes(x[idKey] as any))
    const deletedCount = value.length - filteredValue.length
    if (deletedCount) {
      (idOrIds as Id[]).forEach(id => {
        this._idsToDelete.push(id)
      })
      this._setState({
        valueFnOrState: { value: this._freezeHandler(filteredValue, true) },
        actionName: actionName || Actions.delete,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return isArr ? deletedCount : false
  }

  public clear(actionName?: string): boolean {
    if (this.isPaused) return false
    const countOrNull: number | null = this._value ? this._value.length : null
    if (countOrNull) {
      this._idsClearFlag = true
      this._setState({
        valueFnOrState: { value: this._freeze([]) },
        actionName: actionName || Actions.removeRange,
        doSkipFreeze: true,
        doSkipClone: true,
      })
    }
    return !!countOrNull
  }

  //#endregion delete-methods
  //#region add-or-update-methods

  public set(items: S[], actionName?: string): void {
    if (this.isPaused) return
    assert(this.isInitialized, `Store: "${this._storeName}" can't set items to store before it was initialized.`)
    this._setState({
      valueFnOrState: { value: items },
      actionName: actionName || Actions.set,
    })
  }

  public add(item: S, actionName?: string): void
  public add(items: S[], actionName?: string): void
  public add(itemOrItems: S | S[], actionName?: string): void {
    if (this.isPaused) return
    const value: Readonly<S>[] = [...this._assertValue]
    assert(this.isInitialized, `Store: "${this._storeName}" can't add items to store before it was initialized.`)
    const clonedItemOrItems = this._cloneAndFreeze(itemOrItems)
    if (isArray(clonedItemOrItems)) {
      if (!clonedItemOrItems.length) return
      clonedItemOrItems.forEach(x => {
        value.push(x)
      })
    } else {
      value.push(clonedItemOrItems as Readonly<S>)
    }
    this._setState({
      valueFnOrState: { value: this._freezeHandler(value, true) },
      actionName: actionName || Actions.add,
      doSkipFreeze: true,
      doSkipClone: true,
    })
  }

  public update(id: Id, item: Partial<S>, actionName?: string): boolean
  public update(id: Id, item: S, isOverride: true, actionName?: string): boolean
  public update(ids: Id[], item: Partial<S>, actionName?: string): number
  public update(ids: Id[], item: S, isOverride: true, actionName?: string): number
  public update(ids: Id[], items: Partial<S>[], actionName?: string): number
  public update(ids: Id[], items: S[], isOverride: true, actionName?: string): number
  public update(predicate: Predicate<S>, item: Partial<S>, actionName?: string): number
  public update(predicate: Predicate<S>, item: S, isOverride: true, actionName?: string): number
  public update(
    idOrIdsOrPredicate: Id | Id[] | Predicate<S>,
    newItemOrItems: Partial<S> | S | Partial<S>[] | S[],
    isOverrideOrActionName?: boolean | string,
    actionName?: string
  ): boolean | number {
    const isSingleId = !isArray(idOrIdsOrPredicate) && !isFunction(idOrIdsOrPredicate)
    if (this.isPaused) return isSingleId ? 0 : false
    assert(this.isInitialized, `Store: "${this._storeName}" can't update items before it was initialized.`)
    const isOverride: boolean = isBool(isOverrideOrActionName) ? isOverrideOrActionName : false
    actionName = isString(isOverrideOrActionName) ? isOverrideOrActionName : actionName || Actions.update
    const oldValue: readonly S[] = this._assertValue
    let newValue: Readonly<S>[] = []
    let updateCounter = 0
    const idKey = this._idKey
    const update = (oldItem: Readonly<S>, newItem: Partial<S> | S, key?: string | number | symbol): Readonly<S> => {
      let clonedNewItem = this._clone(newItem)
      let tempId: string | number | symbol | null = null
      if (key) tempId = oldItem[key] as any
      if (!isOverride) clonedNewItem = this._merge(this._clone(oldItem), clonedNewItem)
      if (!isNull(tempId)) clonedNewItem[key as any] = tempId
      return this._freeze(clonedNewItem) as Readonly<S>
    }
    const updateByKey = (newItem: Partial<S> | S, id: Id, key: string | number | symbol): void => {
      const index: number | void = this._idIndexMap[id]
      if (isNumber(index)) {
        newValue[index] = update(oldValue[index], newItem, key)
        updateCounter++
      }
    }
    if (isFunction(idOrIdsOrPredicate)) {
      oldValue.forEach((x, i, a) => {
        if (idOrIdsOrPredicate(x, i, a)) {
          x = update(x, newItemOrItems as Partial<S> | S)
          updateCounter++
        }
        newValue.push(x)
      })
    } else if (!idKey) {
    } else if (isArray(idOrIdsOrPredicate)) {
      newValue = [...oldValue]
      idOrIdsOrPredicate.forEach((x, i) => {
        const newItem: Partial<S> | S | undefined = newItemOrItems[i]
        if (newItem) updateByKey(newItem, x, idKey)
      })
    } else {
      newValue = [...oldValue]
      updateByKey(newItemOrItems as Partial<S> | S, idOrIdsOrPredicate, idKey)
    }
    this._setState({
      valueFnOrState: { value: this._freezeHandler(newValue, true) },
      actionName,
      doSkipFreeze: true,
      doSkipClone: true,
    })
    return isSingleId ? !!updateCounter : updateCounter
  }

  public updateAll(updateFn: (value: S, index: number, arr: S[]) => S, actionName?: string): number
  public updateAll(value: Partial<S>, actionName?: string): number
  public updateAll(value: S, isOverride: true, actionName?: string): number
  public updateAll(
    updateFnOrValue: S | Partial<S> | ((value: S, index: number, arr: S[]) => S),
    isOverrideOrActionName?: boolean | string,
    actionName?: string
  ): number {
    if (this.isPaused) return 0
    assert(this.isInitialized, `Store: "${this._storeName}" can't update items before it was initialized.`)
    const isOverride: boolean = isBool(isOverrideOrActionName) ? isOverrideOrActionName : false
    actionName = isString(isOverrideOrActionName) ? isOverrideOrActionName : actionName || Actions.updateAll
    let newValue: S[] = this._clone(this._assertValue) as S[]
    if (!newValue.length) return 0
    const idKey = this._idKey
    const updateFn = isFunction(updateFnOrValue) ?
      updateFnOrValue :
      (oldItem: S) => isOverride ? updateFnOrValue as S : this._merge(oldItem, this._clone(updateFnOrValue)) as S
    newValue = idKey ? newValue.map((x, i, a) => {
      const id: Id = x[idKey as any]
      x = updateFn(x, i, a)
      x[idKey as any] = id
      return x
    }) : newValue.map(updateFn)
    if (isFunction(updateFnOrValue)) newValue = this._clone(newValue)
    this._setState({
      valueFnOrState: { value: newValue },
      actionName,
      doSkipFreeze: true,
    })
    return newValue.length
  }

  public addOrUpdate(item: S, addActionName?: string | null, updateActionName?: string | null): [number, number]
  public addOrUpdate(items: S[], addActionName?: string | null, updateActionName?: string | null): [number, number]
  public addOrUpdate(itemOrItems: S | S[], addActionName?: string | null, updateActionName?: string | null): [number, number] {
    if (this.isPaused) return [0, 0]
    assert(this.isInitialized, `Store: "${this._storeName}" can't update or add items before it was initialized.`)
    if (!isArray(itemOrItems)) itemOrItems = [itemOrItems]
    const itemsToAdd: S[] = []
    const itemsToUpdate: { items: S[], ids: Id[] } = { items: [], ids: [] }
    const idKey = this._idKey;
    (itemOrItems as S[]).forEach(item => {
      if (idKey) {
        const id: Id = item[idKey as any]
        if (this._idsSet.has(id)) {
          itemsToUpdate.ids.push(id)
          itemsToUpdate.items.push(item)
          return
        }
      }
      itemsToAdd.push(item)
    })
    this.add(itemsToAdd, addActionName || undefined)
    this.update(itemsToUpdate.ids, itemsToUpdate.items, true, updateActionName || undefined)
    return [itemsToAdd.length, itemsToUpdate.ids.length]
  }

  //#endregion add-or-update-methods
  //#region query-methods

  public has(id: Id): boolean {
    return this._idsSet.has(id)
  }

  public get(id: Id): S
  public get(ids: Id[]): S[]
  public get<R>(ids: Id, project: (value: Readonly<S>) => R): R
  public get<R>(ids: Id[], project: (value: Readonly<S>) => R): R[]
  public get<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(ids: Id, projects: M[]): R[]
  public get<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(ids: Id[], projects: M[]): R[][]
  public get<R extends any[]>(id: Id, projects: ((value: Readonly<S>) => any)[]): R
  public get<R extends any[]>(ids: Id[], projects: ((value: Readonly<S>) => any)[]): R[]
  public get<K extends keyof S>(id: Id, key: K): S[K]
  public get<K extends keyof S>(ids: Id[], key: K): S[K][]
  public get<K extends keyof S>(id: Id, keys: K[]): Pick<S, K>
  public get<K extends keyof S>(ids: Id[], keys: K[]): Pick<S, K>[]
  public get<R>(idOrIds: Id | Id[], dynamic?: ProjectsOrKeys<S, R>): R
  public get<R, K extends keyof S>(idOrIds: Id | Id[], projectsOrKeys?: ProjectsOrKeys<S, R>
  ): S | S[] | R[] | R[][] | S[K][] | Pick<S, K>[] {
    const project = this._getProjectionMethod(projectsOrKeys)
    if (isArray(idOrIds)) {
      const result: any[] = []
      idOrIds.forEach(x => {
        if (this._idsSet.has(x)) {
          const index = this._idIndexMap[x]
          const item = this._assertValue[index]
          const projectedItem = project(item)
          result.push(this._cloneIfObject(projectedItem))
        }
      })
      return result
    } else {
      if (!this._idsSet.has(idOrIds)) throwError(`Store: "${this._storeName}" doesn't have an item with id: "${idOrIds}".`)
      const index = this._idIndexMap[idOrIds]
      const item = this._assertValue[index]
      const projectedItem = project(item)
      return this._cloneIfObject(projectedItem)
    }
  }

  public onAction(onAction?: Actions | string): Pick<ListStore<S, Id>, `has$` | `get$`>
  public onAction(onActions?: (Actions | string)[]): Pick<ListStore<S, Id>, `has$` | `get$`>
  public onAction(onActionOrActions?: Actions | string | (Actions | string)[]): Pick<ListStore<S, Id>, `has$` | `get$`> {
    return {
      has$: (id: Id) => this._has$(id, onActionOrActions),
      get$: <R>(idOrIds: Id | Id[], projectsOrKeys?: ProjectsOrKeys<S, R>) => {
        const subProject = this._getProjectionMethod(projectsOrKeys)
        const finalProject = this._projectBasedByIds(idOrIds, subProject)
        const mergeMapOperator = mergeMap((x: any) => iif(() => isNull(x),
          rxjsThrowError(`Store: "${this._storeName}" has resolved a null value by get$ observable.`),
          of(x)))
        return this._get$({
          onActionOrActions,
          projectsOrKeys: finalProject,
          operators: [mergeMapOperator],
        })
      }
    }
  }

  public _has$(id: Id, onActionOrActions?: Actions | string | (Actions | string)[]): Observable<boolean> {
    const has: Project<any, boolean> = () => this._idsSet.has(id)
    return this._get$({
      onActionOrActions,
      projectsOrKeys: has
    })
  }

  /** @internal */
  protected _projectBasedByIds<R>(idOrIds: Id | Id[], project: Project<S, R>): Project<S | S[], any> {
    if (isArray(idOrIds)) {
      return () => {
        const result: any[] = []
        idOrIds.forEach(x => {
          if (this._idsSet.has(x)) {
            const index = this._idIndexMap[x]
            const item = this._assertValue[index]
            const projectedItem = project(item)
            result.push(this._cloneIfObject(projectedItem))
          }
        })
        return result
      }
    } else {
      return () => {
        if (this._idsSet.has(idOrIds)) {
          const index = this._idIndexMap[idOrIds]
          const item = this._assertValue[index]
          return project(item)
        } else {
          return null
        }
      }
    }
  }

  public get$(id: Id): Observable<S>
  public get$(ids: Id[]): Observable<S[]>
  public get$<R>(ids: Id, project: (value: Readonly<S>) => R): Observable<R>
  public get$<R>(ids: Id[], project: (value: Readonly<S>) => R): Observable<R[]>
  public get$<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(ids: Id, projects: M[]): Observable<R[]>
  public get$<R extends ReturnType<M>, M extends ((value: Readonly<S>) => any)>(ids: Id[], projects: M[]): Observable<R[][]>
  public get$<R extends any[]>(id: Id, projects: ((value: Readonly<S>) => any)[]): Observable<R>
  public get$<R extends any[]>(ids: Id[], projects: ((value: Readonly<S>) => any)[]): Observable<R[]>
  public get$<K extends keyof S>(id: Id[], key: K): Observable<S[K]>
  public get$<K extends keyof S>(ids: Id[], key: K): Observable<S[K][]>
  public get$<K extends keyof S>(id: Id[], keys: K[]): Observable<Pick<S, K>>
  public get$<K extends keyof S>(ids: Id[], keys: K[]): Observable<Pick<S, K>[]>
  public get$<R>(id: Id[], dynamic?: ProjectsOrKeys<S, R>): Observable<R>
  public get$<R>(ids: Id[], dynamic?: ProjectsOrKeys<S, R>): Observable<R[]>
  public get$<R, K extends keyof S>(idOrIds: Id | Id[], projectsOrKeys?: ProjectsOrKeys<S, R>
  ): Observable<S | S[] | R[] | R[][] | S[K][] | Pick<S, K>[]> {
    const subProject = this._getProjectionMethod(projectsOrKeys)
    const finalProject = this._projectBasedByIds(idOrIds, subProject)
    const mergeMapOperator = mergeMap((x: any) => iif(() => isNull(x),
      rxjsThrowError(`Store: "${this._storeName}" has resolved a null value by get$ observable.`),
      of(x)))
    return this._get$({
      projectsOrKeys: finalProject,
      operators: [mergeMapOperator]
    })
  }


  public has$(id: Id): Observable<boolean> {
    return this._has$(id)
  }

  //#endregion query-methods
  //#region reset-destroy-methods

  /**
   * @internal
   * @override
   */
  protected _onReset(): void {
    this._idsClearFlag = true
  }

  /** @internal */
  protected _partialHardReset(action: Actions, isLoading: boolean = true): void {
    this._idsClearFlag = true
    super._partialHardReset(action, isLoading)
  }

  //#endregion reset-destroy-methods
  //#region store-context

  public getContext(saveChangesActionName?: string | null, onActionOrActions?: Actions | string | (Actions | string)[]
  ): ListStoreContext<S, Id> {
    const idKey = this._idKey
    assert(idKey, `Store: "${this._storeName}" can't instantiate "ListStoreContext" if "idKey" is not configured.`)
    return new ListStoreContext({
      store: this,
      get$: (value: ValueObservableMethodParam<S[], any>) => this._get$(value),
      saveActionName: saveChangesActionName || undefined,
      onActionOrActions,
      idKey,
      projectBasedByIds: <R>(idOrIds: Id | Id[], project: Project<S, R>) => this._projectBasedByIds(idOrIds, project)
    })
  }

  //#endregion store-context
}
