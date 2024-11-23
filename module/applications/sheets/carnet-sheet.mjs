const { HandlebarsApplicationMixin } = foundry.applications.api

export default class CarnetSheet extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["rafales", "item", "carnet"],
    position: { width: 500, height: 500 },
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
    },
  }

  /** @override */
  static PARTS = {
    form: {
      template: "systems/rafales/templates/carnet.hbs",
    },
  }

  /** @override */
  async _prepareContext() {
    const context = {
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      item: this.document,
      system: this.document.system,
      source: this.document.toObject(),
      enrichedNotes: await TextEditor.enrichHTML(this.document.system.notes, { async: true }),
    }
    return context
  }
}
