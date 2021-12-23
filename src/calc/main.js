
/**
 * 1フェーズ分の人流を計算し、移動後の新たな人口分布を生成する
 * @param {array} space 
 * @param {array of array} coeffMatrix 
 * @returns 
 */
const generateNewPeopleDist = (space, coeffMatrix) => {

  // とりあえず引数の配列をコピー
  const newSpace = [...space];

  //diff arrayを生成 >> 人流移動を考えるとき、すべての空間から同時に流出と流入が起こると仮定するため、ベースの数字を固定する
  const diff = [];

  for (let i = 0; i < space.length; i++) diff.push({ S: 0, I: 0, R: 0 });

  for (let i_from = 0; i_from < space.length; i_from++) {

    //現在対象の空間以外の全ての空間に一定の割合で人が流出
    for (let i_to = 0; i_to < space.length; i_to++) {

      if (i_from === i_to) continue;

      const outflow = {};
      outflow.S = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].S);
      outflow.I = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].I);
      outflow.R = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].R);

      diff[i_from].S -= outflow.S;
      diff[i_from].I -= outflow.I;
      diff[i_from].R -= outflow.R;

      diff[i_to].S += outflow.S;
      diff[i_to].I += outflow.I;
      diff[i_to].R += outflow.R;
    }
  }

  return newSpace.map((val, index) => {
    //とりあえずparseする
    const r = {
      S: Math.round(val.S + diff[index].S),
      R: Math.round(val.I + diff[index].I),
      I: Math.round(val.R + diff[index].R),
    };

    //もし負の値になったら計算中止
    if (r.S < 0 || r.I < 0 || r.R < 0) {
      throw new Error(`計算結果が不正です：${index} 番目の値は ${r} でした`);
    }

    return r;
  });
}

/**
 * 各空間内それぞれに対して、
 * 基本的なSIRモデルに基づいた感染シミュレーションを行う
 * 
 * @param {array} space 
 * @param {object} C 
 */
const simulateInfection = (space, C) => {
  const space_afterInfected = [];

  for (let i = 0; i < space.length; i++) {
    //差分配列を用意
    const diff = { S: 0, I: 0, R: 0 };
    const now = { ...space[i] };
    const next = {};

    diff.S = (now.R * C.sigma) - (now.S * C.beta);
    diff.I = (now.S * C.beta) - (now.I * C.gamma);
    diff.R = (now.I * C.gamma) - (now.R * C.sigma);

    for (const [key, value] of Object.entries(diff)) {
      next[key] = Math.round(now[key] + value);
    }

    space_afterInfected[i] = { ...next };
  }
  return space_afterInfected;
}


module.exports = { generateNewPeopleDist, simulateInfection };