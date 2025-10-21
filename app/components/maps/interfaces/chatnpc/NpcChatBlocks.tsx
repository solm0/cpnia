import { TypingText } from "../TypingText";

export function TimeNpcChatBlock({
  text, isLatest
}: {
  text: string;
  isLatest: boolean;
}) {
  return (
    <div className="w-full h-auto flex gap-3 max-w-6/7 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full overflow-hidden">
        
      </div>
      <div className='text-white grow'>
        {isLatest ? <TypingText text={text} /> : <span>{text}</span>}
      </div>
    </div>
  )
}

export function SacrificeNpcChatBlock({
  text, isLatest
}: {
  text: string;
  isLatest: boolean;
}) {
  return (
    <div className="w-full h-auto flex gap-3 max-w-6/7 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-2 border-yellow-300 rounded-full overflow-hidden">
        <img src={`/images/profile.png`}/>
      </div>
      <div className='text-white grow'>
        {isLatest ? <TypingText text={text} /> : <span>{text}</span>}
      </div>
    </div>
  )
}

export function EntropyNpcChatBlock({
  text, isLatest
}: {
  text: string;
  isLatest: boolean;
}) {
  return (
    <div className="w-full h-auto flex gap-3 max-w-6/7 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full overflow-hidden">
        <img src={`/images/profile.png`}/>
      </div>
      <div className='text-white grow'>
        {isLatest ? <TypingText text={text} /> : <span>{text}</span>}
      </div>
    </div>
  )
}