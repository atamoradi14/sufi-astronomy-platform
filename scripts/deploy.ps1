#Requires -Version 7.0
[CmdletBinding()]
param([ValidateSet('apply','status')][string]$Action='apply',[string]$Tag,[switch]$DryRun)
$ErrorActionPreference = 'Stop'
$arguments = @("$PSScriptRoot/release.py", $(if ($Action -eq 'apply') { 'deploy' } else { 'status' }))
if ($Tag) { $arguments += @('--tag', $Tag) }
if ($DryRun) { $arguments += '--dry-run' }
& python @arguments
if ($LASTEXITCODE -ne 0) { throw 'Manderia deployment failed.' }
