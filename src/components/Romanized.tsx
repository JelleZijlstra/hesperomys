import * as React from "react";

const TABLE = new Map([
  ["ъ", '"'],
  ["ь", "'"],
  ["а", "a"],
  ["б", "b"],
  ["в", "v"],
  ["г", "g"],
  ["д", "d"],
  ["ж", "zh"],
  ["з", "z"],
  ["и", "i"],
  ["й", "y"],
  ["к", "k"],
  ["л", "l"],
  ["м", "m"],
  ["н", "n"],
  ["о", "o"],
  ["п", "p"],
  ["р", "r"],
  ["с", "s"],
  ["т", "t"],
  ["у", "u"],
  ["ф", "f"],
  ["х", "kh"],
  ["ц", "ts"],
  ["ч", "ch"],
  ["ш", "sh"],
  ["щ", "shch"],
  ["ы", "y"],
  ["э", "e"],
  ["ю", "yu"],
  ["я", "ya"],
]);
const NEED_Y = new Set(["а", "и", "й", "о", "ы", "э", "ю", "я", "ъ", "ь", "е", "ё"]);

const romanizeRussian = (cyrillic: string) => {
  // Romanize a Russian name.
  // Uses the BGN/PCGN romanization: https://en.wikipedia.org/wiki/BGN/PCGN_romanization_of_Russian
  // We omit all optional mid-dots.
  const out = [];
  for (let i = 0; i < cyrillic.length; i++) {
    const c = cyrillic[i];
    const lowered = c.toLowerCase();
    const isUpper = lowered !== c;
    let newC = TABLE.get(lowered);
    if (newC === undefined) {
      if (lowered === "е" || lowered === "ё") {
        const vowel = lowered === "е" ? "e" : "ë";
        if (i === 0 || NEED_Y.has(cyrillic[i - 1])) {
          newC = "y" + vowel;
        } else {
          newC = vowel;
        }
      } else {
        newC = lowered;
      }
    }
    if (isUpper) {
      newC = newC[0].toUpperCase() + newC.slice(1);
    }
    out.push(newC);
  }
  return out.join("");
};

const Romanized = ({ text }: { text: string }) => {
  const romanized = romanizeRussian(text);
  if (text === romanized) {
    return <>{text}</>;
  } else {
    return (
      <>
        {text} ({romanized})
      </>
    );
  }
};
export default Romanized;
