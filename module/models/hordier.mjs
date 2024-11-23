import { SYSTEM } from "../config/system.mjs"

export default class RafalesHordier extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields
    const schema = {}

    schema.horde = new fields.StringField()
    schema.biographie = new fields.HTMLField({ textSearch: true })
    schema.liens = new fields.ArrayField(
      new fields.SchemaField({
        nom: new fields.StringField(),
        lien: new fields.StringField(),
      }),
    )
    schema.notes = new fields.HTMLField({ textSearch: true })
    schema.role = new fields.StringField({
      choices: Object.fromEntries(Object.entries(SYSTEM.ROLES).map(([key, value]) => [key, { label: `${value}` }])),
    })

    return schema
  }

  get displayRole() {
    return game.i18n.localize(SYSTEM.ROLES[this.role])
  }
}
