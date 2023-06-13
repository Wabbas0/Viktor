// src/services/api.ts

import axios, { AxiosResponse } from 'axios';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  // Add more properties as per your API response
}

export interface PaginationResponse {
  count: number;
  data: BlogPost[];
}

interface FilterOptions {
  category?: string;
  author?: string;
}

interface SearchOptions {
  title?: string;
}

const API_BASE_URL = 'https://cms.viktor.ai';

export async function fetchBlogPosts(
  page = 1,
  limit = 10,
  filters?: FilterOptions,
  search?: SearchOptions
): Promise<PaginationResponse> {
  let url = `${API_BASE_URL}/blogposts?_start=${(page - 1) * limit}&_limit=${limit}`;

  if (filters?.category) {
    url += `&blogpost_categories.id=${filters.category}`;
  }

  if (filters?.author) {
    url += `&author.id=${filters.author}`;
  }

  if (search?.title) {
    url += `&title_contains=${encodeURIComponent(search.title)}`;
  }

  const response: AxiosResponse<BlogPost[]> = await axios.get(url);
  const countResponse: AxiosResponse<number> = await axios.get(`${API_BASE_URL}/blogposts/count`);

  return {
    count: countResponse.data,
    data: response.data,
  };
}

export async function fetchCategories(): Promise<string[]> {
  const response: AxiosResponse<string[]> = await axios.get(`${API_BASE_URL}/blogpost-categories`);
  return response.data;
}

export async function fetchAuthors(): Promise<string[]> {
  const response: AxiosResponse<string[]> = await axios.get(`${API_BASE_URL}/authors`);
  return response.data;
}
