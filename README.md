# ig news

![app_preview](./git_assets/app-preview.png?raw=true)

This is a [Next.js](https://nextjs.org/) project created for studying purposes.
The idea of this project is to allow readers to subscribe on the platform so they can read premium content.

## Integrations

- [Stripe](https://stripe.com/): used for managing subscriptions and payments
- [Fauna DB](https://fauna.com/): used for storing subscriptions and users data
- [NextAuth](https://next-auth.js.org/): used for handling authentication. We are using only Github in this application.
- [Prismic.io](https://prismic.io/): Headless CMS used for managing content such as Blog Posts, articles and so on.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Alternatively, you can run **Prismic.io Slicemachine**, which is an app integrated where you can create your custom types and slices for your content.

```bash
yarn slicemachine
```

Open [http://localhost:9999](http://localhost:9999) with your browser to see the slicemachine app.

More info: https://prismic.io/docs/technical-reference/slice-machine-ui

## Utilities

- Eslint
- Prettier
- Husky
- Lint Staged
