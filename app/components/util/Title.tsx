export default function Title({
  title
}: {
  title: string;
}) {

  return (
    <h2 className="text-center text-black text-4xl w-[20em] break-keep font-mono select-none">
      {title ?? 'no title'}
    </h2>
  )
}