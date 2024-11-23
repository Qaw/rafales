export default class RafalesCarnet extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields
    const schema = {}
    schema.notes = new fields.HTMLField({ textSearch: true })
    return schema
  }

  /** @inheritDoc */
  async _preUpdate(changes, options, user) {
    console.log("RafalesCarnet._preUpdate", changes, options, user)
    changes.system.notes = changes.system.notes.substring(0, 1000)
    super._preUpdate(changes, options, user)
  }
}
