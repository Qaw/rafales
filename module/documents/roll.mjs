export default class RafalesRoll extends Roll {
  /**
   * The HTML template path used to render dice checks of this type
   * @type {string}
   */
  static CHAT_TEMPLATE = "systems/rafales/templates/chat-message.hbs"

  get resultType() {
    return this.options.resultType
  }

  get isFailure() {
    return this.resultType === "failure"
  }

  get isSuccess() {
    return this.resultType === "success"
  }

  get isPartialSuccess() {
    return this.resultType === "partialSuccess"
  }

  get actorId() {
    return this.options.actorId
  }

  get actorName() {
    return this.options.actorName
  }

  get actorImage() {
    return this.options.actorImage
  }

  get introText() {
    return this.options.introText
  }

  get introTextMJ() {
    return this.options.introTextMJ
  }

  get difficulty() {
    return this.options.difficulty
  }

  get oneStatLost() {
    return this.options.oneStatLost
  }

  static async prompt(options = {}) {
    // Restreint le choix en fonction de la horde de référence si elle existe
    let choiceDangerosite
    const hordeId = game.settings.get("rafales", "hordeId")
    if (hordeId) {
      const nbStatistiquesZero = game.actors.get(hordeId).system.nbStatistiquesZero
      if (nbStatistiquesZero === 0) {
        choiceDangerosite = { difficile: "Difficile", dangereux: "Dangereux", sacrificiel: "Sacrificiel" }
      } else if (nbStatistiquesZero === 1) {
        choiceDangerosite = { dangereux: "Dangereux", sacrificiel: "Sacrificiel" }
      } else if (nbStatistiquesZero === 2) {
        choiceDangerosite = { sacrificiel: "Sacrificiel" }
      } else ui.notifications.info("La horde n'a plus de statistiques vitales.")
    } else {
      // ui.notifications.info("La horde de référence n'a pas été correctement configurée.")
      choiceDangerosite = { difficile: "Difficile", dangereux: "Dangereux", sacrificiel: "Sacrificiel" }
    }

    let dialogContext = {
      choiceDangerosite,
    }
    const content = await renderTemplate("systems/rafales/templates/roll-dialog.hbs", dialogContext)

    const dialogTitle = game.i18n.localize("RAFALES.Roll.dialogTitle")
    const dialogButton = game.i18n.localize("RAFALES.Roll.dialogButton")
    const rollContext = await foundry.applications.api.DialogV2.wait({
      window: { title: dialogTitle },
      classes: ["rafales"],
      content,
      buttons: [
        {
          label: dialogButton,
          callback: (event, button, dialog) => {
            const output = Array.from(button.form.elements).reduce((obj, input) => {
              if (input.name) obj[input.name] = input.value
              return obj
            }, {})
            return output
          },
        },
      ],
      rejectClose: false, // Click on Close button will not launch an error
    })

    // If the user cancels the dialog, exit
    if (rollContext === null) return

    const rollData = {
      actorId: options.actorId,
      actorName: options.actorName,
      actorImage: options.actorImage,
      ...rollContext,
    }

    const roll = new this("1d6", options.data, rollData)

    await roll.evaluate()

    let resultType
    let oneStatLost = false

    switch (rollData.dangerosite) {
      case "difficile":
        if (roll.total <= 3) {
          resultType = "failure"
          const currentAdversity = game.settings.get("rafales", "adversity")
          game.settings.set("rafales", "adversity", currentAdversity + 1)
        } else if (roll.total === 6) {
          resultType = "success"
        } else {
          resultType = "partialSuccess"
        }
        break
      case "dangereux":
        if (roll.total <= 3) {
          resultType = "failure"
          oneStatLost = true
        } else if (roll.total === 6) {
          resultType = "success"
        } else {
          resultType = "partialSuccess"
          const currentAdversity = game.settings.get("rafales", "adversity")
          game.settings.set("rafales", "adversity", currentAdversity + 1)
        }
        break
      case "sacrificiel":
        if (roll.total <= 3) {
          resultType = "failure"
          let horde = await game.actors.get(game.settings.get("rafales", "hordeId"))
          if (horde) {
            await horde.update({
              "system.statistiques.cohesion.valeur": horde.system.statistiques.cohesion.valeur - 1,
              "system.statistiques.conviction.valeur": horde.system.statistiques.conviction.valeur - 1,
              "system.statistiques.vitalite.valeur": horde.system.statistiques.vitalite.valeur - 1,
            })
          }
        } else if (roll.total === 6) {
          resultType = "success"
        } else {
          oneStatLost = true
          resultType = "partialSuccess"
        }
        break
    }

    roll.options.difficulty = rollData.dangerosite
    roll.options.resultType = resultType
    roll.options.oneStatLost = oneStatLost
    roll.options.introText = roll._createIntroText()
    roll.options.introTextMJ = roll._createIntroTextMJ()

    return roll
  }

  /**
   * Generates introductory text based on the roll type.
   *
   * @returns {string} The formatted introductory text for the roll.
   */
  _createIntroText() {
    return game.i18n.format("RAFALES.Roll.introText", { difficulty: this.difficulty })
  }

  _createIntroTextMJ() {
    let text = ""
    if (this.difficulty === "difficile" && this.resultType === "failure") {
      text = "L'adversité augmente"
    }
    if (this.difficulty === "dangereux" && this.resultType === "partialSuccess") {
      text = "L'adversité augmente"
    }
    if (this.difficulty === "dangereux" && this.resultType === "failure") {
      text = "Une statistique vitale diminue"
    }
    if (this.difficulty === "sacrificiel" && this.resultType === "partialSuccess") {
      text = "Une statistique vitale diminue"
    }
    if (this.difficulty === "sacrificiel" && this.resultType === "failure") {
      text = "Toutes les statistiques <br> vitales diminuent"
    }
    return text
  }

  /** @override */
  async render(chatOptions = {}) {
    let chatData = await this._getChatCardData(chatOptions.isPrivate)
    return await renderTemplate(this.constructor.CHAT_TEMPLATE, chatData)
  }

  async _getChatCardData(isPrivate) {
    const cardData = {
      css: [SYSTEM.id, "dice-roll"],
      data: this.data,
      diceTotal: this.dice.reduce((t, d) => t + d.total, 0),
      isGM: game.user.isGM,
      formula: this.formula,
      total: this.total,
      isFailure: this.isFailure,
      isSuccess: this.isSuccess,
      isPartialSuccess: this.isPartialSuccess,
      oneStatLost: this.oneStatLost,
      actorId: this.actorId,
      actingCharName: this.actorName,
      actingCharImg: this.actorImage,
      introText: this.introText,
      introTextMJ: this.introTextMJ,
      resultType: this.resultType,
      isPrivate: isPrivate,
    }
    cardData.cssClass = cardData.css.join(" ")
    cardData.tooltip = isPrivate ? "" : await this.getTooltip()
    return cardData
  }

  /**
   * Converts the roll result to a chat message.
   *
   * @param {Object} [messageData={}] Additional data to include in the message.
   * @param {Object} options Options for message creation.
   * @param {string} options.rollMode The mode of the roll (e.g., public, private).
   * @param {boolean} [options.create=true] Whether to create the message.
   * @returns {Promise} - A promise that resolves when the message is created.
   */
  async toMessage(messageData = {}, { rollMode, create = true } = {}) {
    super.toMessage(
      {
        isSuccess: this.resultType === "success",
        isPartialSuccess: this.resultType === "partialSuccess",
        isFailure: this.resultType === "failure",
        oneStatLost: this.oneStatLost,
        introText: this.introText,
        introTextMJ: this.introTextMJ,
        actingCharName: this.actorName,
        actingCharImg: this.actorImage,
        ...messageData,
      },
      { rollMode: rollMode },
    )
  }
}
