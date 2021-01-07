# LbrX - _alpha version_

This is an object oriented State Manager that's build for JavaScript applications that's based on RxJs. The api for querying the data is very similar to .Net EF LINQ but with observables. State updates can also be achieved with partial objects and we will merge the objects for you. Object instance preservation guaranteed if you're working with classes or dates. Unlinked object references guaranteed even with deep nested objects, no changes will apply to your state unintentionally. Two way data flow with no boilerplate code! We also support Redux DevTools for easier state debugging.

## Development progress

- [x] Single object store
- [x] Class support
- [x] Local or session storage configuration per store
- [x] Reset-able stores support
- [x] Object compare configuration per store support for better performance with very large objects
- [x] Store hooks
- [x] Redux DevTools one way support
- [x] Redux DevTools both ways support
- [x] Deep nested objects support
- [x] Global default store configurations
- [x] Async initialization support (Promise and Observable)
- [x] Serialization and denationalization configuration for browser storage
- [x] NgZone Support
- [x] ES5 support
- [x] Multi platform support, including Node.JS
- [x] LbrX utility functions available for import
- [x] Store pause api
- [x] Store destroy api
- [x] Advanced store config that allows methods override like `objectClone`, `objectCompare`, etc.
- [x] Get with string literals
- [x] Full spec coverage of the above
- [ ] **List Store - wip**
- [ ] Full spec coverage of the above
- [ ] Playground
- [ ] Full documentation

## Important Notice

- All update/add/delete hooks are now using the new `onStateChange` hook. This hook can be filtered by actions using `onStateChangeActions` property.

## Dependencies

- RxJS 6.5.4 or higher.

## Installation

```bach
npm i lbrx rxjs
```

## CDN

| URL                                                                         | ES     | Minified |
| --------------------------------------------------------------------------- | ------ | -------- |
| <https://cdn.jsdelivr.net/npm/lbrx@0.4.0-alpha/bundles/lbrx.umd.js>         | ES2015 | No       |
| <https://cdn.jsdelivr.net/npm/lbrx@0.4.0-alpha/bundles/lbrx.umd.min.js>     | ES2015 | Yes      |
| <https://cdn.jsdelivr.net/npm/lbrx@0.4.0-alpha/bundles/lbrx.umd.es5.js>     | ES5    | No       |
| <https://cdn.jsdelivr.net/npm/lbrx@0.4.0-alpha/bundles/lbrx.umd.es5.min.js> | ES5    | Yes      |

## Example

### Step 1: Initialization

```typescript
import { LbrXManager, StoreConfig, Store, Storages } from "lbrx";

const PROD_MODE = false;
if (PROD_MODE) LbrXManager.enableProdMode();
LbrXManager.initializeDevTools();

class Address {
  place: string | null = null;
}

class User {
  firstName: string | null = null;
  lastName: string | null = null;
  address: Address | null = null;
}

function createLeon(): User {
  return Object.assign(new User(), {
    firstName: "Leon",
    address: Object.assign(new Address(), {
      place: "Hell of a place",
    }),
  });
}
```

### Step 2: Create Store

```typescript
@StoreConfig({
  name: "LEON-STORE",
  objectCompareType: ObjectCompareTypes.advanced,
  isResettable: true,
  storageType: Storages.session,
  storageDebounceTime: 500,
})
class UserStore extends Store<User> {
  constructor() {
    super(createLeon());
  }
}

const userStore = new UserStore();
```

### Step 3: Subscribe to changes

```typescript
userStore.get$().subscribe((x) => console.log(x));
userStore
  .get$((state) => state.firstName)
  .subscribe((x) => console.log("firstName: " + x));
userStore
  .get$((state) => state.lastName)
  .subscribe((x) => console.log("lastName: " + x));
userStore
  .get$((state) => state.address?.place)
  .subscribe((x) => console.log("address: " + x));

// User {firstName: "Leon", lastName: null, address: Address}
// firstName: Leon
// lastName: null
// address: Hell of a place
```

### Step 4: Update Store

Pay attention to the values that haven't been changed. They won't trigger their subscribers, thus preventing unnecessary performance hit.

```typescript
setTimeout(() => {
  userStore.update({
    firstName: "Some other name",
    lastName: "My first lastName",
  });
}, 200);

// User {firstName: "Some other name", lastName: "My first lastName", address: Address}
// firstName: Some other name
// lastName: My first lastName

setTimeout(() => {
  userStore.update({
    firstName: "Some other name",
    lastName: "My second lastName",
    address: {
      place: "Some other place",
    },
  });
}, 500);

// User {firstName: "Some other name", lastName: "My second lastName", address: Address}
// lastName: My second lastName
// address: Some other place

setTimeout(() => {
  userStore.reset();
}, 500);

// User {firstName: "Leon", lastName: null, address: Address}
// firstName: Leon
// lastName: null
// address: Hell of a place

setTimeout(() => {
  userStore.reset();
}, 550);

// NOTHING will print ( because the state didn't change. )
```

### Step 5: Debug using Redux DevTools

![ReduxDevTools](https://lh3.googleusercontent.com/8OTs0-DeqWlIGDU67xmLJCFm3gB2QVilTpUzpt3R_p-5BwS3Utam1VB18kIodxBxckO_CVUt-Ydpl41fJ4pAVspGvC0qWt8Xh3qRKUZweKTEFjQlhPvoep3xHcLSWFUj-RYJ7EeiyQ=w2400)

## Browser Support

- All current browsers (major versions from the last 2 years) are supported.
- Node.JS support.
- Source files are included in 'node_modules\lbrx\src'.
- UMD bundles\* are included in 'node_modules\lbrx\bundles'.
- IE11\*\* ES5 syntax support.

_\* Both ES5 and ES2015 UMD bundles are included and both have minified and non minified versions. In all bundles the global would be `lbrx`._

_\*\* For IE11 you may need additional polyfills but if you're using a framework, they may already be included._

## Licence

- [MIT Licence](https://github.com/LbJS/LbrX/blob/master/LICENSE)
- Copyright (c) 2020 Leon Bernstein.
