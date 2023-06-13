import React, { useEffect, useState } from 'react';
import { fetchBlogPosts, PaginationResponse } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  content: string;
}

const BlogGrid: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response: PaginationResponse = await fetchBlogPosts(currentPage, 10, undefined, {
        title: searchQuery
      });
      setBlogPosts(response.data);
      setTotalPages(Math.ceil(response.count / 10));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const handlePaginationClick = (page: number) => {
    setCurrentPage(page);
    setSearchQuery('');
    navigate(`?page=${page}`);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setCurrentPage(1);
    navigate(`?search=${encodeURIComponent(searchQuery)}`);
  };

  useEffect(() => {
    fetchPosts();
    navigate(`?page=${currentPage}&search=${encodeURIComponent(searchQuery)}`);
  }, [currentPage, searchQuery, navigate]);

  useEffect(() => {
    if (isSearching) {
      fetchPosts();
      setIsSearching(false);
    }
  }, [isSearching]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>

      <div className="flex items-center mb-8">
        <input
          type="text"
          placeholder="Search by title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded border"
        />

        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="border border-gray-300 p-4">
            <h2 className="text-xl font-bold mb-4">{post.title}</h2>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePaginationClick(page)}
            className={`px-4 py-2 border rounded ${
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'
            } hover:bg-blue-100`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;
