import DefaultFail from "@/app/components/games/screens/DefaultFail";
import { Suspense } from "react";

export default function FailPage() {
  return (
    <Suspense>
      <DefaultFail />
    </Suspense>
  )
}