# SketchUp `.skp` to `.glb` Conversion

Browsers cannot directly display SketchUp `.skp` files. Convert them in two steps:

1. SketchUp exports `.skp` to COLLADA `.dae`.
2. Blender converts `.dae` to binary glTF `.glb`.

## Folder Layout

Place SketchUp files here:

```text
assests/sketches/
```

Current examples:

```text
assests/sketches/1DSWU450-01.skp
assests/sketches/2DSU750-01.skp
```

Exported intermediate files go here:

```text
assests/converted-dae/
```

Final web models go here:

```text
public/models/
```

## Step 1: Export `.skp` to `.dae`

Open SketchUp, then open Ruby Console and run:

```ruby
ENV["SPACEMINT_SKP_DIR"] = "D:/SpaceMint_Web_App/assests/sketches"
ENV["SPACEMINT_DAE_DIR"] = "D:/SpaceMint_Web_App/assests/converted-dae"
load "D:/SpaceMint_Web_App/scripts/sketchup-export-skp-to-dae.rb"
```

## Step 2: Convert `.dae` to `.glb`

Install Blender and make sure `blender` is available in PATH.

Then run from PowerShell:

```powershell
.\scripts\convert-dae-to-glb.ps1
```

If Blender is not in PATH:

```powershell
.\scripts\convert-dae-to-glb.ps1 -BlenderExe "C:\Program Files\Blender Foundation\Blender 4.3\blender.exe"
```

The website can then load models from:

```text
/models/<model-name>.glb
```

For example:

```text
assests/sketches/1DSWU450-01.skp
assests/converted-dae/1DSWU450-01.dae
public/models/1DSWU450-01.glb
/models/1DSWU450-01.glb
```
