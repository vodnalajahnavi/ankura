import re
import json

def process_i18n():
    with open('src/i18n.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the languages keys
    langs = ["English", "Hindi", "Telugu", "Tamil", "Kannada", "Marathi"]
    
    # We will just parse the JS object using a quick regex to extract keys for each language.
    # Since it's a JS object, it's safer to use regex to find missing keys and append them to the end of the language block if missing.
    
    # Let's extract English keys
    en_match = re.search(r'English:\s*\{([^}]+)\}', content)
    if not en_match:
        print("Could not find English block!")
        return
        
    en_body = en_match.group(1)
    en_keys = re.findall(r'(\w+):\s*"', en_body)
    print("English keys:", len(en_keys))
    
    new_content = content
    for lang in langs[1:]:
        lang_match = re.search(fr'{lang}:\s*\{{([^}}]+)\}}', new_content)
        if not lang_match:
            print(f"Could not find {lang} block!")
            continue
            
        lang_body = lang_match.group(1)
        lang_keys = re.findall(r'(\w+):\s*"', lang_body)
        
        missing = [k for k in en_keys if k not in lang_keys]
        if missing:
            print(f"Adding missing keys to {lang}: {missing}")
            # Add them right before the closing brace of the language block
            # Get the exact key-value from English
            for key in missing:
                # Find the english definition
                k_val_match = re.search(fr'{key}:\s*"([^"\\]*(?:\\.[^"\\]*)*)"', en_body)
                if k_val_match:
                    val = k_val_match.group(1)
                    # For simplicity, append it using the english value as fallback, wrapped in quotes
                    # But if we want to translate them... let's just use English value as fallback so it doesn't break
                    # Let's try to append right before the closing brace
                    replacement = fr'{lang_body.rstrip()}, {key}: "{val}"\n  '
                    new_content = new_content.replace(lang_match.group(1), replacement)
                
    if new_content != content:
        with open('src/i18n.js', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated i18n.js with missing keys as fallbacks.")
    else:
        print("No missing keys found.")

process_i18n()
