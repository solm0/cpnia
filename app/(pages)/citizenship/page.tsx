import CitizenshipScreen from "@/app/components/games/screens/CitizenshipScreen";
import { Suspense } from "react";

export default function CitizenshipPage() {
  return (
    <Suspense>
      <CitizenshipScreen />
    </Suspense>
  )
}