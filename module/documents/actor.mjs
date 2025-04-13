import RafalesRoll from "./roll.mjs"

export default class RafalesActor extends Actor {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user)

    let updates = { img: "systems/rafales/assets/token_horde.webp" }

    // Mode One Shot
    if (this.type === "horde" && game.settings.get("rafales", "oneshot")) {
      Object.assign(updates, {
        "system.statistiques.cohesion.valeur": 5,
        "system.statistiques.vitalite.valeur": 5,
        "system.statistiques.conviction.valeur": 5,
      })
    }

    this.updateSource(updates)
  }

  async roll() {
    let roll = await RafalesRoll.prompt({
      actorId: this.id,
      actorName: this.name,
      actorImage: this.img,
    })

    if (!roll) return null

    await roll.toMessage({}, {})
  }
}
