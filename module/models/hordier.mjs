export default class RafalesHordier extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.HTMLField({ textSearch: true });
    return schema;
  }
}
