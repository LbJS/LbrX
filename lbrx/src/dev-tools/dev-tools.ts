import { Subject } from "rxjs"
import { StoreDevObject } from "./store-dev-object"

export class DevTools {
	public static readonly Stores = {}
	public static readonly LoadingStore$ = new Subject<string>()
	public static readonly InitStore$ = new Subject<StoreDevObject>()
	public static readonly OverrideStore$ = new Subject<StoreDevObject>()
	public static readonly UpdateStore$ = new Subject<StoreDevObject>()
	public static readonly ResetStore$ = new Subject<StoreDevObject>()
}
