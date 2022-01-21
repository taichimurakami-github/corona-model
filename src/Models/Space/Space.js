const {
  PeopleStateTransition,
} = require("../LifeCycleEvents/PeopleStateTransition");
const { PeopleTravel } = require("../LifeCycleEvents/PeopleTravel");
const { VirusMutation } = require("../LifeCycleEvents/VirusMutation");
const { People } = require("../People/People");
const { Virus } = require("../Virus/Virus");

/**
 * 空間を定義し、管理する
 * インスタンス生成時に空間作成を自動で行う
 */

class Space {
  constructor(config) {
    this.state = [];
    this.mvCoeff = [];
    this.result = {};
    this.t = 0;
    this.config = config;

    //空間内のウイルスを定義
    const v = new Virus(config.variantConfig);
    this.VirusModel = v;

    //resultパース用に
    this.strainTypesArr = v.getStrainTypesArr();

    //Peopleインスタンスを空間の個数分生成
    for (let i = 0; i < config.params.spaceLength; i++) {
      //初期状態を定義
      // const initialPop = {
      //   S: Math.floor(
      //     // 初期人口：0.01 ~ 1.0 * max_const
      //     getRandomFloat(0.1, 1.0) * config.params.maxPopulationSize
      //   ),
      //   I_E: 100,
      // };

      //各空間に属するインスタンスを作成
      this.state.push({
        people: new People(config, v),
      });
    }
  }

  updateWithLifeCycle() {
    //時間を進める
    this.t += 1;

    //Peopleインスタンスで定義されたイベント開始
    for (const state of this.state) state.people.updateWithCycleStart();

    //人流移動を実行
    new PeopleTravel(this);

    //ウイルス変異を実行
    new VirusMutation(this);

    //空間内での基底状態間の遷移
    new PeopleStateTransition(this);

    //Peopleインスタンスで定義されたイベント開始
    for (const state of this.state) state.people.updateWithCycleEnd();
  }

  /**
   * 各spaceごとのPeople.resultを返す
   * -----------------------------------
   * + return structure:
   *  [
   *    <Parent Array ID = Space.state ID>
   *    {
   *      <Each Element has results of each Space.state>
   *       asObject : People.result.ArrayOfObj : formatted result as Array of Object
   *       asArray : People.result.ArrayOfPop : only population result as Array of Array
   *    },
   *    {
   *      ...
   *    }
   *  ]
   * -----------------------------------
   * @returns {[{[String]: Array}]}
   */
  getResults() {
    //execute parse
    return this.state.reduce((prevResult, state) => {
      //result parse template
      const result = {
        asObject: [],
        asArray: [],
      };

      for (const r of state.people.result) {
        const tmpAsObj = {};
        const tmpAsArr = [];
        //register S,R
        tmpAsObj.S = r.S;
        tmpAsObj.R = r.R;

        tmpAsArr.push(r.S);
        tmpAsArr.push(r.R);

        //register I
        for (const [strainType, population] of Object.entries(r.I)) {
          tmpAsObj[`I_${strainType}`] = population;
          tmpAsArr.push(population);
        }

        //add to result
        result.asArray.push(tmpAsArr);
        result.asObject.push(tmpAsObj);
      }

      return [...prevResult, result];
    }, []);
  }
}

module.exports = { Space };
