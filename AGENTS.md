## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)


## Astro prose gotcha

Any `<lowercase-word>` appearing in prose inside an .astro file is parsed as a JSX/component tag and will break the build with 'Expected corresponding JSX closing tag.' This bites when you write CLI placeholders like `<interface>`, `<port>`, or `<onboard interface>` in guide bodies. Always HTML-escape the angle brackets: `&lt;interface&gt;`. Uppercase like `<Component>` is fine (real component). Also watch: writing `won\u2019t` (double-backslashed) in a JS string literal ships as a literal backslash-u \u2014 use the real character \u2019 or a single-backslash unicode escape `\u2019`.
