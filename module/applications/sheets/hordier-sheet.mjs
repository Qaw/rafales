import RafalesActorSheet from "./base-actor-sheet.mjs"

export default class HordierSheet extends RafalesActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["hordier"],
    position: { width: 500, height: 500 },
  }
}
