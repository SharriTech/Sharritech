import os
from pathlib import Path

FOLDER = Path(r"C:\Users\diama\Downloads\Sharritech-main\Sharritech-main")

# Files to update
files_to_fix = ['index.html', 'TV.html', 'Frigorifer.html', 'frizat.html', 
                'lavatriqe.html', 'enelarese.html', 'Shporetelektrik.html', 
                'thithese.html', 'bojler.html', 'klima.html', 'telefon.html', 
                'trotinet.html', 'kositese.html', 'pllaka.html', 'smartwatch.html', 
                'tablet.html']

# The line to remove (with different spacing variations)
lines_to_remove = [
    '<a href="mikroval.html">Mikrovalë</a>\n',
    '<a href="mikroval.html">Mikrovalë</a>',
    '            <a href="mikroval.html">Mikrovalë</a>\n',
    '        <a href="mikroval.html">Mikrovalë</a>\n',
]

fixed = 0

for filename in files_to_fix:
    filepath = FOLDER / filename
    if not filepath.exists():
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove mikroval link
    for line in lines_to_remove:
        content = content.replace(line, '')
    
    # Also try case-insensitive removal
    import re
    content = re.sub(r'\s*<a[^>]*href=["\']mikroval\.html["\'][^>]*>.*?</a>\s*', '', content, flags=re.IGNORECASE)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Removed Mikrovalë from {filename}")
        fixed += 1

print(f"\n🎉 Done! Removed Mikrovalë from {fixed} files")
print("📝 Refresh your browser (Ctrl+F5)")