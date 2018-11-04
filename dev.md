プロジェクトの環境構成を設定する(https://firebase.google.com/docs/functions/config-env)

```bash
# セット
firebase functions:config:set someservice.key="THE API KEY" someservice.id="THE CLIENT ID"
# 取得
firebase functions:config:get
```