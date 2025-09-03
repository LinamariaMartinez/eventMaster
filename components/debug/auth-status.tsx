"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function AuthStatus() {
  const { user, loading, isAuthenticated, refresh } = useAuth();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Authentication Status
          <Button variant="outline" size="sm" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge variant={isAuthenticated ? "default" : "destructive"}>
            {loading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
        
        {user && (
          <>
            <div className="flex items-center justify-between">
              <span>User ID:</span>
              <span className="text-xs font-mono">{user.id.substring(0, 8)}...</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            
            {user.user_metadata?.name && (
              <div className="flex items-center justify-between">
                <span>Name:</span>
                <span className="text-sm">{user.user_metadata.name}</span>
              </div>
            )}
          </>
        )}
        
        <div className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}