'use client'

import { useState } from "react"
import Button from "../../util/Button";
import { useNpcConfigStore } from "@/app/lib/state/npcConfigState";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserNameStore } from "@/app/lib/state/userNameStore";
import { worldPortals } from "@/app/lib/data/positions/worldPortals";
import { nanumGothicCoding } from "@/app/lib/fonts";

interface npcConfig {
  formality: string,
  verbosity: string,
  warmth: string,
}

const defaultNpcConfig = {
  formality: '하십시오체',
  verbosity: '투머치토커',
  warmth: '적대적인',
}

export default function InterviewForms() {
  const userName = useUserNameStore(state => state.userName);

  const router = useRouter();

  const [input, setInput] = useState('');
  const [allAnswers, setAllAnswers] = useState("");
  const [phase, setPhase] = useState(1);
  const [loading, setLoading] = useState(false);
  const setNpcConfig = useNpcConfigStore(state => state.setNpcConfig);
  const [data, setData] = useState<npcConfig>();

  const searchParam = useSearchParams();
  const worldTo = searchParam.get('to');
  if (!worldTo) return;

  const questions = [
    `${userName} 님은 왜 ${worldPortals.find(portal => portal.worldKey === worldTo)?.worldName ?? ''}에 가시나요?`,
    '시민권을 얻으려고 하는 이유는 무엇인가요?'
  ]

  async function onSubmit(input: string) {
    setLoading(true);

    try {
      const response = await fetch('/api/classify', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input }),
      })
  
      const result: npcConfig = await response.json();
      console.log("Classification result:", result);
      
      setNpcConfig(result);
      setData(result)
    } catch(err) {
      console.error(err);
      setNpcConfig(defaultNpcConfig);
      setData(undefined)
    } finally {
      setLoading(false);
      setPhase(3);
    }
  }

  const handleClick = () => {
    if (!input.trim()) {
      alert("답변을 입력해주시죠?");
      return;
    }

    const newAnswers = allAnswers + " " + input
    setAllAnswers(newAnswers);
    setInput("");

    if (phase === 1) {
      setPhase(2);
    } else {
      onSubmit(allAnswers.trim());
      setAllAnswers("");
    }
  }

  return (
    <div className={`
      flex flex-col gap-8 items-center break-keep text-gray-700 pointer-events-auto
      ${nanumGothicCoding.className}
    `}>
      {phase <= 2 ? (
        <>
          <p>{phase}</p>
          <label htmlFor="form" className="font-bold">
            {phase === 1 ? questions[0] : questions[1]}
          </label>
          <form
            id='form'
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-12 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-96 h-10 text-center focus-within:outline-none border-b-1 border-white focus-within:border-b-4 text-gray-700 text-lg font-bold p-4 truncate"
              disabled={loading}
              placeholder="답변을 적어주세요"
            />
            <Button
              onClick={handleClick}
              label={loading ? "답변을 분석중입니다...": "다음"}
              disabled={loading}
              gpTabIndex={0}
            />
          </form>
        </>
      ): (
        <>
          {data ? (
            <div className="flex flex-col gap-2">
              <p>{`결과: ${data.formality}, ${data.verbosity}, ${data.warmth}`}</p>
              <Button
                onClick={() => router.push(`/${worldTo}`)}
                label="입장하기"
              />
            </div>
          )
          : (
            <div className="flex flex-col gap-2">
              <p>뭔가 잘못됨</p>
              <Button
                onClick={() => router.push('/')}
                label="홈으로"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}