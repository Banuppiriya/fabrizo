import React from 'react';

const blogPosts = [
  {
    title: 'The Art of Bespoke Tailoring',
    date: 'August 15, 2024',
    excerpt: 'Discover the craftsmanship and attention to detail that goes into every bespoke garment we create.',
    link: '/blog/bespoke-tailoring',
  },
  {
    title: 'Choosing the Right Fabric for Your Suit',
    date: 'July 30, 2024',
    excerpt: 'A guide to selecting the perfect fabric that matches your style and occasion.',
    link: '/blog/fabric-selection',
  },
  {
    title: 'Tailoring Trends for 2024',
    date: 'July 10, 2024',
    excerpt: 'Stay ahead with the latest trends in tailoring and fashion for the upcoming year.',
    link: '/blog/tailoring-trends-2024',
  },
];

const BlogPreview = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="border rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{post.date}</p>
              <p className="text-gray-700 mb-4">{post.excerpt}</p>
              <a href={post.link} className="text-blue-600 hover:underline">
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
