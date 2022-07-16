[![cheatsheets](https://user-images.githubusercontent.com/6839576/139080815-b8e556a0-fcca-41d0-83a1-0faffaa42be1.png)](https://github.com/ohmycheatsheet/cheatsheets)

*Cheatsheets is designed to **Note-Organize-Share**, it's a knowledge cheatsheets management web-app! It allows you manage cheatsheets with github issues, you can organize with labels.* 

## features

### Easy and fast develop

Fork this template, and follow the develop guide. 🚀  Deploy website on [netlify](https://app.netlify.com/) or [vercel](https://vercel.com) platform. 

### Auto check updates

Provide cron ci workflow, check latest updates from source [template](https://github.com/ohmycheatsheet/cheatsheets) every day. And will open Pull Request with latest features. 

### Sync and search

Each time crud issues or labels, it sync issues data to [algolia](https://www.algolia.com/) datasets. Benifit algolia search engine, therefore ohmycheatsheets support full-text search with highlighting of the search query.

### Share

ohmycheatsheets build on top of [Next.js](https://nextjs.org/) SSR. Therefore, you can share your cheathsheets with url, it's friendly to social media share. If you don't like share with url, ohmycheatsheets also support generate image of cheatsheet, you can download it, and paste it anywhere.

### Notification

Everyday ohmycheatsheets will send a random cheatsheet to your [slack](https://slack.com/) channel. Help your review your knowledage.

### Free

Every thing used in ohmycheatsheets is free.

### snapshots

<div align='center'>

![homepage](https://user-images.githubusercontent.com/6839576/167288880-0bfae6c1-5f91-4ce3-97df-20889c9cf71c.png)
*▲ omcs*

</div>

## usage

### Datasets

Create a dataset on [algolia](https://www.algolia.com/)

### Deploy

#### vercel

1. Use this repo as template
2. New dataset from [algolia](https://www.algolia.com/)
3. Set below github repo secrets

     - `ALGOLIA_APPID=<ALGOLIA_APPID>` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
     - `ALGOLIA_APP_KEY=<ALGOLIA_APP_KEY>` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
     - (Optional)`SLACK_WEBHOOK=<SLACK_WEBHOOK>` - check [actions-friday](https://github.com/ohmycheatsheet/actions-friday) usage

4. Deploy to Vercel'now, in [Vercel](https://vercel.com/) deployments settings, set below env variables as `Production & Preview & Development Environment Variables`
    
    [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

    - `GITHUB_TOKEN`
    - `NEXT_PUBLIC_ALGOLIA_APPID` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
    - `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
    - `ALGOLIA_APP_KEY` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)

5. new `issue` on github'issue

#### netlify

1. Use this repo as template
2. New dataset from [algolia](https://www.algolia.com/)
3. Set below github repo secrets

     - `ALGOLIA_APPID=<ALGOLIA_APPID>` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
     - `ALGOLIA_APP_KEY=<ALGOLIA_APP_KEY>` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
     - (Optional)`SLACK_WEBHOOK=<SLACK_WEBHOOK>` - check [actions-friday](https://github.com/ohmycheatsheet/actions-friday) usage

4. Deploy to Netlify'now, in [Netlify](https://app.netlify.com/) deployments settings, set below env variables as `Production & Preview & Development Environment Variables`
    
    [![Deploy with Netlify](https://vercel.com/button)](https://app.netlify.com/)

    - `GITHUB_TOKEN`
    - `NEXT_PUBLIC_ALGOLIA_APPID` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
    - `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)
    - `ALGOLIA_APP_KEY` - copy from [algolia-api-keys](https://www.algolia.com/account/api-keys)

5. new `issue` on github'issue

### Analytics

Collect page-view data, set env variable `GA_MEASUREMENT_ID` from `https://analytics.google.com/`

## develop

Create `.env` file(makesure it added into `.gitignore`), setup follow environment variables. *If you already setup on vercel platform, just `vercel env pull`*

```
GITHUB_TOKEN=xxx
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=xxx
NEXT_PUBLIC_ALGOLIA_APPID=xxx
ALGOLIA_APP_KEY=xxx
```