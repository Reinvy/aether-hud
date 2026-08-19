#!/usr/bin/env python3
import os
import sys
import json
import time
import urllib.request
import urllib.parse

BASE_API = "https://genshin-impact.fandom.com/api.php"
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

TARGET_DIR_REF = "/Volumes/Reinshy/Workspace/Personal/Aether HUD/aether-hud/references/assets/UI Icons"
TARGET_DIR_PUB = "/Volumes/Reinshy/Workspace/Personal/Aether HUD/aether-hud/public/ui-icons"
REGISTRY_MD = "/Volumes/Reinshy/Workspace/Personal/Aether HUD/aether-hud/references/UI_ICONS.md"

os.makedirs(TARGET_DIR_REF, exist_ok=True)
os.makedirs(TARGET_DIR_PUB, exist_ok=True)

def fetch_category_files(category_name):
    files = []
    cmcontinue = None
    while True:
        params = {
            "action": "query",
            "list": "categorymembers",
            "cmtitle": f"Category:{category_name}",
            "cmlimit": "500",
            "format": "json"
        }
        if cmcontinue:
            params["cmcontinue"] = cmcontinue
        
        url = f"{BASE_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                members = data.get("query", {}).get("categorymembers", [])
                for m in members:
                    if m.get("ns") == 6: # File namespace
                        files.append(m["title"])
                cmcontinue = data.get("continue", {}).get("cmcontinue")
                if not cmcontinue:
                    break
        except Exception as e:
            print(f"Error fetching category {category_name}: {e}")
            break
        time.sleep(0.2)
    return files

def fetch_image_urls(titles):
    image_map = {}
    chunk_size = 40
    for i in range(0, len(titles), chunk_size):
        chunk = titles[i:i+chunk_size]
        params = {
            "action": "query",
            "titles": "|".join(chunk),
            "prop": "imageinfo",
            "iiprop": "url|size",
            "format": "json"
        }
        url = f"{BASE_API}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                pages = data.get("query", {}).get("pages", {})
                for pid, pdata in pages.items():
                    title = pdata.get("title")
                    ii = pdata.get("imageinfo")
                    if ii and len(ii) > 0:
                        image_map[title] = ii[0].get("url")
        except Exception as e:
            print(f"Error fetching imageinfo for chunk {i}: {e}")
        time.sleep(0.2)
    return image_map

def sanitize_filename(title):
    # Remove "File:" prefix
    name = title.replace("File:", "").strip()
    return name

def main():
    print("1. Fetching Category:UI_Icons and Category:Paimon_Menu_Icons files...")
    ui_files = fetch_category_files("UI_Icons")
    paimon_files = fetch_category_files("Paimon_Menu_Icons")
    
    # Also fetch other key icons like Item_Primogem, Item_Mora, Item_Crown_of_Insight
    extra_files = [
        "File:Item Primogem.png",
        "File:Item Mora.png",
        "File:Item Crown of Insight.png",
        "File:Item Intertwined Fate.png",
        "File:Item Acquaint Fate.png",
        "File:Icon Time.png",
        "File:Icon Settings.png",
        "File:Icon Quest.png",
        "File:Icon Quest Log.png",
        "File:Icon Artifacts.png",
        "File:Icon Domain.png",
        "File:Icon Talents.png",
        "File:Icon Character.png",
        "File:Icon Character Aether.png",
        "File:Icon Character Lumine.png",
        "File:Icon Friends.png",
        "File:Icon Mail.png",
        "File:Icon Wish.png",
        "File:Icon Events.png",
        "File:Icon Serenitea Pot.png",
        "File:Icon Adventurer Handbook.png",
        "File:Icon Achievements.png",
        "File:Icon Battle Pass.png",
        "File:Icon Inventory.png",
        "File:Icon Map.png",
        "File:Icon Shop.png",
        "File:Icon Feedback.png",
        "File:Icon Community.png",
        "File:Icon Notice.png",
        "File:Icon Switch Character.png"
    ]
    
    all_titles = list(set(ui_files + paimon_files + extra_files))
    print(f"Found total {len(all_titles)} unique files to resolve.")
    
    print("2. Resolving direct download URLs from Fandom CDN...")
    image_map = fetch_image_urls(all_titles)
    print(f"Resolved {len(image_map)} download URLs.")
    
    print("3. Downloading image files...")
    downloaded = []
    for title, img_url in image_map.items():
        if not img_url:
            continue
        fname = sanitize_filename(title)
        ref_path = os.path.join(TARGET_DIR_REF, fname)
        pub_path = os.path.join(TARGET_DIR_PUB, fname)
        
        # Download if not already existing
        if not os.path.exists(ref_path) or os.path.getsize(ref_path) < 100:
            try:
                req = urllib.request.Request(img_url, headers=HEADERS)
                with urllib.request.urlopen(req, timeout=15) as resp, open(ref_path, "wb") as out_f:
                    out_f.write(resp.read())
            except Exception as e:
                print(f"Failed to download {fname}: {e}")
                continue
            time.sleep(0.05)
        
        # Ensure it is true PNG format using sips
        try:
            import subprocess
            subprocess.run(["sips", "-s", "format", "png", ref_path, "--out", ref_path], capture_output=True)
            with open(ref_path, "rb") as rf, open(pub_path, "wb") as pf:
                pf.write(rf.read())
            downloaded.append(fname)
        except Exception as e:
            print(f"Failed to process {fname}: {e}")
            
    print(f"Successfully downloaded & mirrored {len(downloaded)} UI Icons.")
    
    print("4. Generating references/UI_ICONS.md registry documentation...")
    downloaded.sort()
    
    # Categorize icons
    categories = {
        "Paimon Menu & Navigation": [],
        "Quests, Commissions & Domains": [],
        "Items, Currency & Rewards": [],
        "Character, Roles & Talents": [],
        "Social, Co-Op & Serenitea Pot": [],
        "General UI & Systems": []
    }
    
    for fname in downloaded:
        low = fname.lower()
        if any(k in low for k in ["primogem", "mora", "crown", "fate", "item"]):
            categories["Items, Currency & Rewards"].append(fname)
        elif any(k in low for k in ["quest", "commission", "domain", "handbook", "abyss", "bounty"]):
            categories["Quests, Commissions & Domains"].append(fname)
        elif any(k in low for k in ["character", "talent", "role", "dps", "support", "constellation"]):
            categories["Character, Roles & Talents"].append(fname)
        elif any(k in low for k in ["friend", "mail", "serenitea", "co-op", "community", "chat"]):
            categories["Social, Co-Op & Serenitea Pot"].append(fname)
        elif any(k in low for k in ["paimon", "archive", "inventory", "map", "shop", "wish", "event", "battle pass", "achieve"]):
            categories["Paimon Menu & Navigation"].append(fname)
        else:
            categories["General UI & Systems"].append(fname)
            
    with open(REGISTRY_MD, "w", encoding="utf-8") as f:
        f.write("# Genshin Impact UI Icons — Master Reference Registry\n\n")
        f.write("> **Source:** [Genshin Impact Fandom Wiki (Category:UI_Icons)](https://genshin-impact.fandom.com/wiki/Category:UI_Icons)\n")
        f.write(f"> **Total Registered Assets:** {len(downloaded)} PNG icons\n")
        f.write("> **Asset Locations:** `references/assets/UI Icons/` (Master) & `public/ui-icons/` (Web Runtime)\n\n")
        f.write("---\n\n")
        
        for cat_name, icon_list in categories.items():
            if not icon_list:
                continue
            f.write(f"## {cat_name} ({len(icon_list)} icons)\n\n")
            f.write("| Icon Name | Web Path | File System Reference |\n")
            f.write("|---|---|---|\n")
            for icon_name in icon_list:
                web_path = f"/ui-icons/{urllib.parse.quote(icon_name)}"
                ref_link = f"[references/assets/UI Icons/{icon_name}](file:///Volumes/Reinshy/Workspace/Personal/Aether%20HUD/aether-hud/references/assets/UI%20Icons/{urllib.parse.quote(icon_name)})"
                f.write(f"| `{icon_name}` | `{web_path}` | {ref_link} |\n")
            f.write("\n---\n\n")
            
    print(f"Registry generated successfully at {REGISTRY_MD}.")

if __name__ == "__main__":
    main()
