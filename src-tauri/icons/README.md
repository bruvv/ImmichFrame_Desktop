Icon files generated using [this file in the main ImmichFrame repo](https://github.com/immichFrame/ImmichFrame/blob/main/design/AppIcon.png) with this command:

```
$ npm run -- tauri icon ../ImmichFrame/design/AppIcon.png
```

And remove unused files:

```
$ cd src-tauri/icons
$ rm -r android ios Square* StoreLogo.png
```
