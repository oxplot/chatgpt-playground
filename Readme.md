# ChatGPT Playground

A simple UI to OpenAI's ChatGPT API. Main features include:

- Variables: provide a way to create template prompts.
- State and link sharing: import/export the full state of the
  converation as JSON. Also allows for storing state in a link that once
  opened, restores the entire state.

## Development

Install dependencies and run the development server:

```
npm i
npm run dev
```

ESBuild will automatically rebuild when any source files change.

For production build, run `npm run build`. All the files will be in the
`out/` directory and can be served using any web server.
