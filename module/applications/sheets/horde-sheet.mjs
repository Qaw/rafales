import RafalesActorSheet from "./base-actor-sheet.mjs"

export default class HordeSheet extends RafalesActorSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["horde"],
    position: { height: 1200, width: 1000, top: 100, left: 200 },
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
    context.vitalite = context.actor.system.statistiques.vitalite
    context.conviction = context.actor.system.statistiques.conviction
    context.connaissance = context.actor.system.statistiques.connaissance
    context.espoir = context.actor.system.statistiques.espoir
    context.vif = context.actor.system.statistiques.vif

    // Name and img.
    context.header = {
      name: context.isPlayMode ? context.actor.name : context.actor.name,
      img: context.isPlayMode ? context.actor.img : context.actor.img,
    }

    return context
  }
}
