const PRICES = {
  standard: {
    studio: 90,
    "1+1": 105,
    "2+1+1WC": 140,
    // если пришлёшь точные цены — добавлю за 1 минуту
    "2+1+2WC": 0,
    "3+1+1WC": 0,
    "3+1+2WC": 0,
  },
  general: {
    studio: 125,
    "2+1+2WC": 225,
    "1+1": 0,
    "2+1+1WC": 0,
    "3+1+1WC": 0,
    "3+1+2WC": 0,
  },
  renovation: {
    // на твоём скрине почему-то 6 GEL — это выглядит как заглушка.
    // Поставил 0, чтобы не вводить клиентов в заблуждение, но можно заменить точными ценами.
    studio: 0,
    "1+1": 0,
    "2+1+1WC": 0,
    "2+1+2WC": 0,
    "3+1+1WC": 0,
    "3+1+2WC": 0,
  }
};

const ADDONS = {
  oven: { name: "Внутри духовки", price: 25 },
  microwave: { name: "Внутри микроволновки", price: 7 },
  windows: { name: "Мыть окна", price: 30 },
  panoramic: { name: "Окна в пол", price: 45 },
  balcony: { name: "Уборка балкона", price: 20 },
  closet: { name: "Уборка шкафа/полок", price: 15 },
};

const CLEANING_LABEL = {
  standard: "Стандартная уборка",
  general: "Генеральная уборка",
  renovation: "Уборка после ремонта",
};

let state = {
  type: "standard",
  room: "studio",
  addons: new Set(),
};

// ---------- helpers ----------
function money(n){
  const v = Number(n || 0);
  return v.toLocaleString("ru-RU");
}

function basePrice(){
  const v = PRICES?.[state.type]?.[state.room] ?? 0;
  return Number(v || 0);
}

function addonsTotal(){
  let sum = 0;
  for (const k of state.addons){
    sum += Number(ADDONS[k]?.price || 0);
  }
  return sum;
}

function totalPrice(){
  return basePrice() + addonsTotal();
}

function updateReceipt(){
  const base = basePrice();
  const total = totalPrice();

  const cleaningNameEl = document.getElementById("receiptCleaningName");
  const roomNameEl = document.getElementById("receiptRoomName");
  const baseEl = document.getElementById("receiptBase");
  const totalEl = document.getElementById("receiptTotal");
  const addonsEl = document.getElementById("receiptAddons");
  const summaryField = document.getElementById("summaryField");

  cleaningNameEl.textContent = CLEANING_LABEL[state.type];
  roomNameEl.textContent = state.room;

  baseEl.textContent = money(base);
  totalEl.textContent = money(total);

  if (state.addons.size === 0){
    addonsEl.textContent = "Не выбрано";
  } else {
    const lines = [...state.addons].map(k => `• ${ADDONS[k].name} — ${money(ADDONS[k].price)} GEL`);
    addonsEl.textContent = lines.join("\n");
    addonsEl.style.whiteSpace = "pre-line";
  }

  // summary for form / whatsapp
  const summary = {
    cleaning: state.type,
    cleaningLabel: CLEANING_LABEL[state.type],
    room: state.room,
    addons: [...state.addons].map(k => ({ key:k, ...ADDONS[k] })),
    base,
    total
  };
  summaryField.value = JSON.stringify(summary);
}

// ---------- UI bindings ----------
function bindTypeButtons(){
  document.querySelectorAll("[data-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-type]").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.type = btn.dataset.type;

      // если в выбранном типе нет цены для текущей комнаты — оставляем, но покажем 0
      updateReceipt();
    });
  });
}

function bindRoomButtons(){
  document.querySelectorAll("[data-room]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-room]").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      state.room = btn.dataset.room;
      updateReceipt();
    });
  });
}

function bindAddons(){
  document.querySelectorAll("input[type='checkbox'][data-addon]").forEach(ch => {
    ch.addEventListener("change", () => {
      const key = ch.dataset.addon;
      if (ch.checked) state.addons.add(key);
      else state.addons.delete(key);
      updateReceipt();
    });
  });
}

function bindAddonScroller(){
  const track = document.getElementById("addonsTrack");
  const prev = document.getElementById("addonsPrev");
  const next = document.getElementById("addonsNext");
  if (!track || !prev || !next) return;

  prev.addEventListener("click", () => track.scrollBy({ left: -460, behavior:"smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: 460, behavior:"smooth" }));
}

function bindPresets(){
  document.querySelectorAll("[data-preset]").forEach(a => {
    a.addEventListener("click", () => {
      // сейчас только пример: офис/квартира/после ремонта
      const p = a.dataset.preset;
      if (p === "renovation"){
        document.querySelector("[data-type='renovation']")?.click();
      } else {
        document.querySelector("[data-type='standard']")?.click();
      }
    });
  });
}

// ---------- Included block ----------
const INCLUDED = {
  standard: {
    bedroom: {
      title: "Стандартная уборка — Спальня",
      image: "./1.jpg",
      items: [
        "Заправляем кровать",
        "Протираем мебель с внешней стороны (на уровне рук)",
        "Протираем стеклянные поверхности и зеркала (на уровне рук)",
        "Протираем светильники (на уровне рук)",
        "Пылесосим мягкую мебель",
        "Моем пол",
      ],
    },
    bathroom: {
      title: "Стандартная уборка — Ванная",
      image: "./1+1.jpg",
      items: [
        "Протираем поверхности на уровне рук",
        "Моем раковину и смесители",
        "Моем унитаз (снаружи и внутри)",
        "Протираем зеркала",
        "Моем пол",
      ],
    },
    kitchen: {
      title: "Стандартная уборка — Кухня",
      image: "./2+1+1WC.jpg",
      items: [
        "Протираем столешницу и фасады (снаружи)",
        "Протираем стеклянные поверхности",
        "Протираем плиту снаружи",
        "Моем раковину и смесители",
        "Моем пол",
      ],
    },
    hall: {
      title: "Стандартная уборка — Прихожая",
      image: "./2+1+WC.jpg",
      items: [
        "Протираем зеркала",
        "Протираем мебель с внешней стороны (на уровне рук)",
        "Протираем домофон",
        "Моем все ручки",
        "Протираем розетки",
        "Убираем паутину",
        "Моем пол",
        "Моем в труднодоступных местах",
      ],
    }
  },
  general: {
    bedroom: {
      title: "Генеральная уборка — Спальня",
      image: "./3+1+1WC.jpg",
      items: [
        "Протираем все поверхности полностью (выше уровня рук)",
        "Тщательно протираем плинтусы, двери и ручки",
        "Убираем пыль с декора и труднодоступных мест",
        "Пылесосим мягкую мебель",
        "Моем пол",
      ],
    },
    bathroom: {
      title: "Генеральная уборка — Ванная",
      image: "./3+1+1WC.jpg",
      items: [
        "Тщательно моем сантехнику и плитку",
        "Протираем все поверхности, включая верхние зоны",
        "Чистим стекло и зеркала",
        "Моем пол и труднодоступные места",
      ],
    },
    kitchen: {
      title: "Генеральная уборка — Кухня",
      image: "./3+1+2WC.jpg",
      items: [
        "Тщательно моем фасады и столешницу",
        "Протираем технику снаружи",
        "Моем раковину, смесители, фартук",
        "Моем пол и плинтусы",
      ],
    },
    hall: {
      title: "Генеральная уборка — Прихожая",
      image: "./3+1+2WC.jpg",
      items: [
        "Протираем все поверхности полностью",
        "Чистим зеркала и стеклянные элементы",
        "Моем ручки, выключатели, розетки",
        "Моем пол, плинтусы и труднодоступные зоны",
      ],
    }
  }
};

let incState = { type:"standard", room:"bedroom" };

function updateIncluded(){
  const cfg = INCLUDED?.[incState.type]?.[incState.room];
  const titleEl = document.getElementById("incTitle");
  const listEl = document.getElementById("incList");
  const imgEl = document.getElementById("visualImg");
  const pillEl = document.getElementById("visualPill");

  if (!cfg) return;

  titleEl.textContent = cfg.title;
  listEl.innerHTML = cfg.items.map(x => `<li>${x}</li>`).join("");
  imgEl.src = cfg.image;
  pillEl.textContent = `${incState.type === "standard" ? "Стандартная" : "Генеральная"} • ${
    incState.room === "bedroom" ? "Спальня" :
    incState.room === "bathroom" ? "Ванная" :
    incState.room === "kitchen" ? "Кухня" : "Прихожая"
  }`;
}

function bindIncluded(){
  document.querySelectorAll("[data-inc-type]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-inc-type]").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      incState.type = btn.dataset.incType;
      updateIncluded();
    });
  });

  document.querySelectorAll("[data-inc-room]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-inc-room]").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      incState.room = btn.dataset.incRoom;
      updateIncluded();
    });
  });
}

// ---------- submit to WhatsApp ----------
function bindSubmit(){
  const btn = document.getElementById("submitOrder");
  const form = document.getElementById("orderForm");
  btn.addEventListener("click", () => {
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const lastname = (fd.get("lastname") || "").toString().trim();
    const phone = (fd.get("phone") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const address = (fd.get("address") || "").toString().trim();
    const comment = (fd.get("comment") || "").toString().trim();

    const base = basePrice();
    const total = totalPrice();
    const addons = [...state.addons].map(k => `${ADDONS[k].name} (${ADDONS[k].price} GEL)`).join(", ") || "нет";

    const text =
`Заявка на клининг (Cleanex Batumi)
Имя: ${name} ${lastname}
Телефон: ${phone}
Email: ${email || "-"}
Адрес/район: ${address || "-"}
Тип уборки: ${CLEANING_LABEL[state.type]}
Помещение: ${state.room}
Доп. услуги: ${addons}
База: ${base} GEL
Итого: ${total} GEL
Комментарий: ${comment || "-"}`;

    const url = `https://wa.me/995591004970?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// ---------- init ----------
document.getElementById("year").textContent = new Date().getFullYear();

bindTypeButtons();
bindRoomButtons();
bindAddons();
bindAddonScroller();
bindPresets();
bindIncluded();
bindSubmit();

updateReceipt();
updateIncluded();
