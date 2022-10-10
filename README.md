## Getting Started For New Build
first, run install package:

```bash
npm install
npm install @capacitor/core @capacitor/clinpx 
```

Second, run the `cap add` to create android workflow:

```bash
cap init --web-dir=out
npx cap add android
```

third, run the build-mobile:

```bash
npm run build-mobile
```

fourth, build apk:

```bash
./gradlew assembleRelease
```

then check apk in `./android/app/build/outputs/apk/release/`


## Getting Started For Exiting Build
first, run install package:

```bash
npm install
```

Second, run the build-mobile:

```bash
npm run build-mobile
```

Third, build apk:

```bash
./gradlew assembleRelease
```

then check apk in `./android/app/build/outputs/apk/release/`

## Getting Started For Live Dev

first, run install package:
```bash
npm install
```

TBA

for signing APP : https://medium.com/@hasangi/making-a-signed-apk-for-your-react-native-application-98e8529678db
