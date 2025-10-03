export function TimeNpcLoadingBlock({name}: {name: string}) {
  return (
    <div className="flex animate-pulse w-auto h-auto gap-3 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full"></div>
      <div className="text-white grow">
        {`${name}가 생각하고 있어요`}
      </div>   
    </div>
  )
}

export function SacrificeNpcLoadingBlock({name}: {name: string}) {
  return (
    <div className="flex animate-pulse w-auto h-auto gap-3 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-2 border-yellow-300 rounded-full"></div>
      <div className="text-white grow">
        {`${name}가 생각하고 있어요`}
      </div>   
    </div>
  )
}

export function EntropyNpcLoadingBlock({name}: {name: string}) {
  return (
    <div className="flex animate-pulse w-auto h-auto gap-3 self-start p-4">
      <div className="w-14 h-14 shrink-0 border-1 border-[#ffffff70] rounded-full"></div>
      <div className="text-white grow">
        {`${name}가 생각하고 있어요`}
      </div>   
    </div>
  )
}