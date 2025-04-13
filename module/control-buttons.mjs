/**
 * Menu spécifique au système
 */
export function initControlButtons() {
  CONFIG.Canvas.layers.rafales = { layerClass: ControlsLayer, group: "primary" }

  Hooks.on("getSceneControlButtons", (btns) => {
    let menu = []

    if (game.user.isGM) {
      menu.push({
        name: "gm-adversite",
        title: game.i18n.localize("RAFALES.Adversity.title"),
        icon: "adversite",
        button: true,
        onClick: () => {
          if (!foundry.applications.instances.has("rafales-application-adversity")) {
            game.system.applicationAdversity.render(true)
          } else game.system.applicationAdversity.close()
        },
      })
    }

    btns.push({
      name: "rafales",
      title: "Rafales",
      icon: "rafales",
      layer: "rafales",
      tools: menu,
    })
  })
}
