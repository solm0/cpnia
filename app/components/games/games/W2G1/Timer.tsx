import { useEffect, useState } from "react";

export default function Timer({
  secondsRef,
}: {
  secondsRef: React.RefObject<number>
}) {
  const [display, setDisplay] = useState(secondsRef.current);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplay(secondsRef.current); // read from ref
    }, 200); // update display every 0.2s, or 1s if you want
    return () => clearInterval(interval);
  }, [secondsRef]);

  return <p>Time left: {display}s</p>;
}