const state = {
  all: [],
  filtered: [],
  search: "",
  language: "",
  sort: "date"
};

async function fetchNews() {
  try {
    // Replace with your backend/AI API call
    const res = await axios.get("data/news.json");
    state.all = res.data;
    filterNews();
  } catch (err) {
    console.error("Failed to fetch news:", err);
  }
}

function filterNews() {
  state.filtered = state.all.filter(item => {
    const matchesSearch =
      !state.search ||
      item.title.toLowerCase().includes(state.search.toLowerCase()) ||
      item.summary.toLowerCase().includes(state.search.toLowerCase());
    const matchesLang = !state.language || item.language === state.language;
    return matchesSearch && matchesLang;
  });

  if (state.sort === "date") {
    state.filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (state.sort === "source") {
    state.filtered.sort((a, b) => a.source.localeCompare(b.source));
  }

  renderNews();
}

function renderNews() {
  const newsContainer = document.getElementById("news");
  newsContainer.innerHTML = "";

  state.filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "news-card";
    card.innerHTML = `
      <h2><a href="${item.link}" target="_blank">${item.title}</a></h2>
      <p>${item.summary}</p>
      <p class="news-meta">${item.source} • ${new Date(
      item.date
    ).toLocaleDateString()} • ${item.language.toUpperCase()}</p>
    `;
    newsContainer.appendChild(card);
  });
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchNews();

  document.getElementById("search").addEventListener("input", e => {
    state.search = e.target.value;
    filterNews();
  });

  document.getElementById("language").addEventListener("change", e => {
    state.language = e.target.value;
    filterNews();
  });

  document.getElementById("sort").addEventListener("change", e => {
    state.sort = e.target.value;
    filterNews();
  });
});
