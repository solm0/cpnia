import { Info } from 'lucide-react'
import InterviewForms from "@/app/components/maps/interview/InterviewForms";
import { nanumGothicCoding } from '@/app/lib/fonts';

export default function InterviewUi() {
  return (
    <div className="absolute left-1/2 top-0 h-screen w-1/2 flex flex-col items-center justify-center gap-24 pointer-events-none">
      <div className={`
        w-full text-gray-700 flex flex-col gap-12 text-center items-center
        text-base ${nanumGothicCoding.className}
      `}>
        <div className='flex flex-col gap-0 font-bold items-center'>
          <Info className="h-6 w-6 mb-2" />
          <p>입국심사관의 두 질문에 대한 당신의 대답이</p>
          <p>모든 npc들의 성격에 영향을 미칩니다.</p>
        </div>
        <div className='flex flex-col gap-0 font-bold'>
          <p>팁: 극단적인 말투로 답해 보세요.</p>
        </div>
        <div className='flex flex-col items-center font-bold gap-2'>
          <p className='text-xl mb-2'>예시</p>
          <p><span className='text-white'>엄청 짧게</span> ↔ <span className='text-black'>엄청 길게</span></p>
          <p><span className='text-white'>아첨하듯</span> ↔ <span className='text-black'>싸가지 없게</span></p>
          <p><span className='text-white'>극존칭</span> ↔ <span className='text-black'>반말</span></p>
        </div>
      </div>
      
      <InterviewForms />
    </div>
  )
}