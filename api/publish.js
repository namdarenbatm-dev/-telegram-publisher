export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed"
    });
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      return res.status(500).json({
        message: "Bot token is not configured"
      });
    }

    const formData = await req.formData();

    const text = formData.get("text");
    const image = formData.get("image");

    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!chatId) {
      return res.status(500).json({
        message: "Telegram channel is not configured"
      });
    }

    let response;

    if (image) {
      const telegramData = new FormData();

      telegramData.append("chat_id", chatId);
      telegramData.append("caption", text || "");
      telegramData.append("photo", image);

      response = await fetch(
        `https://api.telegram.org/bot${token}/sendPhoto`,
        {
          method: "POST",
          body: telegramData
        }
      );
    } else {
      response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text || ""
          })
        }
      );
    }

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return res.status(500).json({
        message: result.description || "Telegram error"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
}
