import json
import codecs

try:
    with open('src/i18n.js', 'rb') as f:
        data = f.read()
    
    encodings = ['utf-8', 'utf-16le', 'utf-16be', 'latin-1']
    for enc in encodings:
        try:
            text = data.decode(enc)
            print("Encoding:", enc)
            print("Text snippets:")
            print(text[:1000])
            break
        except Exception as e:
            continue
except Exception as e:
    print(e)
