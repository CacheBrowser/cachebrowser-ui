export default class GettingStartedFinishCtrl {
  constructor(storage) {
    this.allowSkip = false

    storage.set('gettingStartedCompleted', true)
  }
}