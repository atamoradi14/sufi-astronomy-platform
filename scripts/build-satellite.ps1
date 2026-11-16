[CmdletBinding()]
param([Parameter(Mandatory)][string]$Tag)
$ErrorActionPreference='Stop'
& python "$PSScriptRoot/satellite-release.py" build-and-push --tag $Tag
if ($LASTEXITCODE -ne 0) { throw 'Satellite build/push failed' }
