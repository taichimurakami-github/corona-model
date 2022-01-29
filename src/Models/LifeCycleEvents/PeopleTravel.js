const { getRandomFloat } = require("../../calc/lib");

class PeopleTravel {
  constructor(SpaceModel) {
    const s = SpaceModel;
    this.connectionType = s.config.params.space.connectionType;
    this.spaceLength = s.config.params.space;

    //移動係数を計算、保存
    this.mvCoeff = this.generateMvCoeffMatrix(s);

    //移動を実行
    for (let i_from = 0; i_from < s.state.length; i_from++) {
      //移動元のPeopleインスタンスを取得
      const P_outflowFrom = s.state[i_from].people;

      //格子空間上時の計算回数を省略するためのフラグカウンタ
      let adjacentScanningCnt = 0;

      for (let i_to = 0; i_to < s.state.length; i_to++) {
        //流出先が流出元と同じSpaceだったらスキップ
        if (i_from === i_to) continue;

        /**
         * 設定でconnectionType = partial にしている場合の処理
         * 格子上の空間を定義しているので、上下左右に隣接する空間に対してのみ移動を行う
         * 部分結合なので、隣接したセルに対してのみ移動を発生させる
         */
        if (this.connectionType === "partial") {
          //i_toがi_fromと隣り合っていなければスキップ
          if (!this.isAdjacent(this.spaceLength, i_from, i_to)) continue;

          //すべての隣接セルを操作し終わったらこのループを終了、次の空間の遷移へ
          if (adjacentScanningCnt === 4) break;

          //隣接セルのうち、一つを計算するのでカウンタを更新
          adjacentScanningCnt++;
        }

        //移動係数を取得
        const mvCoeff = this.mvCoeff[i_from][i_to];

        //流出先のPeopleインスタンスを取得
        const P_outflowTo = s.state[i_to].people;

        //移動計算を実行（全探索）
        this.calcMove(P_outflowFrom, P_outflowTo, mvCoeff);
      }
    }
  }

  calcMove(P_outflowFrom, P_outflowTo, mvCoeff) {
    //Space内で定義されたウイルス株設定は全空間で共通のものとなると仮定しているので、
    //Spaceが保持するすべてのPeopleインスタンス内のlayeredNodeの構造は同じになる
    for (let i = 0; i < P_outflowFrom.state.length; i++) {
      //phase1: 各レイヤー取り出し
      const layer_outflowFrom = P_outflowFrom.state[i];
      const layer_outflowTo = P_outflowTo.state[i];

      for (let j = 0; j < layer_outflowFrom.length; j++) {
        //phase2: 各ノード取り出し
        const node_outflowFrom = layer_outflowFrom[j];
        const node_outflowTo = layer_outflowTo[j];

        //phase3: NI系の移動
        const NI_outflow = node_outflowFrom.NI.p * mvCoeff;
        node_outflowFrom.NI.p -= NI_outflow;
        node_outflowTo.NI.p += NI_outflow;

        for (const key of Object.keys(node_outflowFrom.I)) {
          //phase4: I系の移動
          const I_outflowFrom_instance = node_outflowFrom.I[key];
          const I_outflowTo_instance = node_outflowTo.I[key];
          const I_outflow = I_outflowFrom_instance.p * mvCoeff;

          I_outflowFrom_instance.p -= I_outflow;
          I_outflowTo_instance.p += I_outflow;
        }
      }
    }
  }

  isAdjacent(length, i, j) {
    const col = length.col;
    const row = length.row;

    //case 1 check left
    const left = i - 1;
    if (j === left || j === left + row) return true;

    //case 2 check right
    const right = i + 1;
    if (j === right || j === right - row) return true;

    //case 3 check top
    const top = i - col;
    if (j === top || j === top + (row - 1) * col) return true;

    //case 4 check bottom
    const bottom = i + col;
    if (j === bottom || j === bottom - (row - 1) * col) return true;

    //not adjacent
    return false;
  }

  generateMvCoeffMatrix(s) {
    const config = s.config;
    const space = s.state.map((state) => state.people);
    const coeffMatrix = [];
    const max_coeff_const = config.params.maxCoeffConst;

    // coeffの範囲を動的に取得（MAX_COEFF * space.length < 1を満たすように取得）
    // とりあえず max_coeff_const / space.lengthとした
    const COEFF_MAX = (1 / space.length) * max_coeff_const;
    const COEFF_MIN = COEFF_MAX * 0.01;

    for (let i_from = 0; i_from < space.length; i_from++) {
      //coeffMatrixに行を追加
      coeffMatrix.push([]);

      for (let i_to = 0; i_to < space.length; i_to++) {
        //i_From === i_toの時は係数を0にする
        coeffMatrix[i_from][i_to] =
          i_from === i_to ? 0 : getRandomFloat(COEFF_MIN, COEFF_MAX);
      }
    }

    return coeffMatrix;
  }
}

module.exports = { PeopleTravel };
