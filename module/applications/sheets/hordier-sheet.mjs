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
    position: { width: 780, height: 1000 },
    actions: {
      toggleSheet: HordierSheet.#onToggleSheet,
      createLink: HordierSheet.#onCreateLink,
      deleteLink: HordierSheet.#onDeleteLink,
      roll: HordierSheet.#onRoll,
      openCarnet: HordierSheet.#onOpenCarnet,
      deleteCarnet: HordierSheet.#onDeleteCarnet,
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

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  async _onRender(_context, _options) {
    if (!game.user.isGM) return
    new DragDrop({
      dragSelector: ".draggable",
      dropSelector: null,
      callbacks: {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      },
    }).bind(this.element)
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

    context.isCroc = this.document.system.isCroc
    context.croc = this.document.system.isCroc ? "(Croc)" : ""
    context.isScribe = this.document.system.isScribe
    context.hasCarnet = this.document.system.hasCarnet
    context.carnet = this.document.system.hasCarnet ? this.document.system.carnet : null
    return context
  }

  /* -------------------------------------------- */
  /*  Drag and Drop                               */
  /* -------------------------------------------- */

  /**
   * An event that occurs when a drag workflow begins for a draggable item on the sheet.
   * @param {DragEvent} event       The initiating drag start event
   * @returns {Promise<void>}
   * @protected
   */
  async _onDragStart(event) {}

  /* -------------------------------------------- */

  /**
   * An event that occurs when a drag workflow moves over a drop target.
   * @param {DragEvent} event
   * @protected
   */
  _onDragOver(event) {}

  /* -------------------------------------------- */

  /**
   * An event that occurs when data is dropped into a drop target.
   * @param {DragEvent} event
   * @returns {Promise<void>}
   * @protected
   */
  async _onDrop(event) {
    if (!this.actor.system.isScribe) return

    // Type and uuid
    const data = TextEditor.getDragEventData(event)
    if (data.type !== "Item") return

    const item = await fromUuid(data.uuid)
    if (item.type !== "carnet") return

    if (this.document.system.hasCarnet) {
      return ui.notifications.warn(game.i18n.localize("RAFALES.Warning.carnetAlreadyExists"))
    }

    let itemData = item.toObject()
    await this.document.createEmbeddedDocuments("Item", [itemData], { renderSheet: false })
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

  static #onRoll(event, target) {
    this.actor.roll()
  }

  static #onOpenCarnet(event, target) {
    if (!this.actor.system.isScribe) return

    if (this.actor.system.hasCarnet) {
      const carnet = this.actor.system.carnet
      carnet.sheet.render(true)
    }
  }

  static #onDeleteCarnet(event, target) {
    if (!this.actor.system.isScribe) return

    if (this.actor.system.hasCarnet) {
      const carnet = this.actor.system.carnet
      carnet.delete()
    }
  }
}
