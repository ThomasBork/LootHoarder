import { Injectable } from "@angular/core";
import { UIState } from "./client-representation/ui-state";

@Injectable()
export class UIStateManager {
  private _uiState?: UIState;
  public get state(): UIState {
    if (!this._uiState) {
      throw Error (`Expected ui state to be initialized.`);
    }
    return this._uiState;
  }

  public set state(uiState: UIState) {
    this._uiState = uiState;
  }
}