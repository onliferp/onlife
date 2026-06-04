Select-String -Path "index.html" -Pattern "Salty|salty|Push-to-Talk|PTT|Voice|voice" -Encoding UTF8 | ForEach-Object { ($_.LineNumber.ToString() + ": " + $_.Line.Trim()) }
