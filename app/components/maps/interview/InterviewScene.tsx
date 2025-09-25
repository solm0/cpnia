'use client'

import { Suspense } from "react";
import Loader from "@/app/components/util/Loader";
import Model from "../../util/Model"
import SmallScene from "../../util/SmallScene"

export default function InterviewScene() {
  return (
    <div className="w-52">
      <Suspense fallback={<Loader />}>
        <SmallScene>
          <Model
            src="/models/avatar.glb"
            scale={3.6}
            position={[0, -0.9, 0]}
            rotation={[0, Math.PI, 0]}
          />
        </SmallScene>
      </Suspense>
    </div>
  )
}