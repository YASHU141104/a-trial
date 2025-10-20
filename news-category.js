// ---------- Supabase initialization ----------
const supabase = supabase.createClient(
  'https://YOUR_PROJECT.supabase.co',   // <-- REPLACE with your Supabase project URL
  'YOUR_PUBLIC_ANON_KEY'                // <-- REPLACE with your Supabase public anon key
);

// ---------- Get category from URL ----------
const params = new URLSearchParams(window.location.search);
const category = params.get('category'); // 'supreme', 'high', 'other', etc.

// ---------- Set the title based on category ----------
const categoryTitle = {
  supreme: "Supreme Court News",
  high: "High Court News",
  other: "Other Courts News"
};
document.getElementById('categoryTitle').textContent = categoryTitle[category] || "All Legal News";

// ---------- Fetch and filter the news ----------
async function fetchCategoryNews() {
  let { data: news, error } = await supabase
    .from('news')
    .select()
    .order('pubdate', { ascending: false });

  let filtered = [];
  // --- Filtering logic for each category ---
  if (category === 'supreme') {
    filtered = news.filter(item =>
      item.title?.toLowerCase().includes('supreme court')
    );
  } else if (category === 'high') {
    filtered = news.filter(item =>
      item.title?.toLowerCase().includes('high court')
    );
  } else if (category === 'other') {
    filtered = news.filter(item =>
      !item.title?.toLowerCase().includes('supreme court') &&
      !item.title?.toLowerCase().includes('high court')
    );
  } else {
    filtered = news;
  }

  renderCategoryNews(filtered);
}

// ---------- Render filtered news on the page ----------
function renderCategoryNews(newsList) {
  const section = document.getElementById('category-news');
  if (!newsList.length) {
    section.textContent = "No news found for this category.";
    return;
  }
  section.innerHTML = newsList.map(
    item => `<article>
      <h3>${item.title}</h3>
      <p>${item.summary || ''}</p>
      <small>${item.pubdate}</small>
    </article>`
  ).join('');
}

fetchCategoryNews();
