import React from 'react';

interface BlogPostProps {
  id: number;
  title: string;
  content: string;
  // Add more properties as per your API response
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p>{content}</p>
    </div>
  );
};

export default BlogPost;
