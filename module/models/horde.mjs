export default class RafalesHorde extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields
    const schema = {}

    const statistiqueField = (label, type, related) =>
      new fields.SchemaField(
        {
          type: new fields.StringField({ initial: type }),
          valeur: type === "vital" ? new fields.NumberField({ initial: 20, min: 0, max: 20 }) : new fields.NumberField({ initial: 0, min: 0, max: 5 }),
          related: new fields.StringField({ initial: related }),
        },
        { label }
      )

    schema.statistiques = new fields.SchemaField(
      Object.values(SYSTEM.STATISTIQUES).reduce((obj, stat) => {
        obj[stat.id] = statistiqueField(stat.label, stat.type, stat.related)
        return obj
      }, {})
    )
    return schema
  }

  /** @override */
  static LOCALIZATION_PREFIXES = ["RAFALES.Horde"]
}
