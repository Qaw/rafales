import RafalesActorSheet from "./base-actor-sheet.mjs"

export default class HordeSheet extends RafalesActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["horde"],
    position: { height: "auto", width: 560, top: 100, left: 200 },
    actions: {
      changeConnaissance: HordeSheet.#onchangeConnaissance,
      changeEspoir: HordeSheet.#onchangeEspoir,
      changeVif: HordeSheet.#onchangeVif,
    },
  }

  /** @override */
  static PARTS = {
    form: {
      template: "systems/rafales/templates/horde.hbs",
    },
  }

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext()

    context.config = CONFIG.SYSTEM
    context.cohesion = context.actor.system.statistiques.cohesion
    context.cohesionIndice = game.settings.get("rafales", "oneshot") ? context.actor.system.statistiques.cohesion.valeur * 4 : context.actor.system.statistiques.cohesion.valeur
    context.vitalite = context.actor.system.statistiques.vitalite
    context.vitaliteIndice = game.settings.get("rafales", "oneshot") ? context.actor.system.statistiques.vitalite.valeur * 4 : context.actor.system.statistiques.vitalite.valeur
    context.conviction = context.actor.system.statistiques.conviction
    context.convictionIndice = game.settings.get("rafales", "oneshot")
      ? context.actor.system.statistiques.conviction.valeur * 4
      : context.actor.system.statistiques.conviction.valeur
    context.connaissance = context.actor.system.statistiques.connaissance
    context.espoir = context.actor.system.statistiques.espoir
    context.vif = context.actor.system.statistiques.vif

    let connaissanceArray = []
    for (let i = 0; i < 5; i++) {
      connaissanceArray.push({ indice: i + 1, value: i < context.connaissance.valeur })
    }
    context.connaissanceArray = connaissanceArray
    context.connaissanceFull = context.connaissance.valeur === 5

    let espoirArray = []
    for (let i = 0; i < 5; i++) {
      espoirArray.push({ indice: i + 1, value: i < context.espoir.valeur })
    }
    context.espoirArray = espoirArray
    context.espoirFull = context.espoir.valeur === 5

    let vifArray = []
    for (let i = 0; i < 5; i++) {
      vifArray.push({ indice: i + 1, value: i < context.vif.valeur })
    }
    context.vifArray = vifArray
    context.vifFull = context.vif.valeur === 5

    // Name and img
    context.header = {
      name: context.isPlayMode ? context.actor.name : context.actor.name,
      img: context.isPlayMode ? context.actor.img : context.actor.img,
    }

    context.isGM = game.user.isGM
    context.displayInfoStats = game.settings.get("rafales", "displayInfoStats")

    return context
  }

  /**
   * Handles changes to the connaissance statistic.
   *
   * This method updates the actor's "connaissance" value based on the event triggered by the user interaction.
   *
   * @param {Event} event The event object triggered by the user interaction.
   * @param {HTMLElement} target The target element that triggered the event.
   * @returns {Promise<void>} - A promise that resolves when the actor's "connaissance" value has been updated.
   * @private
   */
  static async #onchangeConnaissance(event, target) {
    const value = parseInt(event.target.dataset.value)
    const checked = event.target.checked
    const currentValue = this.actor.system.statistiques.connaissance.valeur

    // Si on coche une case vide, on change la valeur
    if (checked) return await this.actor.update({ "system.statistiques.connaissance.valeur": value })
    else {
      // Cas de la dernière case : le clic met la valeur à 4
      if (value === 5) return await this.actor.update({ "system.statistiques.connaissance.valeur": 4 })
      // Cas de la première case : le premier clic laisse la valeur à 1, le deuxième clic la met à 0
      if (currentValue > 1) return await this.actor.update({ "system.statistiques.connaissance.valeur": value })
      else return await this.actor.update({ "system.statistiques.connaissance.valeur": 0 })
    }
  }

  /**
   * Handles the change event for the espoir statistic.
   *
   * This method updates the actor's "espoir" value based on the checkbox state and the current value.
   *
   * @param {Event} event The event object from the change event.
   * @param {HTMLElement} target The target element that triggered the event.
   * @returns {Promise<void>} - A promise that resolves when the actor's "espoir" value has been updated.
   * @private
   */
  static async #onchangeEspoir(event, target) {
    const value = parseInt(event.target.dataset.value)
    const checked = event.target.checked
    const currentValue = this.actor.system.statistiques.connaissance.valeur

    // Si on coche une case vide, on change la valeur
    if (checked) return await this.actor.update({ "system.statistiques.espoir.valeur": value })
    else {
      // Cas de la dernière case : le clic met la valeur à 4
      if (value === 5) return await this.actor.update({ "system.statistiques.espoir.valeur": 4 })
      // Cas de la première case : le premier clic laisse la valeur à 1, le deuxième clic la met à 0
      if (currentValue > 1) return await this.actor.update({ "system.statistiques.espoir.valeur": value })
      else return await this.actor.update({ "system.statistiques.espoir.valeur": 0 })
    }
  }

  /**
   * Handles the change event for the "vif" statistic.
   *
   * This method updates the "vif" value of the actor's statistics based on the event triggered.
   *
   * @param {Event} event The event object triggered by the change.
   * @param {HTMLElement} target The target element of the event.
   * @returns {Promise<void>} - A promise that resolves when the actor's statistics have been updated.
   */
  static async #onchangeVif(event, target) {
    const value = parseInt(event.target.dataset.value)
    const checked = event.target.checked
    const currentValue = this.actor.system.statistiques.connaissance.valeur

    // Si on coche une case vide, on change la valeur
    if (checked) return await this.actor.update({ "system.statistiques.vif.valeur": value })
    else {
      // Cas de la dernière case : le clic met la valeur à 4
      if (value === 5) return await this.actor.update({ "system.statistiques.vif.valeur": 4 })
      // Cas de la première case : le premier clic laisse la valeur à 1, le deuxième clic la met à 0
      if (currentValue > 1) return await this.actor.update({ "system.statistiques.vif.valeur": value })
      else return await this.actor.update({ "system.statistiques.vif.valeur": 0 })
    }
  }

  /** @override */
  _onRender(_context, _options) {
    const cohesion = this.element.querySelector(".cohesion-name")
    cohesion.addEventListener("click", (event) => this._ChangeStatistique(event, "cohesion", true))
    cohesion.addEventListener("contextmenu", (event) => this._ChangeStatistique(event, "cohesion", false))

    const vitalite = this.element.querySelector(".vitalite-name")
    vitalite.addEventListener("click", (event) => this._ChangeStatistique(event, "vitalite", true))
    vitalite.addEventListener("contextmenu", (event) => this._ChangeStatistique(event, "vitalite", false))

    const conviction = this.element.querySelector(".conviction-name")
    conviction.addEventListener("click", (event) => this._ChangeStatistique(event, "conviction", true))
    conviction.addEventListener("contextmenu", (event) => this._ChangeStatistique(event, "conviction", false))

    const connaissance = this.element.querySelector(".connaissance-img")
    connaissance.addEventListener("click", async (event) => await this._ResetStatistique(event, "cohesion", true))

    const espoir = this.element.querySelector(".espoir-img")
    espoir.addEventListener("click", async (event) => await this._ResetStatistique(event, "espoir", true))

    const vif = this.element.querySelector(".vif-img")
    vif.addEventListener("click", async (event) => await this._ResetStatistique(event, "vif", true))
  }

  _ChangeStatistique(event, statistique, decrease) {
    event.preventDefault()
    const currentCohesion = this.actor.system.statistiques.cohesion.valeur
    const currentVitalite = this.actor.system.statistiques.vitalite.valeur
    const currentConviction = this.actor.system.statistiques.conviction.valeur
    const maxStatistique = game.settings.get("rafales", "oneshot") ? 5 : 20
    switch (statistique) {
      case "cohesion":
        if (currentCohesion === 0 && decrease) return ui.notifications.warn("La cohésion est déjà à 0")
        if (decrease) this.actor.update({ "system.statistiques.cohesion.valeur": this.actor.system.statistiques.cohesion.valeur - 1 })
        else {
          if (currentCohesion < maxStatistique) this.actor.update({ "system.statistiques.cohesion.valeur": this.actor.system.statistiques.cohesion.valeur + 1 })
        }
        break
      case "vitalite":
        if (currentVitalite === 0 && decrease) return ui.notifications.warn("La vitalité est déjà à 0")
        if (currentCohesion > 0) return ui.notifications.warn("La vitalité ne peut pas être modifiée si la cohésion est supérieure à 0")
        if (decrease) this.actor.update({ "system.statistiques.vitalite.valeur": this.actor.system.statistiques.vitalite.valeur - 1 })
        else {
          if (currentVitalite < maxStatistique) this.actor.update({ "system.statistiques.vitalite.valeur": this.actor.system.statistiques.vitalite.valeur + 1 })
        }
        break
      case "conviction":
        if (currentConviction === 0 && decrease) return ui.notifications.warn("La conviction est déjà à 0")
        if (currentVitalite > 0) return ui.notifications.warn("La conviction ne peut pas être modifiée si la vitalité est supérieure à 0")
        if (decrease) this.actor.update({ "system.statistiques.conviction.valeur": this.actor.system.statistiques.conviction.valeur - 1 })
        else {
          if (currentConviction < maxStatistique) this.actor.update({ "system.statistiques.conviction.valeur": this.actor.system.statistiques.conviction.valeur + 1 })
        }
        break
    }
  }

  async _ResetStatistique(event, statistique, decrease) {
    event.preventDefault()
    let proceed
    let oldValue
    const oneshot = game.settings.get("rafales", "oneshot")
    switch (statistique) {
      case "cohesion":
        proceed = await foundry.applications.api.DialogV2.confirm({
          content: game.i18n.format("RAFALES.Warning.confirmReset", { name: "cohésion" }),
          rejectClose: false,
          modal: true,
        })
        if (!proceed) return
        oldValue = this.actor.system.statistiques.cohesion.valeur
        if (oneshot) this.actor.update({ "system.statistiques.cohesion.valeur": 5, "system.statistiques.connaissance.valeur": 0 })
        else this.actor.update({ "system.statistiques.cohesion.valeur": 20, "system.statistiques.connaissance.valeur": 0 })
        ChatMessage.create({
          user: game.user.id,
          content: game.i18n.format("RAFALES.Label.statisticRestored", { stat: "cohésion", oldValue }),
        })
        break
      case "espoir":
        proceed = await foundry.applications.api.DialogV2.confirm({
          content: game.i18n.format("RAFALES.Warning.confirmReset", { name: "vitalité" }),
          rejectClose: false,
          modal: true,
        })
        if (!proceed) return
        oldValue = this.actor.system.statistiques.vitalite.valeur
        if (oneshot) this.actor.update({ "system.statistiques.vitalite.valeur": 5, "system.statistiques.espoir.valeur": 0 })
        else this.actor.update({ "system.statistiques.vitalite.valeur": 20, "system.statistiques.espoir.valeur": 0 })
        ChatMessage.create({
          user: game.user.id,
          content: game.i18n.format("RAFALES.Label.statisticRestored", { stat: "vitalité", oldValue }),
        })
        break
      case "vif":
        proceed = await foundry.applications.api.DialogV2.confirm({
          content: game.i18n.format("RAFALES.Warning.confirmReset", { name: "conviction" }),
          rejectClose: false,
          modal: true,
        })
        if (!proceed) return
        oldValue = this.actor.system.statistiques.conviction.valeur
        if (oneshot) this.actor.update({ "system.statistiques.conviction.valeur": 5, "system.statistiques.vif.valeur": 0 })
        else this.actor.update({ "system.statistiques.conviction.valeur": 20, "system.statistiques.vif.valeur": 0 })
        ChatMessage.create({
          user: game.user.id,
          content: game.i18n.format("RAFALES.Label.statisticRestored", { stat: "conviction", oldValue }),
        })
        break
    }
  }
}
