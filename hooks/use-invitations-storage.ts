"use client";

import { useState, useEffect, useCallback } from "react";
import { invitationStorage, type Invitation } from "@/lib/storage";

export interface UseInvitationsStorageReturn {
  invitations: Invitation[];
  loading: boolean;
  error: string | null;
  addInvitation: (invitation: Omit<Invitation, "id" | "createdAt" | "updatedAt">) => Invitation;
  updateInvitation: (id: string, updates: Partial<Omit<Invitation, "id" | "createdAt">>) => Invitation | null;
  removeInvitation: (id: string) => boolean;
  getInvitation: (id: string) => Invitation | null;
  getInvitationByUrl: (publicUrl: string) => Invitation | null;
  refreshInvitations: () => void;
}

export function useInvitationsStorage(): UseInvitationsStorageReturn {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvitations = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const loadedInvitations = invitationStorage.getAll();
      setInvitations(loadedInvitations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading invitations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const addInvitation = useCallback((invitationData: Omit<Invitation, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newInvitation = invitationStorage.add(invitationData);
      setInvitations(current => [...current, newInvitation]);
      setError(null);
      return newInvitation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error adding invitation";
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  const updateInvitation = useCallback((id: string, updates: Partial<Omit<Invitation, "id" | "createdAt">>) => {
    try {
      const updatedInvitation = invitationStorage.update(id, updates);
      if (updatedInvitation) {
        setInvitations(current => 
          current.map(invitation => invitation.id === id ? updatedInvitation : invitation)
        );
        setError(null);
      }
      return updatedInvitation;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error updating invitation";
      setError(errorMsg);
      return null;
    }
  }, []);

  const removeInvitation = useCallback((id: string) => {
    try {
      const success = invitationStorage.remove(id);
      if (success) {
        setInvitations(current => current.filter(invitation => invitation.id !== id));
        setError(null);
      }
      return success;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error removing invitation";
      setError(errorMsg);
      return false;
    }
  }, []);

  const getInvitation = useCallback((id: string) => {
    try {
      return invitationStorage.getById(id);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error getting invitation";
      setError(errorMsg);
      return null;
    }
  }, []);

  const getInvitationByUrl = useCallback((publicUrl: string) => {
    try {
      return invitationStorage.getByPublicUrl(publicUrl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Error getting invitation by URL";
      setError(errorMsg);
      return null;
    }
  }, []);

  const refreshInvitations = useCallback(() => {
    loadInvitations();
  }, [loadInvitations]);

  return {
    invitations,
    loading,
    error,
    addInvitation,
    updateInvitation,
    removeInvitation,
    getInvitation,
    getInvitationByUrl,
    refreshInvitations,
  };
}