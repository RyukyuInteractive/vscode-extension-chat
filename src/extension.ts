import * as vscode from "vscode"

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
        content: "日本語で応答してください。",
      },
      {
        role: vscode.ChatMessageRole.User,
        content: `${request.prompt}（端的に応答）`,
      },
    ]
    const chatRequest = access.makeRequest(messages, {}, token)
    for await (const fragment of chatRequest.response) {
      progress.report({ content: fragment })
    }
    return {}
  }

  const agent = vscode.chat.createChatAgent("japon", handler)
  agent.iconPath = vscode.Uri.joinPath(context.extensionUri, "icon.png")
  agent.description = vscode.l10n.t("今日は何をお手伝いしましょうか？")
  agent.fullName = vscode.l10n.t("Japon")
}

export function deactivate() {}
