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

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

const DEVELOPMENT_MODE = true

Hooks.once("init", function () {
  console.info("RAFALES | Initializing System")

  // Configuration
  globalThis.rafales = game.system
  game.system.CONST = SYSTEM

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

  game.settings.register("rafales", "oneshot", {
    name: "RAFALES.Setting.Oneshot.label",
    hint: "RAFALES.Setting.Oneshot.hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  })

  Handlebars.registerHelper("numeroLien", function (value) {
    return parseInt(value) + 1
  })

  console.info("RAFALES | System Initialized")
})

Hooks.once("ready", function () {
  console.info("RAFALES | Ready")

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
