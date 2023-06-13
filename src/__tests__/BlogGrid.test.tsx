import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogGrid from '../components/BlogGrid';
import { fetchBlogPosts } from '../services/api';

jest.mock('../services/api', () => ({
  fetchBlogPosts: jest.fn(),
}));

describe('BlogGrid', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the blog posts', async () => {
    const mockBlogPosts = [
      {
        id: 1,
        title: 'Test Title 1',
        content: 'Test Content 1',
      },
      {
        id: 2,
        title: 'Test Title 2',
        content: 'Test Content 2',
      },
    ];

    // Mock the fetchBlogPosts function to return mockBlogPosts
    (fetchBlogPosts as jest.Mock).mockResolvedValue({
      count: 2,
      data: mockBlogPosts,
    });

    render(<BlogGrid />);

    // Wait for the blog posts to be rendered
    await waitFor(() => {
      const blogPostElements = screen.getAllByTestId('blog-post');
      expect(blogPostElements).toHaveLength(2);
    });

    // Check if the blog post titles are rendered correctly
    const blogPostTitles = screen.getAllByTestId('blog-post-title');
    expect(blogPostTitles[0]).toHaveTextContent('Test Title 1');
    expect(blogPostTitles[1]).toHaveTextContent('Test Title 2');
  });

  test('searches for blog posts', async () => {
    const mockBlogPosts = [
      {
        id: 1,
        title: 'Test Title 1',
        content: 'Test Content 1',
      },
    ];

    // Mock the fetchBlogPosts function to return mockBlogPosts
    (fetchBlogPosts as jest.Mock).mockResolvedValue({
      count: 1,
      data: mockBlogPosts,
    });

    render(<BlogGrid />);

    // Enter a search query
    const searchInput = screen.getByPlaceholderText('Search by title');
    fireEvent.change(searchInput, { target: { value: 'Test' } });

    // Click the search button
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);

    // Wait for the search results to be rendered
    await waitFor(() => {
      const blogPostElements = screen.getAllByTestId('blog-post');
      expect(blogPostElements).toHaveLength(1);
    });

    // Check if the search query is passed to the fetchBlogPosts function
    expect(fetchBlogPosts).toHaveBeenCalledWith(1, 10, undefined, { title: 'Test' });
  });
});
