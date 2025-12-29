module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).send("ENV missing");
  }

  const {
    name,
    phone,
    address,
    time,
    price,
    comment
  } = req.body || {};

  const message =
`🧹 New Cleanex Lead

👤 Name: ${name || "-"}
📞 Phone: ${phone || "-"}
📍 Address: ${address || "-"}
🕒 Time: ${time || "-"}

💰 Price: ${price || "-"}

💬 Comment:
${comment || "-"}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });

    return res.status(200).send("OK");
  } catch (e) {
    console.error(e);
    return res.status(200).send("OK"); // фронт не пугаем
  }
};
