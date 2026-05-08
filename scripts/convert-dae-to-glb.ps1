param(
  [string]$DaeDir = "assests\converted-dae",
  [string]$GlbDir = "public\models",
  [string]$BlenderExe = "blender"
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$daePath = Join-Path $projectRoot $DaeDir
$glbPath = Join-Path $projectRoot $GlbDir
$pythonScript = Join-Path $PSScriptRoot "dae-to-glb.py"

if (!(Test-Path $daePath)) {
  throw "DAE directory not found: $daePath. Export .skp files from SketchUp first."
}

New-Item -ItemType Directory -Force -Path $glbPath | Out-Null

& $BlenderExe --background --python $pythonScript -- $daePath $glbPath

if ($LASTEXITCODE -ne 0) {
  throw "Blender conversion failed with exit code $LASTEXITCODE"
}

Write-Host "GLB files written to: $glbPath"
