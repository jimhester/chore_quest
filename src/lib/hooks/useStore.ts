"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import * as store from "@/lib/data/store";
import { Profile, Chore, ChoreCompletion, Reward, RewardRedemption } from "@/lib/data/types";

// Simple event emitter to trigger re-renders across components
let listeners: Array<() => void> = [];
function emitChange() {
  listeners.forEach((l) => l());
}
function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// Snapshot counter to trigger useSyncExternalStore re-renders
let snapshotVersion = 0;
function getSnapshot() {
  return snapshotVersion;
}
function getServerSnapshot() {
  return 0;
}

function bump() {
  snapshotVersion++;
  emitChange();
}

export function useStore() {
  // Subscribe to changes so all consumers re-render together
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getProfiles = useCallback(() => store.getProfiles(), []);
  const getProfileByName = useCallback((name: string) => store.getProfileByName(name), []);
  const getProfileById = useCallback((id: string) => store.getProfileById(id), []);

  const updateProfile = useCallback((id: string, updates: Partial<Profile>) => {
    const result = store.updateProfile(id, updates);
    bump();
    return result;
  }, []);

  const getChores = useCallback(() => store.getChores(), []);
  const getAllChores = useCallback(() => store.getAllChores(), []);

  const createChore = useCallback((chore: Omit<Chore, "id">) => {
    const result = store.createChore(chore);
    bump();
    return result;
  }, []);

  const updateChore = useCallback((id: string, updates: Partial<Chore>) => {
    const result = store.updateChore(id, updates);
    bump();
    return result;
  }, []);

  const getCompletionsForDate = useCallback(
    (profileId: string, date: string) => store.getCompletionsForDate(profileId, date),
    []
  );

  const completeChore = useCallback(
    (profileId: string, choreId: string, points: number) => {
      const result = store.completeChore(profileId, choreId, points);
      bump();
      return result;
    },
    []
  );

  const deleteCompletion = useCallback(
    (completionId: string) => {
      const result = store.deleteCompletion(completionId);
      bump();
      return result;
    },
    []
  );

  const getRewards = useCallback((profileId?: string) => store.getRewards(profileId), []);
  const getAllRewards = useCallback(() => store.getAllRewards(), []);

  const createReward = useCallback((reward: Omit<Reward, "id">) => {
    const result = store.createReward(reward);
    bump();
    return result;
  }, []);

  const updateReward = useCallback((id: string, updates: Partial<Reward>) => {
    const result = store.updateReward(id, updates);
    bump();
    return result;
  }, []);

  const redeemReward = useCallback(
    (profileId: string, rewardId: string) => {
      const result = store.redeemReward(profileId, rewardId);
      bump();
      return result;
    },
    []
  );

  const resetAllData = useCallback(() => {
    store.resetAllData();
    bump();
  }, []);

  return {
    getProfiles,
    getProfileByName,
    getProfileById,
    updateProfile,
    getChores,
    getAllChores,
    createChore,
    updateChore,
    getCompletionsForDate,
    getAllCompletions: store.getAllCompletions,
    completeChore,
    deleteCompletion,
    getRewards,
    getAllRewards,
    createReward,
    updateReward,
    redeemReward,
    getAllRedemptions: store.getAllRedemptions,
    getStreakHistory: store.getStreakHistory,
    upsertStreakHistory: store.upsertStreakHistory,
    recalculateStreak: useCallback((profileId: string) => {
      const result = store.recalculateStreak(profileId);
      bump();
      return result;
    }, []),
    useStreakFreeze: useCallback((profileId: string, date: string) => {
      const result = store.useStreakFreeze(profileId, date);
      bump();
      return result;
    }, []),
    resetAllData,
  };
}
