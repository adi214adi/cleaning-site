export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(200).json({ ok: true });
    }

    // Безопасно читаем body
    let body = {};
    if (req.body) {
      if (typeof req.body === "string") {
        body = JSON.parse(req.body);
      } else {
        body = req.body;
      }
    }

    const {
      name = "-",
      phone = "-",
      address = "-",
      time = "-",
      comment = "-",
      total = "-",
      lang = "-"
    } = body;

    const BOT_TOKEN = process.env.TG_BOT_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("ENV missing");
      return res.status(200).json({ ok: true });
    }

    const text =
`🧹 Новая заявка Cleanex

👤 Имя: ${name}
📞 Телефон: ${phone}
📍 Адрес: ${address}
🕒 Время: ${time}
🌐 Язык: ${lang}

💰 Сумма: ${total}

💬 Комментарий:
${comment}
`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text
      })
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("Telegram API error:", err);
    // ВАЖНО: никогда не отдаём 500 фронту
    return res.status(200).json({ ok: true });
  }
}
