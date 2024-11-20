import RafalesAdversity from "./applications/adversity.mjs"

/**
 * Handles socket events based on the provided action.
 *
 * @param {Object} [params={}] The parameters for the socket event.
 * @param {string|null} [params.action=null] The action to be performed.
 * @returns {*} The result of the action handler, if applicable.
 */
export function handleSocketEvent({ action = null } = {}) {
  console.debug("handleSocketEvent", action)
  switch (action) {
    case "increaseAdversityByOne":
      if (game.user.isGM) {
        return RafalesAdversity.increaseAdversityByOne()
      }
  }
}
