const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api

/**
 * An application for configuring the permissions which are available to each User role.
 * @extends ApplicationV2
 * @mixes HandlebarsApplication
 * @alias PermissionConfig
 */
export default class RafalesAdversity extends HandlebarsApplicationMixin(ApplicationV2) {
  // Id de l'horde de référence
  hordeId = game.settings.get("rafales", "hordeId")

  // Adversité
  adversity = game.settings.get("rafales", "adversity")

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    id: "rafales-application-adversity",
    tag: "form",
    classes: ["rafales adversite"],
    window: {
      title: "RAFALES.Adversity.title",
      contentClasses: ["adversite-content"],
      controls: [],
    },
    position: {
      width: 300,
      height: 200,
      top: 80,
      left: 150,
    },
    form: {
      closeOnSubmit: true,
    },
    actions: {
      increaseAdversity: RafalesAdversity.#increaseAdversity,
      decreaseAdversity: RafalesAdversity.#decreaseAdversity,
      openHorde: RafalesAdversity.#openHorde,
    },
  }

  /** @override */
  _getHeaderControls() {
    const controls = []
    if (game.user.isGM) {
      controls.push(
        {
          action: "increaseAdversity",
          icon: "fa fa-plus",
          label: "Augmenter",
        },
        {
          action: "decreaseAdversity",
          icon: "fa fa-minus",
          label: "Diminuer",
        },
      )
    }
    return controls
  }

  /** @override */
  static PARTS = {
    main: {
      template: "systems/rafales/templates/adversity.hbs",
    },
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
  async _prepareContext(_options = {}) {
    const horde = game.actors.get(this.hordeId)
    return {
      adversity: this.adversity,
      horde: horde ? horde.name : "Aucune horde",
      isGM: game.user.isGM,
    }
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
    // Type and uuid
    const data = TextEditor.getDragEventData(event)

    if (data.type !== "Actor") return
    const actor = await fromUuid(data.uuid)
    if (actor.type !== "horde") return
    await game.settings.set("rafales", "hordeId", actor.id)
    this.hordeId = actor.id
  }

  // #region Actions
  static async #increaseAdversity(event, target) {
    console.log("increase Adversity", event, target)
    const newValue = this.adversity + 1
    this.adversity = newValue
    await game.settings.set("rafales", "adversity", newValue)
  }

  static async #decreaseAdversity(event, target) {
    console.log("decrease Adversity", event, target)
    const currentValue = this.adversity
    if (currentValue > 0) {
      const newValue = currentValue - 1
      this.adversity = newValue
      await game.settings.set("rafales", "adversity", newValue)
    }
  }

  static #openHorde(event, target) {
    const horde = game.actors.get(this.hordeId)
    if (horde) {
      horde.sheet.render(true)
    } else {
      ui.notifications.info("Aucune horde de référence n'a été configurée.")
    }
  }

  // #endregion
}
