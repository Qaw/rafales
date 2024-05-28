import { RafalesSheetMixin } from "./base-sheet.mjs";

export default class HordeSheet extends RafalesSheetMixin(foundry.applications.sheets.ActorSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["rafales", "actor", "horde"],
    position: { height: 1200, width: 1000, top: 100, left: 200 }
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/rafales/templates/horde.hbs",
    },
  };

  /** @override */
  async _prepareContext(options) {
    const doc = this.document;
    const src = doc.toObject();
    const rollData = doc.getRollData();

    const context = {
      document: doc,
      config: CONFIG.SYSTEM,
      cohesion: doc.system.statistiques.cohesion,
      vitalite: doc.system.statistiques.vitalite,
      conviction: doc.system.statistiques.conviction,
      connaissance: doc.system.statistiques.connaissance,
      espoir: doc.system.statistiques.espoir,
      vif: doc.system.statistiques.vif,
      isEditMode: this.isEditMode,
      isPlayMode: this.isPlayMode,
      isEditable: this.isEditable,
    };
    // Name and img.
    context.header = {
      name: context.isPlayMode ? doc.name : src.name,
      img: context.isPlayMode ? doc.img : src.img,
    };

    return context;
  }
}
