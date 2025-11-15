
'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { YoutubeTranscript } from 'youtube-transcript';
import puppeteer from 'puppeteer';

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
        response = await axios.get(readmeUrl, { timeout: 5000 });
    } catch (e) {
        readmeUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`;
        response = await axios.get(readmeUrl, { timeout: 5000 });
    }
    
    return `GitHub Repository: ${owner}/${repo}\n\n${response.data}`;
  } catch (error) {
    // Fallback to dynamic content extraction if README fetch fails
    return await extractWebContent(url);
  }
}

async function extractPDFContent(url: string): Promise<string> {
  // PDF extraction is a complex server-side task.
  // This is a placeholder for a more robust implementation.
  // For now, we'll indicate that it's a PDF and let the AI know.
  return `Content from PDF at ${url}. PDF content extraction is not fully implemented.`;
}

// Fast extraction for static sites (Cheerio)
async function extractStaticContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
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
    
    return content.replace(/\s+/g, ' ').trim();
  } catch (error: any) {
     console.warn(`Static extraction failed for ${url}: ${error.message}`);
     return ""; // Return empty string to trigger fallback
  }
}

// Slow but thorough extraction for SPAs (Puppeteer)
async function extractDynamicContent(url: string): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });
  
    const page = await browser.newPage();
    
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    await page.setViewport({ width: 1920, height: 1080 });
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });
    
    // Additional wait for any lazy-loaded content
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = await page.evaluate(() => {
      const unwanted = document.querySelectorAll('script, style, nav, footer, header, .ad, .advertisement');
      unwanted.forEach(el => el.remove());
      
      const main = document.querySelector('main') || 
                   document.querySelector('article') ||
                   document.querySelector('.content') ||
                   document.querySelector('body');
      
      return main?.innerText || '';
    });
    
    await browser.close();
    
    if (!content || content.length < 100) {
      throw new Error('Could not extract meaningful content from rendered page');
    }
    
    return content.replace(/\s+/g, ' ').trim().slice(0, 50000);
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}


async function extractWebContent(url: string): Promise<string> {
  try {
    const staticContent = await extractStaticContent(url);
    
    // If static extraction is successful, return the content
    if (staticContent && staticContent.length > 200) {
      console.log('✓ Static extraction succeeded:', url);
      return staticContent.slice(0, 50000); // Limit content size
    }
    
    // If static extraction fails or content is minimal, fall back to dynamic extraction
    console.warn('⚠ Static extraction insufficient, trying headless browser:', url);
    return await extractDynamicContent(url);
    
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
