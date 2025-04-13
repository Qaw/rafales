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
    schema.croc = new fields.BooleanField()

    return schema
  }

  get displayRole() {
    return game.i18n.localize(SYSTEM.ROLES[this.role])
  }

  get imgRole() {
    return `systems/${SYSTEM.id}/assets/role_${this.role}.webp`
  }

  get isCroc() {
    return this.croc
  }

  get isScribe() {
    return this.role === "scribe"
  }

  get hasCarnet() {
    return this.parent.items.filter((item) => item.type === "carnet").length > 0
  }

  get carnet() {
    return this.parent.items.find((item) => item.type === "carnet")
  }
}
