import * as vscode from "vscode"

const encloseWithTripleBackticks = (text: string): string => {
  return `\`\`\`${text}\`\`\``
}

const sampleCode = `const functionName = () => {
}`

export function activate(context: vscode.ExtensionContext) {
  const handler: vscode.ChatAgentHandler = async (
    request,
    context,
    progress,
    token,
  ): Promise<vscode.ChatAgentResult2> => {
    const access = await vscode.chat.requestChatAccess("copilot")

    const messages = [
      {
        role: vscode.ChatMessageRole.System,
        content: `以下のルールに従ってTypeScriptで書かれた関数のコードと説明を応答してください。
        - 最新の文法を使用する
        - 可能な限り再代入を避ける
        - 必要に応じてガード節を使用する
        - Any型の使用はジェネリクスを用いて避ける
        - Any型の値を返却しない
        - undefinedの代わりにnullを使用する
        - 変数名は省略しない
        - 引数が複数ある場合はオブジェクトにする
        - 引数がオブジェクトの場合は変数名をpropsに型名はPropsにする
        - 分割代入引数を使用しない
        関数の形式:
        ${encloseWithTripleBackticks(sampleCode)}`,
      },
      {
        role: vscode.ChatMessageRole.User,
        content: `${request.prompt}（ベトナム語で応答）`,
      },
    ]
    const chatRequest = access.makeRequest(messages, {}, token)
    for await (const fragment of chatRequest.response) {
      progress.report({ content: fragment })
    }
    return {}
  }

  const agent = vscode.chat.createChatAgent("ts-function", handler)
  agent.iconPath = vscode.Uri.joinPath(context.extensionUri, "icon.png")
  agent.description = vscode.l10n.t("TypeScriptの関数を定義します")
  agent.fullName = vscode.l10n.t("ts-function")
}

export function deactivate() {}
