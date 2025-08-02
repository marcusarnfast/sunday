![hero](.github/banner.png)

## About
Sunday is a platform sharing summerhouses with friends and family.

### Why does sunday exists?
I built Sunday in about a week while staying at my family's summerhouse, mostly because managing bookings over group chats was becoming a mess. Sunday started as a quick solution to keep things in order, but it also became a fun way to explore Convex, test out the Resend email API, and build something real from scratch.

It’s open-source, useful, and part of my portfolio. If you're hiring or looking for someone who enjoys building full-stack products end-to-end, I’m open to opportunities [marcus@arnfast.me](mailto:marcus@arnfast.me).

## Architecture
Sunday is a monorepo powered by Turborepo, using pnpm for package management and Biome for formatting and linting.

The stack includes:

Next.js frontend styled with Tailwind CSS and shadcn/ui

Convex (named Monday in this project) as the backend for database, auth, and logic

Resend + React Email for sending transactional emails


### Filestructure
apps:
- web (next.js)
- mobile (expo) <- coming soon

packages:
- emails (React Email)
- monday (Convex)
- ui (tailwindcss, shadcn/ui, origin-ui)

toolings:
- typescript

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.