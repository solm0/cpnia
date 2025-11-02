import { vt323 } from "@/app/lib/fonts";

export default function LogoType({
  anim
}: {
  anim: boolean;
}) {
  return (
    <h1
      className={`text-center text-white w-50 break-keep select-none text-8xl flex justify-center gap-2 ${
        anim ? "animate-logoCycle" : ""
      }`}
    >
      <span className="font-semibold letter">C</span>
      <span className="font-semibold letter">P</span>
      <span className="font-semibold letter">N</span>
      <span className={`${vt323.className} letter`}>I</span>
      <span className={`${vt323.className} letter`}>A</span>
      <span className="font-semibold letter">.</span>
    </h1>
  );
}