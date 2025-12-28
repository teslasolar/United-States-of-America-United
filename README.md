# United States of America United

**An Alternate History of American Isolationism and Innovation**

[![Deploy to GitHub Pages](https://github.com/teslasolar/United-States-of-America-United/actions/workflows/deploy.yml/badge.svg)](https://github.com/teslasolar/United-States-of-America-United/actions/workflows/deploy.yml)

## Overview

An interactive branching narrative exploring an alternate timeline where America chose isolationism and internal technical progress over global intervention after World War II.

**The Premise:** What if the resources spent on the Marshall Plan, NATO, Korea, Vietnam, and endless foreign interventions had instead been redirected to American innovation, infrastructure, and scientific advancement? What if immigration was limited to merit-only (top scientists and engineers)? What if America truly put America first?

This storybook lets you explore multiple timelines, make critical decisions, and discover different possible Americas.

## Features

- **Branching Narrative** - Your choices shape history across multiple paths
- **Multiple Endings** - Discover different possible futures for America
- **Progress Tracking** - Auto-save, bookmarks, and state management via localStorage
- **Rich Story Content** - Historical foundation with speculative alternate history
- **Responsive Design** - Works beautifully on desktop and mobile
- **Dark Mode** - Americana-themed design with rich color palette

## Technology Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** - Static site generator
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Alpine.js](https://alpinejs.dev/)** - Reactive UI components
- **Vanilla JavaScript** - State management and navigation
- **GitHub Pages** - Static hosting with automated deployment

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/teslasolar/United-States-of-America-United.git
cd United-States-of-America-United

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot reload
npm start

# Or run separately:
npm run dev      # Eleventy dev server (localhost:8080)
npm run css:dev  # Tailwind CSS watch mode
```

### Build

```bash
# Build for production
npm run deploy
```

Output will be in the `_site/` directory, ready for deployment.

## Project Structure

```
United-States-of-America-United/
├── src/
│   ├── _data/              # Site metadata and story graph
│   │   ├── site.json       # Site configuration
│   │   └── storyGraph.js   # Story graph builder
│   ├── _includes/          # Templates and components
│   │   ├── layouts/        # Base and story layouts
│   │   └── components/     # Reusable UI components
│   ├── story/              # Story content (markdown)
│   │   ├── story.json      # Story structure definition
│   │   ├── prologue/       # Historical foundation (1900-1945)
│   │   ├── divergence/     # The crossroads (1945)
│   │   ├── path-*/         # Different story branches
│   │   └── endings/        # Multiple endings
│   ├── assets/             # Static assets
│   │   ├── css/            # Tailwind CSS
│   │   ├── js/             # JavaScript (state management)
│   │   ├── img/            # Images
│   │   ├── audio/          # Audio files
│   │   └── video/          # Video files
│   └── index.njk           # Homepage
├── .eleventy.js            # Eleventy configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies and scripts
```

## Story Structure

The narrative is built on a branching structure defined in `src/story/story.json`:

- **Prologue** - Historical foundation (1900-1945)
- **Divergence Point** - 1945 crossroads decision
- **Three Main Paths:**
  - **Fortress America** - Full isolationism, tech focus
  - **Silicon Dawn** - Selective engagement, innovation priority
  - **American Unity** - Domestic focus, infrastructure investment
- **Multiple Endings** - Based on player choices

## Adding Content

### Creating a Story Node

1. Create a new markdown file in the appropriate `src/story/` subdirectory
2. Add frontmatter with metadata:

```markdown
---
nodeId: path-name/node-id
title: "Your Story Title"
layout: layouts/story.njk
era: era-name
year: "1950-1960"
type: story  # or "decision" or "ending"
nextNode: next-node-id
tags:
  - tag1
  - tag2
---

# Your Story Content

Write your story content here in Markdown...
```

3. Add the node to `src/story/story.json` in the `nodes` object

### Creating a Decision Point

For decision nodes, add choices in the frontmatter:

```yaml
type: decision
choices:
  - id: choice-1
    text: "Choice Title"
    description: "What happens if you choose this"
    nextNode: next-node-id
    consequences:
      - consequence_id
```

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch via GitHub Actions.

**Manual deployment:**

```bash
npm run deploy
```

Then push the `_site/` directory to the `gh-pages` branch or configure GitHub Pages to use GitHub Actions.

## Contributing

This is a creative project exploring alternate history. Contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Add new story paths or improve existing content
4. Submit a pull request

## Themes Explored

- American isolationism vs interventionism
- Technology development in absence of foreign wars
- Merit-based immigration and its impacts
- Domestic unity vs global diversity
- Infrastructure investment vs military spending
- Scientific progress unencumbered by international politics

## License

MIT License - See LICENSE file for details

## Acknowledgments

Built with modern web technologies and inspired by alternate history thought experiments.

---

**Ready to explore?** Visit the [live site](https://teslasolar.github.io/United-States-of-America-United/) and start your journey through alternate Americas.
