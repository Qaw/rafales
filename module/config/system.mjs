import * as HORDE from "./horde.mjs"
import * as HORDIER from "./hordier.mjs"

export const SYSTEM_ID = "rafales"
export const DEV_MODE = true

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  id: SYSTEM_ID,
  DEV_MODE,
  STATISTIQUES: HORDE.STATISTIQUES,
  ROLES: HORDIER.ROLES,
}
