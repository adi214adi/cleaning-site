export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const CHAT_ID = process.env.TG_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return new Response("Telegram ENV missing", { status: 500 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const {
    name,
    phone,
    address,
    time,
    comment,
    price,
    page
  } = data || {};

  const message =
`🧹 New Cleanex Lead

👤 Name: ${name || "-"}
📞 Phone: ${phone || "-"}
📍 Address: ${address || "-"}
🕒 Time: ${time || "-"}

💰 Price: ${price || "-"}

💬 Comment:
${comment || "-"}

🔗 Page:
${page || "-"}`;

  const tg = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    }
  );

  if (!tg.ok) {
    const err = await tg.text();
    return new Response(err, { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
