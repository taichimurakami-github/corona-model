## 2022.02.01

- フィードバック率が高いと、定常状態時の感染者の残数が多くなる

- フィードバック率が 0 でない場合、必ず複数回の感染ピークが訪れる

  - 回数を重ねるごとにピークの大きさは減少する
  - 感染ピークの間隔は徐々に近くなる

- 交差免疫が作用すると、思ったより強めに抑制される(特に、想定より後発のウイルスが感染しにくい)

- 空間の数を増やしても大局的に挙動は変わらない

  - 人龍移動の影響から、定常状態へ落ち着くためどの空間でも同じような結果になる

- appearanceAt を空間数以上にしておくとウイルスが出現しないので注意（あたりまえ）

## 2022.02.20

- 回復率が MAX になっても感染は起こる

- 空間数を 10000 程度にするとメモリーヒープエラーが起こる

- ワクチン免疫を入れると、そのウイルスが引き起こす第二波以降が小さくなる or なくなる

- ワクチンが効いても、効果が切れ始めると途端に感染爆発が起こるので、継続的な接種が必要

- ウイルスは完全に置き換わるわけでは無く、感染力に比例して、感染者数に対して一定割合残存している

- 空間数を増やしても、大まかな挙動は変わらない

- 計算量は 空間数 x ウイルス設定 x 時間 x ワクチン設定

## 卒論に書いてることまとめ

- 人流がないと、設定した空間ないにのみウイルスが放てる
- 自然免疫が失われるにつれて、第二波が発生した

### 1. 人流なし、初期人口一定、空間複数（部分結合）

- 空間間での人流がないため、感染は設定された空間のみに限定された。
- 自然免疫保持者 R はウイルス発生時に大きく増加するものの、時間経過とともにフィードバックが起こり、人数が減少した。
- 免疫保持者の減少に伴って、2 回目以降のピークがはっせいした。

### 2. 人流あり、初期人口一定、空間複数（部分結合）

- ウイルスが特定空間で発生する場合
  ① 全ての空間で同時にウイルスが出現したため、伝搬の仕方は均等である
  ② snapshot を見せる
- ウイルスが全ての空間で発生する場合
  ① ウイルスが出現した空間から徐々に伝播が広がっていく様子が見られた（50 番空間が一番遅かった）
  ② snapshot を見せる

### 3. 人流あり、初期人口一定、空間複数（部分結合）

- 空間ごとの初期人口が異なるため、初期に出現するウイルスの感染者数は空間ごとに有意差が見られた。
- 時間が経過するに伴い、各空間同士の人口移動が定常状態に達し、いずれの空間も全人口がほぼ同じ値になったため、後に出てくるウイルス株の感染者数は大体同じになった
- 初期人口が同じでも、人流があると空間ごとに差異がうまれることがわかった（try2 flow2）

### 4. 人流あり、初期人口ランダム、空間複数、交差免疫あり

- 交差免疫を導入することで、全体的な感染者数がさらに低下した
- 交差免疫の強さによって、のちに出てくるウイルスの感染力を完全に打ち消すことができるとわかった

### 5. 人流あり、初期人口ランダム、空間複数、交差免疫あり、ワクチン投与あり

- 感染者数が抑えられている
- ワクチンを投与すると、投与した付近でウイルスの感染が発生しにくくなる or ゆるいウイルスに変化するが、duration と共にワクチン効力が弱まると出現するようになる
- ワクチン効果が弱まると、一気に抑えられていたウイルスの感染が爆発する

## その他共有したい事項

- SIR -> SEIR にしました
- ワクチン接種を導入しました
  - ワクチン免疫は免疫が低下する性質があり、自然免疫は生涯免疫の獲得と同値であるとの過程のもと実装している
- バグ修正中

## プログラム修正メモ

- ウイルス感染の初期人口を、initialInfectiousRate を基準に生成する
  - rate -> population にすれば？
