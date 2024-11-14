import RafalesActorSheet from "./base-actor-sheet.mjs"

export default class HordierSheet extends RafalesActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["hordier"],
    position: { width: 500, height: 500 },
  }

  /** @override */
  static PARTS = {
    form: {
      template: "systems/rafales/templates/hordier.hbs",
    },
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext()
    context.isGM = game.user.isGM

    context.enrichedBiographie = await TextEditor.enrichHTML(this.document.system.biographie, { async: true })
    context.enrichedNotes = await TextEditor.enrichHTML(this.document.system.notes, { async: true })
    context.liens = this.document.system.liens
    return context
  }
}
