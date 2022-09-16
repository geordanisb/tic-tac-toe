This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

The project was build with yarn, typescript, nextjs, reqct-query (for react cache), sqlite, prismajs as ORM and cypress for e2e tests.

The games info are stored in a sqlite file underfolder : /prisma/database.db

First create a `.env` file in the root folder, with a structure like:


DATABASE_URL="file:./database.db"

NEXT_PUBLIC_WEBAPP_URL=http://localhost:3000


```bash
yarn install
# or
npm install
```

To modify or review the code source, before generate prisma types for safe type checking -running: 

```bash
yarn prisma generate
```


Them, run the development server:

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start  new game with buttos in the right column under the game board.

New games created by default are seleceted as the active one.

Click on the grid cell to make a move.

The games data stored could be review on: http://localhost:3000/api/tic-tac-toe/play

To clean the database run: yarn prisma migrate reset


To run test (that will open cypress suit, the test implemented are e2e type):

```bash
yarn test
# or
npm run test
```

## About Nextjs

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
