
import React, { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';


const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setLoading(true);
    api.get('/blog')
      .then(res => {
        setBlogPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load articles');
        setLoading(false);
      });
  }, []);

  // Collect unique categories from articles
  const categories = ['all', ...Array.from(new Set(blogPosts.map(a => a.category).filter(Boolean)))];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-800 mb-4 tracking-tight text-center">
          Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">Insights</span>
        </h2>
        <p className="text-lg text-neutral-600 mb-12 max-w-2xl mx-auto text-center">
          Explore our curated articles on bespoke craftsmanship, fabric mastery, and the future of tailoring.
        </p>



        {/* Search and category filter */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search articles..."
            className="w-full max-w-md p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1); }}
            className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
        </div>

        {loading && <div className="text-center text-neutral-500">Loading articles...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        {/* Filter, paginate, and display articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts
            .filter(a =>
              (category === 'all' || a.category === category) &&
              (a.title.toLowerCase().includes(search.toLowerCase()) ||
                (a.content && a.content.replace(/<[^>]+>/g, '').toLowerCase().includes(search.toLowerCase()))
              )
            )
            .slice((page - 1) * pageSize, page * pageSize)
            .map(({ slug, title, date, content }, index) => (
            <article
              key={slug || index}
              className="
                bg-white
                rounded-2xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                group
                overflow-hidden
                border border-neutral-100
              "
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <time
                    dateTime={new Date(date).toISOString()}
                    className="text-xs font-semibold text-sky-600 uppercase tracking-wider"
                  >
                    {date}
                  </time>
                  <div className="w-2 h-2 bg-sky-500 rounded-full" />
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-3 leading-snug group-hover:text-sky-700 transition-colors">
                  {title}
                </h3>

                <p className="text-neutral-600 mb-5 leading-relaxed line-clamp-3">
                  {/* Show a short excerpt if available, else first 120 chars of content */}
                  {content ? content.replace(/<[^>]+>/g, '').slice(0, 120) + (content.length > 120 ? '...' : '') : ''}
                </p>

                <a
                  href={`/blog/${slug}`}
                  className="
                    inline-flex
                    items-center
                    font-semibold
                    text-sky-600
                    hover:text-sky-700
                    transition-colors
                    group/link
                  "
                >
                  <span>Read More</span>
                  <svg
                    className="w-4 h-4 ml-2 transform transition-transform group-hover/link:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>

              {/* Decorative gradient overlay */}
              <div className="h-1 bg-gradient-to-r from-sky-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </article>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={blogPosts.filter(a => (category === 'all' || a.category === category) && (a.title.toLowerCase().includes(search.toLowerCase()) || (a.content && a.content.replace(/<[^>]+>/g, '').toLowerCase().includes(search.toLowerCase())))).length <= page * pageSize}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;