import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";

const COAT_COLORS = ["Black", "Blue", "White", "Fawn", "Brindle", "Red"];
const NICKNAME = [
  "Horse",
  "NeedleNose",
  "NoodleHorse",
  "Bag of Bones",
  "Couch Potato",
  "Origami Dog",
  "Snoot",
  "Booper",
  "Deer",
  "LongNose",
  "Booper",
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateDogName(earmark) {
  const seed = hashString(earmark || "");
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, NICKNAME],
    separator: " ",
    seed,
    style: "capital",
  });
  const color = COAT_COLORS[seed % COAT_COLORS.length];
  const number = (seed % 90) + 10;
  return `🐕 ${color} ${name}  #${number}`;
}
