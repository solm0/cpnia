'use client'

import { Info } from 'lucide-react'
import Button from "@/app/components/util/Button";
import InterviewForms from "@/app/components/maps/interview/InterviewForms";
import { useRouter, useSearchParams } from "next/navigation";
import { nanumGothicCoding } from '@/app/lib/fonts';
import { useGamepadControls } from '@/app/lib/hooks/useGamepadControls';

export default function InterviewUi() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const worldTo = searchParam.get('to');
  useGamepadControls();

  return (
    <div className="absolute left-1/2 top-0 h-screen w-1/2 flex flex-col items-center justify-center gap-30 pointer-events-none">
      <div className={`
        w-full text-gray-700 flex flex-col gap-4 text-center items-center
        text-base ${nanumGothicCoding.className}
      `}>
        <Info className="h-6 w-6" />
        <div className='flex flex-col gap-0 font-bold'>
          <p>입국심사관의 두 질문에 대한 당신의 대답이</p>
          <p>모든 npc들의 성격에 영향을 미칩니다.</p>
        </div>
        <div className='flex flex-col gap-0 font-bold'>
          <p>팁: 극단적인 말투로 답해 보세요.</p>
          <p>(엄청 짧게—엄청 길게, 착하게—나쁘게, 극존칭—반말)</p>
        </div>
      </div>
      
      <InterviewForms />

      <Button
        onClick={() => router.push(`/${worldTo}`)}
        label="성격 형성 스킵하고 바로 입장하기"
        id={'tempId'}
      />
    </div>
  )
}