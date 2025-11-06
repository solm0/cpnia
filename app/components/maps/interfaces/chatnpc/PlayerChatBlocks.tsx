export function TimePlayerChatBlock({text}: {text:string}) {
  return (
    <div className='w-auto h-auto max-w-6/7 self-end text-lime-400 pr-6'>
      {text}
    </div>
  )
}

export function SacrificePlayerChatBlock({text}: {text:string}) {
  return (
    <div className='w-auto h-auto max-w-6/7 self-end text-yellow-300 pr-6'>
      {text}
    </div>
  )
}

export function EntropyPlayerChatBlock({text}: {text:string}) {
  return (
    <div className='w-auto h-auto max-w-6/7 self-end text-blue-600 pr-6'>
      {text}
    </div>
  )
}