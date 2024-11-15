import RafalesActorSheet from "./base-actor-sheet.mjs"

export default class HordierSheet extends RafalesActorSheet {
  /**
   * Different sheet modes.
   * @enum {number}
   */
  static SHEET_MODES = { EDIT: 0, PLAY: 1 }

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["hordier"],
    position: { width: 670, height: 1000 },
    actions: {
      toggleSheet: HordierSheet.#onToggleSheet,
      createLink: HordierSheet.#onCreateLink,
      deleteLink: HordierSheet.#onDeleteLink,
    },
  }

  /** @override */
  static PARTS = {
    form: {
      template: "systems/rafales/templates/hordier.hbs",
    },
  }

  /**
   * The current sheet mode.
   * @type {number}
   */
  _sheetMode = this.constructor.SHEET_MODES.PLAY

  /**
   * Is the sheet currently in 'Play' mode?
   * @type {boolean}
   */
  get isPlayMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.PLAY
  }

  /**
   * Is the sheet currently in 'Edit' mode?
   * @type {boolean}
   */
  get isEditMode() {
    return this._sheetMode === this.constructor.SHEET_MODES.EDIT
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext()
    context.isGM = game.user.isGM

    context.enrichedBiographie = await TextEditor.enrichHTML(this.document.system.biographie, { async: true })
    context.enrichedNotes = await TextEditor.enrichHTML(this.document.system.notes, { async: true })
    context.liens = this.document.system.liens

    context.isEditMode = this.isEditMode
    context.isPlayMode = this.isPlayMode
    context.isEditable = this.isEditable
    return context
  }

  /**
   * Handle toggling between Edit and Play mode.
   * @param {Event} event             The initiating click event.
   * @param {HTMLElement} target      The current target of the event listener.
   */
  static #onToggleSheet(event, target) {
    const modes = this.constructor.SHEET_MODES
    this._sheetMode = this.isEditMode ? modes.PLAY : modes.EDIT
    this.render()
  }

  /**
   * Handles the creation of a new link and updates the actor's system links.
   *
   * @param {Event} event The event that triggered the creation of the link.
   * @param {HTMLElement} target The target element where the link is being created.
   * @private
   */
  static #onCreateLink(event, target) {
    let liens = this.actor.system.liens
    liens.push({ nom: "", lien: "" })
    this.actor.update({ "system.liens": liens })
  }

  static #onDeleteLink(event, target) {
    const index = target.dataset.index
    let liens = this.actor.system.liens
    liens.splice(index, 1)
    this.actor.update({ "system.liens": liens })
  }
}
