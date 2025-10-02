/**
 * Mutation pour initialiser les utilisateurs de test
 * ATTENTION: Cette mutation est uniquement pour l'environnement de test
 */

import { mutation } from '../_generated/server';
import { v } from 'convex/values';

// Liste des Clerk IDs autorisés pour les tests
const AUTHORIZED_TEST_USER_IDS = [
  'user_33PztnpdAgsfBOB59IH4lmwu2cO',
  'user_33Q1zl6LLdBVaueYk8H2PIuoQSM', 
  'user_33Q21amkQS07uf5qXWTKq0H2MM6',
  'user_33Q23Y7DiRrUZ5w5rhTcDCdWQ8K',
  'user_33Q25cZ03llOpcE4DQjUjvjxsZ8',
  'user_33Q27ef25z0KhVV1YwnTONMXDmk',
  'user_33Q29ap3iiP0hgoAmnCIlXTEDEs',
  'user_33Q2BPzlKOBHh1eLWmJyDeGCbs7',
  'user_33Q2D2mkNfYI58wFoNG9elCqxo6',
  'user_33Q2EiI4tXFBBoHQtDqsepGyY2y',
  'user_33Q2GMn6KMAHaNE2Ju4CZkwcAVe',
  'user_33Q2KLmti4WIQxZx32jRWzzgBwG',
  'user_33Q2ISeCfcF9iFPA4of9t10rbOk',
  'user_33Q2LqTRmTMySs9DLoZ5sCgRXw4',
  'user_33Q2NEtQOUQnqkYJKBz4pqO8VvP',
  'user_33QYvuNsEMdjg3nNVKHjrmxn7UO',
  'user_33QYxvIw0eYs2xhoo53lZzBWSCT',
  'user_33QZ2j9nHbNVDkeJ87TvuXZVt9a',
  'user_33QZ5HiQ3pCxUvjeOE6cTSM5xk2',
  'user_33QZ7xfiIpg4UOs5JLsmhpzpSTA',
];

export const initTestUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    // Vérifier que c'est bien un user de test autorisé
    if (!AUTHORIZED_TEST_USER_IDS.includes(args.userId)) {
      throw new Error('Unauthorized test user ID');
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', args.userId))
      .first();

    if (existingUser) {
      console.log(`User ${args.displayName} already exists`);
      return { id: existingUser._id, created: false, message: 'User already exists' };
    }

    // Créer l'utilisateur avec les préférences de base
    const now = Date.now();
    const id = await ctx.db.insert('users', {
      userId: args.userId,
      createdAt: now,
      updatedAt: now,
      locale: 'fr-FR',
      platform: 'test',
      appVersion: '1.0.0-test',
      displayName: args.displayName,
      preferences: {
        email: args.email,
        language: 'fr',
        onboardingCompleted: false, // Ils devront passer par l'onboarding
        notifications: {
          mealReminders: true,
          dailySummary: true,
        },
        units: {
          weight: 'kg',
          height: 'cm',
        },
      },
    });

    return { 
      id, 
      created: true, 
      message: `Test user ${args.displayName} created successfully` 
    };
  },
});

// Mutation pour récupérer tous les utilisateurs de test
export const getTestUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const testUsers = [];
    
    for (const userId of AUTHORIZED_TEST_USER_IDS) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_userId', (q) => q.eq('userId', userId))
        .first();
      
      if (user) {
        testUsers.push({
          userId: user.userId,
          displayName: user.displayName,
          createdAt: user.createdAt,
          onboardingCompleted: user.preferences?.onboardingCompleted || false,
        });
      }
    }
    
    return testUsers;
  },
});

// Mutation pour réinitialiser un utilisateur de test (reset onboarding)
export const resetTestUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // Vérifier que c'est bien un user de test autorisé
    if (!AUTHORIZED_TEST_USER_IDS.includes(userId)) {
      throw new Error('Unauthorized test user ID');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    if (!user) {
      throw new Error('Test user not found');
    }

    // Reset les préférences utilisateur
    await ctx.db.patch(user._id, {
      updatedAt: Date.now(),
      preferences: {
        ...(user.preferences as any || {}),
        onboardingCompleted: false,
        // Reset aussi les données d'onboarding
        gender: undefined,
        height: undefined,
        weight: undefined,
        targetWeight: undefined,
        activityLevel: undefined,
        nutritionGoals: undefined,
      },
    });

    return { success: true, message: `Test user reset successfully` };
  },
});
