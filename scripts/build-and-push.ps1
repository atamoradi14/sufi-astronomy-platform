#Requires -Version 7.0
[CmdletBinding()]
param([Parameter(Mandatory)][string]$Tag)
$ErrorActionPreference = 'Stop'
& python "$PSScriptRoot/release.py" build-and-push --tag $Tag
if ($LASTEXITCODE -ne 0) { throw 'Manderia build/push failed.' }
