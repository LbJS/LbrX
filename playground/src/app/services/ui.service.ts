import { UiStore } from 'src/app/stores/ui-store'

export class UiService {
  private static _uiService: UiService

  private constructor(public readonly uiStore: UiStore) { }

  public static getUiService(): UiService {
    if (this._uiService) return this._uiService
    this._uiService = new UiService(new UiStore())
    return this._uiService
  }
}
