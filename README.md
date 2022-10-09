This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



## Build Apps
first, run install dependency:

```bash
npm install
```

Second, build the apps:

```bash
npm run build

```

check `dist` folder

change `package.json`.scripts.build to add custom build
```code
--help,    -h  shows this help message
--version, -v  displays the current version of nextron
--all          builds for Windows, macOS and Linux
--win,     -w  builds for Windows, accepts target list (see https://goo.gl/jYsTEJ)
--mac,     -m  builds for macOS, accepts target list (see https://goo.gl/5uHuzj)
--linux,   -l  builds for Linux, accepts target list (see https://goo.gl/4vwQad) 
--x64          builds for x64
--ia32         builds for ia32
--armv7l       builds for armv7l
--arm64        builds for arm64
--universal    builds for mac universal binary
--no-pack      skip electron-builder pack command
--publish  -p  Publish artifacts (see https://goo.gl/tSFycD)
                [choices: "onTag", "onTagOrDraft", "always", "never", undefined]
```