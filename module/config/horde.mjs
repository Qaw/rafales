export const STATISTIQUES = Object.freeze({
  cohesion: {
    id: "cohesion",
    label: "RAFALES.statistiques.cohesion.label",
    type: "vital",
    related: "connaissance"
  },
  vitalite: {
    id: "vitalite",
    label: "RAFALES.statistiques.vitalite.label",
    type: "vital",
    related: "espoir"
  },
  conviction: {
    id: "conviction",
    label: "RAFALES.statistiques.conviction.label",
    type: "vital",
    related: "vif"
  },
  connaissance: {
    id: "connaissance",
    label: "RAFALES.connaissance.conviction.label",
    type: "roleplay",
    related: "cohesion"
  },
  espoir: {
    id: "espoir",
    label: "RAFALES.statistiques.espoir.label",
    type: "roleplay",
    related: "vitalite"
  },
  vif: {
    id: "vif",
    label: "RAFALES.statistiques.vif.label",
    type: "roleplay",
    related: "conviction"
  }
});
