const fs = require('fs');
const pandoc = require('pandoc');
const remark = require('remark');
const parse = require('remark-parse');

const docxPath = './word1.docx'; // Replace with your DOCX file path
const markdownPath = './markdown.md'; // Replace with the desired Markdown file path

const pandocOptions = {
  from: 'docx',
  to: 'markdown',
};

// Convert DOCX to Markdown using Pandoc
pandoc(docxPath, pandocOptions, (error, result) => {
  if (error) {
    console.error('Error:', error);
  } else {
    const markdown = result.toString();
    console.log('Converted Markdown:', markdown);

    // Parse the converted Markdown content
    const ast = remark().use(parse).parse(markdown);

    // Extract headings
    const headings = ast.children.filter((node) => node.type === 'heading').map((node) => node.children[0].value);

    // Extract bullet points
    const bulletPoints = ast.children.filter((node) => node.type === 'list').flatMap((node) => node.children).map((node) => node.children[0].value);

    console.log('Headings:', headings);
    console.log('Bullet points:', bulletPoints);

    // Save the extracted data to a file or use it as needed
    // ...

    // You can continue with further processing or save the extracted data to a file
    // ...
  }
});
