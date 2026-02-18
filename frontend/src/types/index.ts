// ユーザーの型：マイページやログイン状態で使います
export interface User {
  id: string;
  email: string;
  name?: string; // 名前は設定されていないこともあるので「?」をつけています
}

// 症状の型：Railsの Symptom モデルに対応します
export interface Symptom {
  id: string;
  name: string;
  timing: number;   // 0:前, 1:中, 2:後
  category: number; // 0:症状, 1:体質
}

// 薬の型：Railsの Drug モデルに対応します
export interface Drug {
  id: string;
  name: string;
  category: number;    // 0:DS(医薬品), 1:コンビニ(食品)
  timing: number;
  description: string;
}

// 診断履歴の型：診断結果画面やマイページの一覧で使います
export interface DiagnosisLog {
  id: string;
  user_id?: string;
  timing: number;
  created_at: string;
  symptoms: Symptom[]; // 選んだ症状のリスト
  drugs: Drug[];       // 提案された薬のリスト
}