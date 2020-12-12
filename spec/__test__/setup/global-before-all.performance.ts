import { toFinishWithin } from '__test__/extensions'

global.beforeAll(() => {
  expect.extend({
    toFinishWithin
  })
})
