[CmdletBinding()]
param([string]$GradlePath)
$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
$signing=Join-Path $root '.local/android-signing'
New-Item -ItemType Directory -Force $signing | Out-Null
$settings=Join-Path $signing 'signing.json'
if (!(Test-Path -LiteralPath $settings)) {
  $random=[Security.Cryptography.RandomNumberGenerator]::GetBytes(36)
  @{password=[Convert]::ToBase64String($random)} | ConvertTo-Json | Set-Content -LiteralPath $settings -Encoding utf8
}
$private=Get-Content -LiteralPath $settings -Raw | ConvertFrom-Json
$env:FANOUS_SIGNING_PASSWORD=$private.password
$env:FANOUS_SIGNING_STORE=Join-Path $signing 'fanous-satellite.jks'
$env:JAVA_HOME='C:/Program Files/Android/Android Studio/jbr'
$env:ANDROID_HOME=Join-Path $env:LOCALAPPDATA 'Android/Sdk'
if (!(Test-Path -LiteralPath $env:FANOUS_SIGNING_STORE)) {
  & "$env:JAVA_HOME/bin/keytool.exe" -genkeypair -keystore $env:FANOUS_SIGNING_STORE -storepass:env FANOUS_SIGNING_PASSWORD -keypass:env FANOUS_SIGNING_PASSWORD -alias fanous-satellite -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=Fanous Satellite, O=Fanous, C=NZ'
  if ($LASTEXITCODE -ne 0) { throw 'Android signing-key generation failed' }
}
if (!$GradlePath) {
  $GradlePath=Get-ChildItem "$env:USERPROFILE/.gradle/wrapper/dists/gradle-8.11.1-bin" -Recurse -Filter gradle.bat | Select-Object -First 1 -ExpandProperty FullName
}
if (!$GradlePath) { throw 'Install Gradle 8.11.1 or supply -GradlePath; Android SDK 35 and JDK 17+ are required.' }
& $GradlePath -p (Join-Path $root 'android') --no-daemon assembleRelease lintRelease
if ($LASTEXITCODE -ne 0) { throw 'Android build/lint failed' }
$apk=Join-Path $root 'android/app/build/outputs/apk/release/app-release.apk'
$tools=Join-Path $env:ANDROID_HOME 'build-tools/35.0.0'
& "$tools/apksigner.bat" verify --verbose --print-certs $apk
if ($LASTEXITCODE -ne 0) { throw 'APK signature verification failed' }
$download=Join-Path $root 'services/satellite/downloads'
New-Item -ItemType Directory -Force $download | Out-Null
Copy-Item -LiteralPath $apk -Destination (Join-Path $download 'fanous-satellite.apk')
$hash=(Get-FileHash -LiteralPath $apk -Algorithm SHA256).Hash.ToLowerInvariant()
$manifest=@{version='1.1.0';versionCode=2;package='online.fanous.satellite';minSdk=26;targetSdk=35;sha256=$hash;bytes=(Get-Item -LiteralPath $apk).Length;url='/satellite-api/download/fanous-satellite.apk'}
[IO.File]::WriteAllText((Join-Path $download 'manifest.json'), (($manifest | ConvertTo-Json) -replace "`r`n","`n") + "`n", [Text.UTF8Encoding]::new($false))
Write-Output "Verified Android APK SHA-256: $hash"
