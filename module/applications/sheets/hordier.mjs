import { RafalesSheetMixin } from "./base-sheet.mjs";

export default class HordierSheet extends RafalesSheetMixin(foundry.applications.sheets.ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["rafales", "actor", "hordier"],
    position: { width: 500, top: 100, left: 200, height: "auto" },
  };
}
