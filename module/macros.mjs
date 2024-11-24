export class Macros {
  static createRafalesMacro = async function (dropData, slot) {
    if (dropData.type === "Actor") {
      const actor = await fromUuid(dropData.uuid)
      let command
      if (actor.type === "horde") {
        command = `await Hotbar.toggleDocumentSheet("Actor.${actor.id}")`
      } else {
        command = `if (event?.shiftKey) game.actors.get("${actor.id}").sheet.render(true)\nelse game.actors.get("${actor.id}").roll()`
      }
      this.createMacro(slot, actor.name, command, actor.img)
    }
  }

  /**
   * Create a macro
   *  All macros are flaged with a cthack.macro flag at true
   * @param {*} slot
   * @param {*} name
   * @param {*} command
   * @param {*} img
   */
  static createMacro = async function (slot, name, command, img) {
    let macro = game.macros.contents.find((m) => m.name === name && m.command === command)
    if (!macro) {
      macro = await Macro.create(
        {
          name: name,
          type: "script",
          img: img,
          command: command,
          flags: { "rafales.macro": true },
        },
        { displaySheet: false },
      )
      game.user.assignHotbarMacro(macro, slot)
    }
  }
}
