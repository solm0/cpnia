import Button from "./Button";

export default function FullScreenModal({
  children, title, handleClose
}: {
  children: React.ReactNode;
  title: string;
  handleClose: (open: boolean) => void;
}) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen flex flex-col items-center p-20 justify-between pointer-events-auto backdrop-blur-xl">
      <h2 className="font-bold text-center text-white text-4xl w-[20em] break-keep font-mono select-none">
        {title ?? 'no title'}
      </h2>
      {children}
      <Button
        onClick={() => handleClose(false)}
        label="닫기"
      />
    </div>
  )
}