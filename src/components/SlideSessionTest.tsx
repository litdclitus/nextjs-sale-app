"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import authApiRequest from "@/apiRequests/auth";
import { Button } from "@/components/ui/button";

export default function SlideSessionTest() {
  const { sessionToken, expiresAt, isAuthenticated } = useAuthStore();
  const [isRenewing, setIsRenewing] = useState(false);
  const [lastRenewal, setLastRenewal] = useState<string>("");
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  const [renewalResult, setRenewalResult] = useState<string>("");

  // Calculate time until expiry
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expires = new Date(expiresAt).getTime();
      const remaining = expires - now;
      setTimeUntilExpiry(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Format time remaining
  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return "Expired";

    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Test slide session manually
  const handleSlideSession = async () => {
    if (!isAuthenticated) {
      setRenewalResult("❌ Not authenticated");
      return;
    }

    setIsRenewing(true);
    setRenewalResult("🔄 Renewing session...");

    try {
      const result = await authApiRequest.slideSessionClient();
      setLastRenewal(new Date().toLocaleTimeString());
      setRenewalResult(
        `✅ Session renewed successfully! New expiry: ${result.data.expiresAt}`
      );
    } catch (error) {
      console.error("Slide session error:", error);
      setRenewalResult(
        `❌ Failed to renew session: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRenewing(false);
    }
  };

  // Get status color based on time remaining
  const getStatusColor = (): string => {
    if (timeUntilExpiry <= 0) return "text-red-500";
    if (timeUntilExpiry <= 300000) return "text-yellow-500"; // 5 minutes
    if (timeUntilExpiry <= 600000) return "text-orange-500"; // 10 minutes
    return "text-green-500";
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">🔒 Slide Session Test</h3>
        <p className="text-gray-600">
          Please log in to test slide session functionality.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">🔄 Slide Session Test</h3>

      <div className="space-y-4">
        {/* Token Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className={`font-mono ${getStatusColor()}`}>
              {isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Token:</span>
            <span className="font-mono text-sm text-gray-600">
              {sessionToken
                ? `${sessionToken.substring(0, 20)}...`
                : "No token"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Expires At:</span>
            <span className="font-mono text-sm">{expiresAt || "Not set"}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium">Time Remaining:</span>
            <span className={`font-mono text-sm font-bold ${getStatusColor()}`}>
              {formatTimeRemaining(timeUntilExpiry)}
            </span>
          </div>
        </div>

        {/* Auto-renewal status */}
        <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
          <p className="text-sm text-blue-700">
            <strong>Auto-renewal:</strong> Token will be automatically renewed
            when making API calls if it expires within 5 minutes.
          </p>
        </div>

        {/* Manual renewal */}
        <div className="space-y-2">
          <Button
            onClick={handleSlideSession}
            disabled={isRenewing}
            className="w-full"
          >
            {isRenewing ? "🔄 Renewing..." : "🔄 Manual Slide Session"}
          </Button>

          {lastRenewal && (
            <p className="text-sm text-gray-600">
              Last manual renewal: {lastRenewal}
            </p>
          )}

          {renewalResult && (
            <div className="p-3 bg-gray-50 rounded border text-sm">
              {renewalResult}
            </div>
          )}
        </div>

        {/* Warning for tokens expiring soon */}
        {timeUntilExpiry > 0 && timeUntilExpiry <= 300000 && (
          <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <p className="text-sm text-yellow-700">
              ⚠️ <strong>Token expires soon!</strong> It will be automatically
              renewed on the next API call.
            </p>
          </div>
        )}

        {/* Expired token warning */}
        {timeUntilExpiry <= 0 && (
          <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
            <p className="text-sm text-red-700">
              🚨 <strong>Token has expired!</strong> You may be logged out on
              the next API call.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

