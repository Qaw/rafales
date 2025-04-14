export default class RafalesCarnet extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields
    const schema = {}
    schema.notes = new fields.HTMLField({ textSearch: true })
    return schema
  }

  /** @inheritDoc */
  async _preUpdate(changes, options, user) {
    // Limit the size of the notes field to x characters
    const charMax = game.settings.get("rafales", "bookCharMax")
    changes.system.notes = changes.system.notes.substring(0, charMax)
    super._preUpdate(changes, options, user)
  }
}
