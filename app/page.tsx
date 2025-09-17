import Scene from "./components/scene";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-amber-50">
      <main className="flex flex-col w-full h-full">
        <Scene />
      </main>
    </div>
  );
}
