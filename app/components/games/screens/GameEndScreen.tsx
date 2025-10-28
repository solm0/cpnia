'use client'
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GameEndScreen({
  success, worldKey, gameKey, showCitizenship
}: {
  success: boolean;
  worldKey: string;
  gameKey: string;
  showCitizenship: boolean;
}) {
  const router = useRouter();

  useEffect(() => {
    router.push(`/${success ? 'success' : 'fail'}?from=${worldKey}-${gameKey}${success ? `&citizenship=${showCitizenship}` : ''}`);
  }, [success, worldKey, gameKey, showCitizenship, router]);

  return null;
}