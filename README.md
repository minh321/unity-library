# Unity Lead Library

An encyclopedia for two interviews plus a Unity 6.0 ebook:

1. **Unity Team Leader** on an interactive 3D simulation and online collaboration product (Mobile + PC)
2. A later **VFX / Technical Artist** screen: Particle System, Visual Effect Graph, Shader Graph, and Unity 6 render pipelines
3. **Unity 6 ebook** — reading-order chapters through the [6000.0 User Manual](https://docs.unity3d.com/6000.0/Documentation/Manual/index.html) and [Scripting API](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/index.html), plus Unity’s official programming e-books

Every article lists **Unity 6 (6000.0)** Manual or package **17** documentation. A live trainer chat sits on the right: ask about a heading you do not understand. The trainer stays inside this library. It will not invent a Team Leader title, a Technical Artist title, a VFX Graph shipping credit, or a 30-user 3D collaboration room you have not shipped.

## Run locally

You need Node.js 18 or newer.

```bash
npm install
npm run dev
```

Next.js starts on port **43147**. Open [http://localhost:43147](http://localhost:43147).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (run `build` first) |

## How to use it

- Pick an article in the left index. Hash URLs (`#particle-system`) deep-link an article.
- Read **Unity 6 documentation** at the top of each article, then the article itself.
- Click **Ask** on a heading, or type in the trainer. Context is the article you are on.
- Run **Check yourself** where an article has a practice set (four production questions).
- Search the index by title, tag, or doc title.

## Library map

| Wing | What it is for |
| --- | --- |
| Start here | Role, product, study order |
| Unity engineering | C#, architecture, lifecycle, profiling, rendering, Addressables, animation, UI |
| Rooms and platforms | Collaboration netcode, Mobile + PC |
| Delivery | Incidents, requirements, AI policy |
| Leadership | Title gap, review, conflict |
| **VFX / Technical Artist** | Particle System, VFX Graph, Shader Graph, URP 17 / HDRP, plus a **plain-language** path (kitchen metaphor, two graphs, Learning Templates) so you can speak before you sit with Unity’s PDF |
| **Unity 6 ebook** | Manual atlas, Scripting API core types, Awaitable, official Unity PDFs |
| Interview craft | Spoken structure, stories, question banks |
| Reference | Glossary, checklists, further study |

## Honesty rules (do not skip)

Use this sentence for the Team Leader panel:

> I have not yet held the formal Team Leader title for a full year, but I have already performed several lead-level responsibilities.

Use this sentence for the Technical Artist panel:

> I have not worked under a formal Technical Artist title. I am a Unity engineer who has shipped live titles and measured CPU, GPU, and memory.

Do not claim a shipped 30-user 3D collaboration room or a production VFX Graph library you do not have.

## Trainer

The chat is a local retrieval agent over this encyclopedia (no API key, no server). It runs in the browser so the library can be hosted on GitHub Pages. If a mechanism is not in the library, the trainer says so and points at Unity 6 docs instead of inventing a node.

Progress from the older interview-lab quiz engine still lives in the repo for **Check yourself** scoring. The home page is the encyclopedia.

## Host on GitHub Pages (free, same as the CV)

Source: [github.com/minh321/unity-library](https://github.com/minh321/unity-library)

Public site:

[https://minh321.github.io/unity-library/](https://minh321.github.io/unity-library/)

Keep the repo **public**. Private GitHub Pages is paid. Public Pages is free, like [gamedev-cv](https://minh321.github.io/gamedev-cv/).

### Publish

```bash
git remote add github https://github.com/minh321/unity-library.git
git push -u github main
```

If GitHub already created a README commit you do not need:

```bash
git push -u github main --force
```

Then: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

**Actions** → **Deploy to GitHub Pages** runs on every push to `main`. When it is green, open https://minh321.github.io/unity-library/

The first run can fail until Pages is set to GitHub Actions. Enable that, then re-run the workflow.

Do not commit the `out/` folder. GitHub Actions builds it.
