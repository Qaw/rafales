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
      ui.notifications.info("La horde de référence n'a pas été correctement configurée.")
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

    if (roll.total <= 3) {
      resultType = "failure"
    } else if (roll.total === 6) {
      resultType = "success"
    } else resultType = "partialSuccess"

    roll.options.resultType = resultType
    roll.options.introText = roll._createIntroText()

    return roll
  }

  /**
   * Generates introductory text based on the roll type.
   *
   * @returns {string} The formatted introductory text for the roll.
   */
  _createIntroText() {
    let text

    text = "Jet de dé"

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
      actorId: this.actorId,
      actingCharName: this.actorName,
      actingCharImg: this.actorImage,
      introText: this.introText,
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
        introText: this.introText,
        actingCharName: this.actorName,
        actingCharImg: this.actorImage,
        ...messageData,
      },
      { rollMode: rollMode },
    )
  }
}
