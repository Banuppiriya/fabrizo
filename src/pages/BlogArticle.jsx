
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';


const BlogArticle = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get(`/blog/${slug}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Article not found');
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="text-lg text-neutral-500">Loading article...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-neutral-700 dark:text-neutral-200">{error || 'Sorry, we couldn\'t find the article you\'re looking for.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-sm text-neutral-500 mb-6">{article.date}</div>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
};

export default BlogArticle;
