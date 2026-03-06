/**
 * Unified export for all mock facade cases.
 */
import { case01 } from './mock/case-01'
import { case02 } from './mock/case-02'
import { case03 } from './mock/case-03'
import type { FacadeCase } from './types'

export { case01, case02, case03 }
export type { FacadeCase }

export const allCases: FacadeCase[] = [case01, case02, case03]

/**
 * Retrieves a facade case by its ID.
 */
export function getCaseById(id: string): FacadeCase | undefined {
  return allCases.find((c) => c.id === id)
}
