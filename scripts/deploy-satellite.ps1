[CmdletBinding()]
param([Parameter(Mandatory)][string]$Tag)
$ErrorActionPreference='Stop'
& python "$PSScriptRoot/satellite-release.py" deploy --tag $Tag
if ($LASTEXITCODE -ne 0) { throw 'Satellite deployment failed' }
