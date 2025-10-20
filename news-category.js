// ===== SETUP SUPABASE CLIENT =====
// Replace with your actual Supabase details:
const supabase = supabase.createClient(
  'https://xddssiompemprjbnxxlf.supabase.co',  
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkZHNzaW9tcGVtcHJqYm54eGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDczNzcsImV4cCI6MjA3Mzc4MzM3N30.QHjF8xdFYp6ex1YW2XV6GkKvPZXNp1biImoQIZdSMG4'               
);

// ===== GET CATEGORY FROM URL =====
const params = new URLSearchParams(window.location.search);
const category = params.get('category'); // supreme, high, other

// Set page header based on category:
const categoryTitle = {
  supreme: "Supreme Court News",
  high: "High Court News",
  other: "Other Courts News"
};
document.getElementById('categoryTitle').textContent =
  categoryTitle[category] || "All Legal News";

// ===== FETCH AND DISPLAY CATEGORY NEWS =====
async function fetchCategoryNews() {
  let { data: news, error } = await supabase
    .from('news')
    .select()
    .order('pubdate', { ascending: false });

  if (error) {
    document.getElementById('category-news').textContent = "Error loading news.";
    return;
  }

  let filtered = [];
  if (category === 'supreme') {
    filtered = news.filter(item => item.title?.toLowerCase().includes('supreme court'));
  } else if (category === 'high') {
    filtered = news.filter(item => item.title?.toLowerCase().includes('high court'));
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

// ===== RENDER NEWS =====
function renderCategoryNews(newsList) {
  const section = document.getElementById('category-news');
  if (!newsList.length) {
    section.textContent = "No news found for this category.";
    return;
  }
  section.innerHTML = newsList.map(item => `
    <article>
      <h3>${item.title}</h3>
      <p>${item.summary || ''}</p>
      <small>${item.pubdate}</small>
    </article>
  `).join('');
}

fetchCategoryNews();
