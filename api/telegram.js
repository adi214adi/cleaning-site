export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const data = await req.json();

  const {
    name,
    phone,
    address,
    time,
    comment,
    price,
    page
  } = data || {};

  const text = `
🧹 Новая заявка Cleanex Batumi

👤 Имя: ${name || "-"}
📞 Телефон: ${phone || "-"}
📍 Адрес: ${address || "-"}
🕒 Дата / время: ${time || "-"}

💰 Цена: ${price || "-"}

💬 Комментарий:
${comment || "-"}

🌐 Страница:
${page || "-"}
`;

  const tgRes = await fetch(
    `https://api.telegram.org/bot${process.env.TG_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: process.env.TG_CHAT_ID,
        text
      })
    }
  );

  if (!tgRes.ok) {
    return new Response("Telegram error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
