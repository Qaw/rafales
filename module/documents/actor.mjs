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
}
