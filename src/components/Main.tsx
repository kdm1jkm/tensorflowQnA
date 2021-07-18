import React, { useEffect, useRef, useState } from "react";
import { load, QuestionAndAnswer } from "@tensorflow-models/qna";

function useLoadModel(): [boolean, boolean, QuestionAndAnswer] {
  const [loading, setLoading] = useState<boolean>();
  const [model, setModel] = useState<QuestionAndAnswer>();
  const [error, setError] = useState(false);

  const run = async () => {
    setLoading(true);
    console.log("LOADING");
    try {
      const m = await load();
      setModel(m);
    } catch (e) {
      console.log("ERROR ON LOADING");
      console.log(e);
      setError(true);
    }
    console.log("END");
    setLoading(false);
  };

  useEffect(() => {
    run();
  }, []);

  return [loading, error, model];
}

export default function Main() {
  const [contents, setContents] = useState<string[]>([]);

  const input = useRef<HTMLInputElement>();
  const context = useRef<HTMLTextAreaElement>();
  const [isGettingInput, setGettingInput] = useState(true);
  const [question, setQuestion] = useState<string>();

  const [loading, error, model] = useLoadModel();

  useEffect(() => {
    if (!isGettingInput) {
      // console.log("ANALYZING");
      model.findAnswers(question, context.current.value).then((answers) => {
        console.log(answers);
        const answerStrings = answers.flatMap((answer) => [
          answer.text,
          `-----${answer.score}`,
        ]);
        setContents([...contents, ...answerStrings]);
        setGettingInput(true);
      });
    } else {
      console.log("PASSED");
    }
  }, [isGettingInput]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <h1>Error on loading. Please refresh page.</h1>;
  }

  return (
    <>
      <h1>QnA</h1>
      <div>
        <textarea placeholder="Context" ref={context}></textarea>
        <ul>
          {contents.map((content, index) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.current.value;
            setQuestion(q);
            setContents([q, "-".repeat(30)]);
            input.current.value = "";
            setGettingInput(false);
          }}
        >
          <input
            disabled={!isGettingInput}
            ref={input}
            type="text"
            placeholder="Enter question"
          ></input>
        </form>
      </div>
    </>
  );
}
