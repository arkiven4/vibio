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

If successfully build, you can check the image result using command:

```sh
ls -l dist/*.AppImage
```

## Run on Target Device

First, you need libfuse.so.2 to run the image.
On Arch-Linux you can install using command:

```sh
sudo pacman -S fuse2
```

then add executable to the image:

```sh
chmod a+x *.AppImage
```

Finally, you can run using command:

```sh
./*.AppImage
```

### Cleaning Builds

To clean current build and modules, you can run command:

```sh
npm ci
rm -rf dist/
rm -rf node_modules/
```

### GPIO Dev

Set Folder for GPIO file dump

```sh
export FILEDMP=/run/media/arkiven4/Project/Lab/Vibio/gpio
```

Then Start App. 

After app enter Home Page, in the `$FILEDMP` folder, there are `gpio.txt` file. it contain code that readed by app to simulate click by button.

```sh
0 -> Idle
1 -> Button 1
2 -> Button 2
3 -> Button 3
Etc...
```

For Example, When Button 1 is pressed, change value in `gpio.txt` to 1, so the app will read it and simulate click fist button / card in the app