"use client";

import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { MemeCoinMadness } from "../components/MemeCoinMadness";

export default function Page() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();

  // Tell the host “frame is ready” when the app loads (for real mini app env)
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [isFrameReady, setFrameReady]);

  // Will be undefined on localhost, filled in when running as a real mini app
  const username =
    context?.user?.displayName ||
    context?.user?.username ||
    undefined;

  return <MemeCoinMadness username={username} />;
}