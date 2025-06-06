/**
 * Rafales Game System
 * Author: Kristov
 * Software License: MIT
 * Repository: https://github.com/Qaw/rafales
 */

// Configuration
import { SYSTEM } from "./module/config/system.mjs"
globalThis.SYSTEM = SYSTEM

// Import Modules
import * as applications from "./module/applications/_module.mjs"
import * as documents from "./module/documents/_module.mjs"
import * as models from "./module/models/_module.mjs"

import { initControlButtons } from "./module/control-buttons.mjs"
import { handleSocketEvent } from "./module/socket.mjs"
import { Macros } from "./module/macros.mjs"

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

const DEVELOPMENT_MODE = true

Hooks.once("init", function () {
  console.info("RAFALES | Initializing System")

  // Configuration
  globalThis.rafales = game.system
  game.system.CONST = SYSTEM

  // Expose the system API
  game.system.api = {
    applications,
    models,
    documents,
  }

  // Actor document configuration
  CONFIG.Actor.documentClass = documents.RafalesActor
  CONFIG.Actor.dataModels = {
    horde: models.RafalesHorde,
    hordier: models.RafalesHordier,
  }

  // Actor sheet configuration
  Actors.unregisterSheet("core", ActorSheet)
  DocumentSheetConfig.registerSheet(Actor, SYSTEM.id, applications.HordeSheet, { types: ["horde"], makeDefault: true })
  DocumentSheetConfig.registerSheet(Actor, SYSTEM.id, applications.HordierSheet, { types: ["hordier"], makeDefault: true })

  // Item document configuration
  CONFIG.Item.documentClass = documents.RafalesItem
  CONFIG.Item.dataModels = {
    carnet: models.RafalesCarnet,
  }

  // Item sheet configuration
  Items.unregisterSheet("core", ItemSheet)
  DocumentSheetConfig.registerSheet(Item, SYSTEM.id, applications.CarnetSheet, { types: ["carnet"], makeDefault: true })

  // Dice system configuration
  CONFIG.Dice.rolls.push(documents.RafalesRoll)

  game.settings.register("rafales", "oneshot", {
    name: "RAFALES.Setting.Oneshot.label",
    hint: "RAFALES.Setting.Oneshot.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  })

  game.settings.register("rafales", "displayInfoStats", {
    name: "RAFALES.Setting.DisplayInfoStats.label",
    hint: "RAFALES.Setting.DisplayInfoStats.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    requiresReload: false,
  })

  game.settings.register("rafales", "adversity", {
    name: "RAFALES.Setting.Adversity.label",
    hint: "RAFALES.Setting.Adversity.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 0,
    requiresReload: false,
  })

  game.settings.register("rafales", "hordeId", {
    name: "RAFALES.Setting.HordeId.label",
    hint: "RAFALES.Setting.HordeId.hint",
    scope: "world",
    config: true,
    type: String,
    default: undefined,
    requiresReload: false,
  })

  game.settings.register("rafales", "bookCharMax", {
    name: "RAFALES.Setting.BookCharMax.label",
    hint: "RAFALES.Setting.BookCharMax.hint",
    scope: "world",
    config: true,
    type: Number,
    default: 1000,
    requiresReload: true,
  })

  /**
   * World key used for statistics
   */
  game.settings.register("rafales", "worldKey", {
    name: "Unique world key",
    scope: "world",
    config: false,
    type: String,
    default: "",
  })

  Handlebars.registerHelper("numeroLien", function (value) {
    return parseInt(value) + 1
  })

  // Activate socket handler
  game.socket.on(`system.${SYSTEM.id}`, handleSocketEvent)

  initControlButtons()

  console.info("RAFALES | System Initialized")
})

Hooks.once("ready", function () {
  console.info("RAFALES | Ready")

  game.system.applicationAdversity = new applications.RafalesAdversity()
  if (game.user.isGM) game.system.applicationAdversity.render(true)

  if (!SYSTEM.DEV_MODE) {
    registerWorldCount("rafales")
  }
})

/**
 * Register world usage statistics
 * @param {string} registerKey
 */
function registerWorldCount(registerKey) {
  if (game.user.isGM) {
    let worldKey = game.settings.get(registerKey, "worldKey")
    if (worldKey === undefined || worldKey === "") {
      worldKey = foundry.utils.randomID(32)
      game.settings.set(registerKey, "worldKey", worldKey)
    }

    // Simple API counter
    const worldData = {
      register_key: registerKey,
      world_key: worldKey,
      foundry_version: `${game.release.generation}.${game.release.build}`,
      system_name: game.system.id,
      system_version: game.system.version,
    }

    let apiURL = "https://worlds.qawstats.info/worlds-counter"
    $.ajax({
      url: apiURL,
      type: "POST",
      data: JSON.stringify(worldData),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      async: false,
    })
  }
}

Hooks.on("updateSetting", async (setting, update, options, id) => {
  if (setting.key === "rafales.adversity") {
    game.system.applicationAdversity.adversity = setting.value
    if (game.user.isGM) game.system.applicationAdversity.render(true)
  }
  if (setting.key === "rafales.hordeId") {
    game.system.applicationAdversity.hordeId = setting.value
    if (game.user.isGM) game.system.applicationAdversity.render(true)
  }
})

Hooks.on("renderChatMessage", (message, html, data) => {
  if (game.user.isGM) {
    html.find(".button-spend").click((event) => {
      const hordeId = game.settings.get("rafales", "hordeId")
      const horde = game.actors.get(hordeId)
      if (!horde) {
        ui.notifications.info(game.i18n.localize("RAFALES.Warning.noHordeConfigured"))
        return
      }

      const btn = $(event.currentTarget)
      const action = btn.data("action")
      const stat = btn.data("stat")

      switch (stat) {
        case "cohesion":
          horde.update({ "system.statistiques.cohesion.valeur": horde.system.statistiques.cohesion.valeur - 1 })
          break
        case "vitalite":
          horde.update({ "system.statistiques.vitalite.valeur": horde.system.statistiques.vitalite.valeur - 1 })
          break
        case "conviction":
          horde.update({ "system.statistiques.conviction.valeur": horde.system.statistiques.conviction.valeur - 1 })
          break
        default:
          break
      }

      // Get the message
      const messageId = message._id
      const newMessage = game.messages.get(messageId)
      let roll = newMessage.rolls[0]
      roll.options.oneStatLost = false
      roll.options.oneStatLostChosen = true
      switch (stat) {
        case "cohesion":
          roll.options.oneStatLostStat = game.i18n.localize("RAFALES.Horde.FIELDS.statistiques.cohesion.label")
          break
        case "vitalite":
          roll.options.oneStatLostStat = game.i18n.localize("RAFALES.Horde.FIELDS.statistiques.vitalite.label")
          break
        case "conviction":
          roll.options.oneStatLostStat = game.i18n.localize("RAFALES.Horde.FIELDS.statistiques.conviction.label")
          break
        default:
          break
      }

      newMessage.update({ rolls: [JSON.stringify(roll)] })
    })
  }
})

/**
 * Create a macro when dropping an entity on the hotbar
 * Actor     - open actor sheet
 */
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (["Actor"].includes(data.type)) {
    Macros.createRafalesMacro(data, slot)
    return false
  }
})

/**
 * Met à jour la fenêtre adversité quand il y a une modification sur la horde liée
 */
Hooks.on("updateActor", (document, changed, options, userId) => {
  if (document.id === game.settings.get("rafales", "hordeId")) {
    if (game.user.isGM) game.system.applicationAdversity.render(true)
  }
})
