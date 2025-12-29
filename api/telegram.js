export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ ok: false, error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    const BOT_TOKEN = process.env.TG_BOT_TOKEN;
    const CHAT_ID = process.env.TG_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response(
        JSON.stringify({ ok: false, error: "ENV missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
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
      return new Response(
        JSON.stringify({ ok: false, error: err }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 🔥 КЛЮЧЕВОЕ: всегда возвращаем ok:true
    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
