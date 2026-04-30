import os
import re

directory = r'c:\Users\ALlahabi\Desktop\cmder\Mojaz\src\frontend\src\services'
# Pattern to match: axios.get('/path' or axios.get(`/path`
# Also handles apiClient.post etc.
pattern = re.compile(r"(\.(get|post|patch|put|delete)\s*\(\s*)(['\"`])/([^/][^'\"`]*?)(['\"`])")

for filename in os.listdir(directory):
    if filename.endswith('.ts'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = pattern.sub(r'\1\3\4\5', content)
        
        if new_content != content:
            print(f"Updating {filename}")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
        else:
            print(f"Skipping {filename}")
