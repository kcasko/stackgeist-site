// StackGeist JSON-LD helpers. Every field returned here must be verifiable
// from the page it's attached to; never fabricate ratings, prices, or specs.

type SchemaObj = Record<string, unknown>;

export function productSchema(input: {
  name: string;
  description: string;
  image?: string;
  url: string;
  brand?: string;
  sku?: string;
}): SchemaObj {
  const out: SchemaObj = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: input.url,
  };
  if (input.image) out.image = input.image;
  if (input.brand) out.brand = { '@type': 'Brand', name: input.brand };
  if (input.sku) out.sku = input.sku;
  return out;
}

export function articleSchema(input: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}): SchemaObj {
  const out: SchemaObj = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: input.url,
    author: { '@type': 'Organization', name: input.author ?? 'StackGeist' },
    publisher: { '@type': 'Organization', name: 'StackGeist' },
  };
  if (input.image) out.image = input.image;
  if (input.datePublished) out.datePublished = input.datePublished;
  if (input.dateModified) out.dateModified = input.dateModified;
  return out;
}

export function howToSchema(input: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
  image?: string;
}): SchemaObj {
  const out: SchemaObj = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
  if (input.image) out.image = input.image;
  return out;
}

export function faqSchema(input: {
  questions: { question: string; answer: string }[];
}): SchemaObj {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: input.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  };
}
