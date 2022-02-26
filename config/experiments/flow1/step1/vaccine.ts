import { type_VaccineConfig } from "../../../../@types/config";
import { strainTypesArray } from "./variant";

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {
      10: {
        name: "fizer",
        target: [0],
      },
      210: {
        name: "fizer",
        target: [11],
      },
    },
    data: {
      fizer: {
        duration: 300,
        effect: {
          [strainTypesArray[0]]: {
            beta: 0.9,
            gamma: 1.1,
            mu: 0.5,
          },
          [strainTypesArray[1]]: {
            beta: 0.9,
            gamma: 1.1,
            mu: 0.5,
          },
          [strainTypesArray[2]]: {
            beta: 0,
            gamma: 0.1,
            mu: 0.1,
          },
        },
      },
    },
  },
};

export default vaccineConfig;
