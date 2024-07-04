# Name

人口推移見えーるくん

## Overview

各都道府県の人口推移をグラフにしてわかりやすく表示するウェブアプリです。

## Geting started

1. [ウェブサイト](https://population-transition-visualiser.vercel.app/)にアクセスする
   （URLは https://population-transition-visualiser.vercel.app/ ）
2. 都道府県リストからグラフ化したい地域を全てクリックする
3. 人口構成種別リストからグラフ化したいものをひとつ選んでクリックする
4. 選択した地域、人口構成種別の人口推移グラフが描画される

## Acknowledgement

本アプリの人口推移グラフは、[RESAS（地域経済分析システム）](https://opendata.resas-portal.go.jp/)を加工して生成しています。

## For developers

本アプリは `Next.js` で構築しています。

また、 `Node.js` のバージョンは `package.json` の `volta`
キーに記述してあり、コンピュータにバージョン管理ツール [Volta](https://docs.volta.sh/guide/)
がインストールされていれば自動的にバージョンを合わせられます。

本プロジェクトでは、環境変数を設定するために `.env.local` と `.env.test.local` を必要としています。
双方に必要なキーは下記の通りです。

| Key           | Description of value |
| :------------ | :------------------- |
| RESAS_API_KEY | API Key of RESAS     |

## Author

Yuki SHIMADA

## Licence

[MIT](https://opensource.org/licenses/mit-license.php)
