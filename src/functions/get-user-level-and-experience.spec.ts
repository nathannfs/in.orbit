import { describe, expect, it } from 'vitest'
import { makeUser } from '../../tests/factories/make-user'
import { getUserLevelAndExperience } from './get-user-level-and-experience'
import {
  calculateLevelFromExperience,
  calculateTotalExperienceForLevel,
} from '../modules/gamification'

describe('get user level and experience', () => {
  it('should be able to get a user level and experience', async () => {
    const user = await makeUser({ experience: 200 })

    const result = await getUserLevelAndExperience({ userId: user.id })

    const level = calculateLevelFromExperience(200)

    expect(result).toEqual({
      experience: 200,
      level,
      experienceToNextLevel: calculateTotalExperienceForLevel(level),
    })
  })
})
