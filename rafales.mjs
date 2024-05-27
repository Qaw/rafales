/**
 * Rafales Game System
 * Author: Kristov
 * Software License: MIT
 * Repository: https://github.com/Qaw/rafales
 */

// Configuration
import { SYSTEM } from "./module/config/system.mjs";
globalThis.SYSTEM = SYSTEM;

// Import Modules
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as models from "./module/models/_module.mjs";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

const DEVELOPMENT_MODE = true;

Hooks.once("init", function() {
  console.log(`Initializing Rafales Game System`);

  // Configuration
  globalThis.rafales = game.system;
  game.system.CONST = SYSTEM;

  // Actor document configuration
  CONFIG.Actor.documentClass = documents.RafalesActor;
  CONFIG.Actor.dataModels = {
    horde: models.RafalesHorde,
    hordier: models.RafalesHordier
  };

  // Actor sheet configuration
  Actors.unregisterSheet("core", ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, SYSTEM.id, applications.HordeSheet, {
    types: ["horde"],
    makeDefault: true,
    label: "RAFALES.sheets.horde"
  });
  DocumentSheetConfig.registerSheet(Actor, SYSTEM.id, applications.HordierSheet, {
    types: ["hordier"],
    makeDefault: true,
    label: "RAFALES.sheets.hordier"
  });
});

