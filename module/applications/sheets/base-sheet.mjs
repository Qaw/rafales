/**
 * Sheet class mixin to add common functions shared by all types of sheets.
 * @param {*} Base                        The base class.
 * @returns {DocumentSheetRafales}      Extended class.
 */
export const RafalesSheetMixin = (Base) => {
  const mixin = foundry.applications.api.HandlebarsApplicationMixin;
  return class DocumentSheetRafales extends mixin(Base) {
    /**
     * Different sheet modes.
     * @enum {number}
     */
    static SHEET_MODES = { EDIT: 0, PLAY: 1 };

    /** @override */
    static DEFAULT_OPTIONS = {
      form: { submitOnChange: true },
    };

    /**
     * The current sheet mode.
     * @type {number}
     */
    _sheetMode = this.constructor.SHEET_MODES.PLAY;

    /**
     * Is the sheet currently in 'Play' mode?
     * @type {boolean}
     */
    get isPlayMode() {
      return this._sheetMode === this.constructor.SHEET_MODES.PLAY;
    }

    /**
     * Is the sheet currently in 'Edit' mode?
     * @type {boolean}
     */
    get isEditMode() {
      return this._sheetMode === this.constructor.SHEET_MODES.EDIT;
    }
  };
};
