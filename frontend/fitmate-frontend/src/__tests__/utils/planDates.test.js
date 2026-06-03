import { describe, expect, it } from 'vitest'
import {
  computeDurationWeeks,
  computeInclusiveDays,
  defaultEndDateFrom,
} from '../../utils/planDates'

describe('planDates', () => {
  it('computeDurationWeeks 按起止日期计算周数', () => {
    expect(computeDurationWeeks('2026-06-03', '2026-07-01')).toBe(5)
    expect(computeDurationWeeks('2026-06-03', '2026-08-03')).toBe(9)
    expect(computeDurationWeeks('2026-06-03', '2026-06-03')).toBe(1)
  })

  it('computeInclusiveDays 含首尾日', () => {
    expect(computeInclusiveDays('2026-06-03', '2026-06-03')).toBe(1)
    expect(computeInclusiveDays('2026-06-03', '2026-06-10')).toBe(8)
  })

  it('defaultEndDateFrom 默认 4 周', () => {
    expect(defaultEndDateFrom('2026-06-03', 4)).toBe('2026-06-30')
  })
})
