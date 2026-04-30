# Extract text from Word document
import subprocess
import sys

# Use PowerShell to read the DOCX file
ps_script = """
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = $false
$doc = $word.Documents.Open("C:\\Users\\ALlahabi\\Desktop\\cmder\\Mojaz\\بحث التخرج\\بحث التخرج.docx")
$text = $doc.Content.Text
$doc.Close($false)
$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Output $text
"""

result = subprocess.run(
    ["powershell", "-NoProfile", "-Command", ps_script],
    capture_output=True,
    text=True,
    encoding="utf-8",
)

print("STDOUT:", result.stdout[:5000] if result.stdout else "Empty")
print("STDERR:", result.stderr[:2000] if result.stderr else "None")
print("Return code:", result.returncode)
