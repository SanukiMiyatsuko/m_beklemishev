import { useState } from 'react';
import './App.css';
import { expand } from './code';

function App() {
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("0");
  const [inputM, setInputM] = useState("0");
  const [inputLevel, setInputLevel] = useState("0ベクレミシェフ");
  const [input, setInput] = useState("入力：");
  const [output, setOutput] = useState("出力：");
  const [outputError, setOutputError] = useState("");

  const compute = () => {
    setInput("");
    setOutput("");
    setOutputError("");
    try {
      if (inputA === "") throw Error("Aの入力が必要です");
      if (!/^\d+(,\d+)*$/.test(inputA)) throw Error("Aには数列を入力してください");
      const seq = inputA.split(",").map(x => parseInt(x)).filter(x => !isNaN(x));
      const n = parseInt(inputB);
      const M = parseInt(inputM);
      const inputString = `(${inputA})[${inputB}]`
      const outputString = expand(seq,n,M);
      setInputLevel(`${M}ベクレミシェフ`);
      setInput(`入力：${inputString}`);
      setOutput(`出力：${outputString}`);
    } catch (error) {
      if (error instanceof Error) setOutputError(error.message);
      else setOutputError("不明なエラー");
      console.error("Error in compute:", error);
    }
  };

  return (
    <div className="app">
      <header>Mベクレミシェフ</header>
      <main>
        <p className="rdm">
          数列の入力はa_0,a_1,...,a_nの形式で行ってください。<br />
        </p>
        A:
        <input
          className="input is-primary"
          value={inputA}
          onChange={(e) => setInputA(e.target.value)}
          type="text"
          placeholder="入力A"
        />
        <div>B:</div>
        <input
          className="inputB"
          value={inputB}
          onChange={(e) => setInputB(e.target.value)}
          type="number"
          min="0"
        />
        <div>M:</div>
        <input
          className="inputB"
          value={inputM}
          onChange={(e) => setInputM(e.target.value)}
          type="number"
          min="0"
        />
        <div className="block">
          <button className="button is-primary" onClick={() => compute()}>
            A[B]
          </button>
        </div>
        <div className="box is-primary">
          {outputError !== "" ? (
            <div className="notification is-danger">{outputError}</div>
          ) : (
            <span>
              {inputLevel}<br />
              {input}<br />
              {output}
            </span>
          )}
        </div>
      </main>
      <footer>
        <a href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E7%AB%B9%E5%8F%96%E7%BF%81/%F0%9D%94%90-%E3%83%99%E3%82%AF%E3%83%AC%E3%83%9F%E3%82%B7%E3%82%A7%E3%83%95" target="_blank" rel="noreferrer">ユーザーブログ:竹取翁/M-ベクレミシェフ | 巨大数研究 Wiki | Fandom</a>(2024/12/9 閲覧)<br />
        このページは<a href="https://creativecommons.org/licenses/by-sa/3.0/legalcode" target="_blank" rel="noreferrer">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>の下に公開されます。<br />
      </footer>
    </div>
  );
}

export default App;