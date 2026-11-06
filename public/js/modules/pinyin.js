const TONES = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
};

export const convertPinyin = (input) => {
  return input.replace(/([a-z:]+)([0-5])/gi, (_, syllable, tone) => {
    syllable = syllable.toLowerCase();
    const toneNumber = Number(tone);
    const vowels = [...syllable];

    let index = vowels.indexOf("a");

    if (index === -1) {
      index = vowels.indexOf("e");
    }

    if (index === -1) {
      index = vowels.indexOf("o");
    }

    if (index === -1) {
      for (let i = vowels.length - 1; i >= 0; i--) {
        if (TONES[vowels[i]]) {
          index = i;
          break;
        }
      }
    }

    if (index === -1) {
      return syllable;
    }

    vowels[index] = TONES[vowels[index]][toneNumber - 1];

    return vowels.join("");
  });
};
