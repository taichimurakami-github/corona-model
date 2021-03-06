import { type_VaccineConfig } from "../../../../@types/config";
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
            beta: 0.5,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[1]]: {
            beta: 0.5,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[2]]: {
            beta: 0.5,
            gamma: 1.02,
            mu: 0.5,
          },
        },
      },
    },
  },
};

let t = 0;
const MAX_TIME = 3000;
const spaceArray = [];

while (t < MAX_TIME) {
  if (t % 10 === 0)
    vaccineConfig.vaccine.begin[t] = { name: "fizer", target: [0] };

  t++;
}

export default vaccineConfig;
