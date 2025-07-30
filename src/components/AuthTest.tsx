"use client";

import { useAuth, useLogout } from "@/hooks/useAuth";

export default function AuthTest() {
  // get state and actions from store
  const {
    sessionToken,
    isAuthenticated,
    isHydrated,
    setSessionToken,
    hydrate,
  } = useAuth();

  // 🔥 Get logout function from custom hook
  const { logout } = useLogout();

  // 🔥 Test logout handler
  const handleTestLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Test logout failed:", error);
    }
  };

  return (
    <div className="p-4 border rounded m-4">
      <h3 className="font-bold mb-2">🧪 Zustand Test</h3>

      {/* current state */}
      <div className="mb-4">
        <p>
          Token: <span className="font-mono">{sessionToken || "Chưa có"}</span>
        </p>
        <p>
          Trạng thái:{" "}
          <span className={isAuthenticated ? "text-green-600" : "text-red-600"}>
            {isAuthenticated ? "✅ Đã đăng nhập" : "❌ Chưa đăng nhập"}
          </span>
        </p>
        <p>
          Hydrated:{" "}
          <span className={isHydrated ? "text-green-600" : "text-orange-600"}>
            {isHydrated ? "✅ Đã sync" : "⏳ Chưa sync"}
          </span>
        </p>
      </div>

      {/* buttons to test actions */}
      <div className="space-x-2">
        <button
          onClick={() => setSessionToken("test-token-123")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          📝 Set client Token
        </button>

        <button
          onClick={() => hydrate("test-token-456")}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          🔄 Hydrate server token
        </button>

        <button
          onClick={handleTestLogout}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🚪 Test Logout
        </button>
      </div>
    </div>
  );
}
