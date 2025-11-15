
'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';

export type LinkType = 
  | 'youtube'
  | 'github'
  | 'pdf'
  | 'article'
  | 'documentation'
  | 'news'
  | 'unknown';

export async function detectLinkType(url: string): Promise<LinkType> {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (urlLower.includes('github.com')) {
    return 'github';
  }
  
  if (urlLower.endsWith('.pdf')) {
    return 'pdf';
  }
  
  if (
    urlLower.includes('docs.') ||
    urlLower.includes('/docs/') ||
    urlLower.includes('documentation')
  ) {
    return 'documentation';
  }
  
  if (
    urlLower.includes('medium.com') ||
    urlLower.includes('substack.com') ||
    urlLower.includes('techcrunch.com') ||
    urlLower.includes('nytimes.com')
  ) {
    return 'news';
  }
  
  return 'article';
}

async function extractYouTubeContent(url: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return transcript.map(t => t.text).join(' ');
  } catch (error: any) {
    throw new Error(`Failed to extract YouTube transcript: ${error.message}`);
  }
}

async function extractGitHubContent(url: string): Promise<string> {
  try {
    const parts = url.replace('https://github.com/', '').split('/');
    const owner = parts[0];
    const repo = parts[1];
    
    let readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`;
    let response;
    try {
        response = await axios.get(readmeUrl, { timeout: 10000 });
    } catch (e) {
        readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
        response = await axios.get(readmeUrl, { timeout: 10000 });
    }
    
    return `GitHub Repository: ${owner}/${repo}\n\n${response.data}`;
  } catch (error) {
    return await extractWebContent(url);
  }
}

async function extractPDFContent(url: string): Promise<string> {
  return `PDF content extraction from ${url} (requires backend processing)`;
}

async function extractWebContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    
    const $ = cheerio.load(response.data);
    
    $('script, style, nav, footer, .ad, .advertisement, noscript, header').remove();
    
    let content = '';
    
    if ($('article').length > 0) {
      content = $('article').text();
    }
    else if ($('main').length > 0) {
      content = $('main').text();
    }
    else if ($('.content, .post-content, .entry-content, .article-body').length > 0) {
      content = $('.content, .post-content, .entry-content, .article-body').first().text();
    }
    else {
      content = $('body').text();
    }
    
    content = content
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 50000); 
    
    if (!content || content.length < 100) {
        // Fallback to just text
        content = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 50000);
        if (!content || content.length < 100) {
            throw new Error('Could not extract meaningful content');
        }
    }
    
    return content;
  } catch (error: any) {
    throw new Error(`Failed to extract web content from ${url}: ${error.message}`);
  }
}


export async function extractContent(url: string): Promise<{content: string, type: LinkType}> {
    const type = await detectLinkType(url);
    let content: string;
    
    switch (type) {
        case 'youtube':
        content = await extractYouTubeContent(url);
        break;
        
        case 'github':
        content = await extractGitHubContent(url);
        break;
        
        case 'pdf':
        content = await extractPDFContent(url);
        break;
        
        case 'article':
        case 'news':
        case 'documentation':
        default:
        content = await extractWebContent(url);
        break;
    }
    return { content, type };
}
