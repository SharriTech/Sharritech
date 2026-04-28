import os
from pathlib import Path
import re

# 📁 UPDATE THIS IF YOUR FOLDER PATH IS DIFFERENT
FOLDER = Path(r"C:\Users\diama\Downloads\Sharritech-main\Sharritech-main")
SCRIPT_TAG = '    <script src="js/main.js"></script>\n'

added = 0
skipped = 0
errors = 0

print("🔍 Scanning HTML files...\n")

for html_file in FOLDER.glob("*.html"):
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Skip if already added
        if 'js/main.js' in content:
            skipped += 1
            continue

        # Find the LAST </body> tag (handles malformed/multiple tags safely)
        body_matches = list(re.finditer(r'</body\s*>', content, re.IGNORECASE))
        
        if body_matches:
            insert_pos = body_matches[-1].start()  # Last occurrence
        else:
            insert_pos = len(content)  # Fallback: append to end

        # Insert script tag
        new_content = content[:insert_pos] + SCRIPT_TAG + content[insert_pos:]

        # Save back
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(new_content)

        added += 1
        print(f"✅ {html_file.name}")
        
    except Exception as e:
        errors += 1
        print(f"❌ {html_file.name}: {e}")

print(f"\n{'='*40}")
print(f"🎉 DONE!")
print(f"✅ Added to: {added} files")
print(f"⏭️ Skipped (already had it): {skipped} files")
print(f"❌ Errors: {errors} files")
print(f"{'='*40}")
print("💡 Make sure 'js/main.js' exists in your project folder!")