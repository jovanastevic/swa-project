# AI - Frontend
Made with Astro and [Shadcn](https://ui.shadcn.com/) with [React](https://docs.astro.build/en/guides/integrations-guide/react/) 
Components. Shadcn is a UI Library similiar to Bootstrap. It's built on top of TailwindCSS.

## Project Structure

Astro Project Structure, more details can be found in the [Astro Docs](https://docs.astro.build/en/basics/project-structure/).

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── api-client
│   │   └── logo-light.svg - etc..
│   ├── assets
│   │   └── logo-light.svg - etc..
│   ├── components
│   │   └── ui - Folder with all the UI components from Shadcn
│   │   └── CreatePromptCard.tsx - etc..
│   ├── layouts
│   │   └── Layout.astro - etc..
│   └── pages
│       └── index.astro - etc..
│   └── styles
│       └── global.css - Changes to the global styles of the project

└── package.json
```

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
|:--------------------------|:-------------------------------------------------|
| `npm install`             | Installs dependencies                            |
| `npm run generate:api`    | Creates API client based on OpenAPI format       |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Start the project

To start the project, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all dependencies.
4. Run `npm run generate:api` to generate the API client based on the OpenAPI specification.
5. Run `npm run dev` to start the development server.
6. Open your web browser and go to `http://localhost:4321` to view