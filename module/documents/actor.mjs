import RafalesRoll from "./roll.mjs"

export default class RafalesActor extends Actor {
  constructor(data, context) {
    super(data, context)

    // Mode One Shot
    if (data.type === "horde") {
      if (game.settings.get("rafales", "oneshot")) {
        data.system.statistiques.cohesion.valeur = 5
        data.system.statistiques.vitalite.valeur = 5
        data.system.statistiques.conviction.valeur = 5
      }
    }
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
