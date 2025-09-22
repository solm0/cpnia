import Title from "./Title";
import Button from "./Button";

export default function FullScreenModal({
  children, title, handleClose
}: {
  children: React.ReactNode;
  title: string;
  handleClose: (open: boolean) => void;
}) {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-gray-100 flex flex-col items-center p-20 justify-between pointer-events-auto">
      <Title title={title} />
      {children}
      <Button
        onClick={() => handleClose(false)}
        label="닫기"
      />
    </div>
  )
}