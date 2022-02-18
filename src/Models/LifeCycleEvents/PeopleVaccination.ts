import {
  VaccineData,
  VaccineConfig,
  VaccineEffects,
} from "../../../@types/config";
import { Space, SpaceState, Vaccinated } from "../Space/Space";

export class PeopleVaccination {
  constructor(SpaceModel: Space) {
    const vaccineConfig: VaccineConfig = SpaceModel.config.vaccine;
    const state = SpaceModel.state;
    const t = SpaceModel.t;

    //ワクチン接種開始
    for (const [time, settings] of Object.entries(vaccineConfig.begin)) {
      //設定された時間でなければ処理しない
      if (t !== Number(time)) continue;
      const v_name = settings.name;
      const v_data = vaccineConfig.data[v_name];

      if (settings.target === "ALL") {
        //すべての空間に対する処理
        for (const s of state) this.beginOrRestartEffect(t, s, v_name, v_data);
        continue;
      }

      //特定の空間に対する処理
      for (const spaceID of settings.target) {
        const s_target = state[spaceID];
        this.beginOrRestartEffect(t, s_target, v_name, v_data);
      }
    }

    //ワクチンの影響の更新、ワクチン効果切れ
    for (const s of state) {
      const vaccineNames = Object.keys(s.vaccinated);
      if (vaccineNames.length === 0) continue;

      for (const v_name of vaccineNames) {
        const v_data = vaccineConfig.data[v_name];
        this.setAttenuationEffect(t, s.vaccinated, v_name, v_data);
      }
    }
  }

  //ワクチン接種開始
  //ワクチン再接種による減衰率の復元
  beginOrRestartEffect(
    t: number,
    state: SpaceState,
    v_name: string,
    v_data: VaccineData
  ) {
    state.vaccinated[v_name] = {
      vaccinatedAt: t,
      attenuationCoeff: 0,
      effect: { ...v_data.effect },
    };
  }

  //減衰率
  setAttenuationEffect(
    t: number,
    vaccinated: Vaccinated,
    v_name: string,
    v_data: VaccineData
  ) {
    const vaccinatedAt = vaccinated[v_name].vaccinatedAt;

    //時間経過に伴うワクチン免疫減衰による減衰率
    //現在時間が、ワクチン接種後の経過時間を上回っていた場合は1を返す
    const attenuationRate =
      t - vaccinatedAt < v_data.duration
        ? 1 - (t - vaccinatedAt) / v_data.duration
        : 1;
    //次回計算フェーズでのワクチン効果減衰率
    vaccinated[v_name].attenuationCoeff = attenuationRate;
  }

  //ワクチン効果消滅: いらなくね？
  // expireEffect(SpaceModel: Space, vaccineName: string) {
  // for (const s of SpaceModel.state) {
  //   delete s.vaccinated[vaccineName];
  // }
  // }
}