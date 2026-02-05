import { useEffect, useState } from 'react' // useEffectを追加
import axios from 'axios'
import './App.css'

function App() {
  // 1. Railsから受け取ったメッセージを保存するための「箱（ステート）」
  const [message, setMessage] = useState<string>("読み込み中...")

  // 2. 画面が表示された時に実行する処理
  useEffect(() => {
    // ここにURLを定義します
    const url = "https://nomusup-api.onrender.com/api/v1/health_check"

    axios.get(url)
      .then((res) => {
        // 成功したらメッセージを書き換える
        setMessage(res.data.message)
      })
      .catch((err) => {
        console.error(err)
        setMessage("APIとの通信に失敗しました")
      })
  }, []) // 第2引数を空にすることで、最初の1回だけ実行されます

  return (
    <div className="App">
      <h1>Nomu-Sup</h1>
      <div className="card">
        <p>Railsからの応答:</p>
        {/* 3. 保存したメッセージを表示する */}
        <h2 style={{ color: '#646cff' }}>{message}</h2>
      </div>
      <p className="read-the-docs">
        バックエンド（Render）とフロントエンド（Vercel）が繋がりました！
      </p>
    </div>
  )
}

export default App