import { type_VaccineConfig } from "../../../../@types/config";
import settings from "./settings";
import { strainTypesArray } from "./variant";

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {
      // 10: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 210: {
      //   name: "fizer",
      //   target: [11],
      // },
    },
    data: {
      fizer: {
        duration: 300,
        effect: {
          [strainTypesArray[0]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[1]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[2]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
        },
      },
    },
  },
};

//auto space settings
const spaceArray = [];
const Slen = settings.params.spaceLength.row * settings.params.spaceLength.col;
for (let i = 0; i < Slen; i++) spaceArray.push(i);

//auto time settings
let t = 0;
const MAX_TIME = 3000;
while (t < MAX_TIME) {
  if (t % 200 === 0)
    vaccineConfig.vaccine.begin[t] = { name: "fizer", target: [0] };
  t++;
}

export default vaccineConfig;