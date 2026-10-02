export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        message: "Method not allowed"
      }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const token =
      process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
      process.env.TELEGRAM_CHAT_ID;

    if (!token) {
      return new Response(
        JSON.stringify({
          message: "TELEGRAM_BOT_TOKEN is missing"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    if (!chatId) {
      return new Response(
        JSON.stringify({
          message: "TELEGRAM_CHAT_ID is missing"
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const formData =
      await req.formData();

    const text =
      formData.get("text") || "";

    const image =
      formData.get("image");


    let telegramResponse;


    if (image && image.size > 0) {

      const telegramForm =
        new FormData();

      telegramForm.append(
        "chat_id",
        chatId
      );

      telegramForm.append(
        "caption",
        text
      );

      telegramForm.append(
        "photo",
        image
      );


      telegramResponse =
        await fetch(
          `https://api.telegram.org/bot${token}/sendPhoto`,
          {
            method: "POST",
            body: telegramForm
          }
        );

    } else {

      telegramResponse =
        await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              chat_id: chatId,
              text: text
            })
          }
        );

    }


    const result =
      await telegramResponse.json();


    if (!telegramResponse.ok ||
        !result.ok) {

      return new Response(
        JSON.stringify({
          message:
            result.description ||
            "Telegram API error"
        }),
        {
          status: 500,
          headers: {
            "Content-Type":
              "application/json"
          }
        }
      );
    }


    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Published successfully"
      }),
      {
        status: 200,
        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );


  } catch (error) {

    return new Response(
      JSON.stringify({
        message:
          error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type":
            "application/json"
        }
      }
    );

  }
}
