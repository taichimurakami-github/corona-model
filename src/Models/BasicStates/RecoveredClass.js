const { BasicPeopleState } = require("./BasicPeopleState");

/**
 * PeopleStateModel.Recovered
 *
 * <class variables>
 * type: モデルタイプ
 * immunized: 獲得済み免疫タイプ
 *
 */
class Recovered extends BasicPeopleState {
  constructor(ID, initialPopulation, immunizedType, eqConsts = {}) {
    super(ID, initialPopulation, eqConsts);
    this.immunizedType = immunizedType;
  }

  changeTo(target, sum, sum_infected) {
    switch (target.type) {
      //感染状態への移行
      case "I":
        return (this.pop * this.beta[target.strainType] * sum_infected) / sum;

      //sigmaによるフィードバック分
      case "S":
      case "R":
        return this.pop * this.sigma[target.ID];

      default:
        throw new Error(
          "error at " + this.ID + ".getDiff : invalid target type"
        );
    }
  }
}

module.exports = { Recovered };
