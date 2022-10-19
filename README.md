This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).



## Build Apps

First, install necessary npm modules using command:

```sh
npm install
```

**TIPS:** In case if command failed, you can run that command again.

By default, the build target is x64 (x86_64) CPUs.
You can switch target using command (example for ARM32 chips):

```sh
sed -i 's#"nextron build -l"#"nextron build -l --armv7l"#g' package.json
```

Second, build the apps using command:

```sh
npm run build
```

**TIPS:** In case nextron main scripts is not executable, you can run this command:

```sh
chmod a+x node_modules/nextron/bin/nextron.js
```
