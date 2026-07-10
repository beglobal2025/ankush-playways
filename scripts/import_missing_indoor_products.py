#!/usr/bin/env python3
import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PDF = Path("/home/dsy/Documents/ankush playways/Indoor Catalogue March 2026-.pdf")
WORK = Path("/tmp/ankush-catalogue-xml")
PRODUCTS_JSON = ROOT / "products.json"
PUBLIC_CATALOGUE = ROOT / "public" / "catalogue"


MISSING_PRODUCTS = [
    {
        "id": "puzzle-alphabet",
        "name": "Alphabet",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_5.jpg",
    },
    {
        "id": "puzzle-numbers",
        "name": "Numbers",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_6.jpg",
    },
    {
        "id": "puzzle-opposites",
        "name": "Opposites",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_7.jpg",
    },
    {
        "id": "puzzle-where-am-i",
        "name": "Where Am I",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_4.jpg",
    },
    {
        "id": "puzzle-size-it-up",
        "name": "Size it up",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_1.jpg",
    },
    {
        "id": "puzzle-things-i-can-do",
        "name": "Things I Can Do",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_3.jpg",
    },
    {
        "id": "puzzle-whats-wrong",
        "name": "What's Wrong",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_8.jpg",
    },
    {
        "id": "puzzle-parts-of-the-body",
        "name": "Parts Of The Body",
        "category": "Puzzles",
        "price": 305,
        "image": "catalogue-95_2.jpg",
    },
    {
        "id": "mat-eva-numbers",
        "name": "Eva Mat Numbers",
        "category": "Mats",
        "price": 990,
        "image": "catalogue-98_1.jpg",
    },
    {
        "id": "mat-eva-alphabets",
        "name": "Eva Mat Alphabets",
        "category": "Mats",
        "price": 2490,
        "image": "catalogue-98_3.jpg",
    },
    {
        "id": "mat-folding-xpe-size-l",
        "name": "Folding Mat XPE - Size L",
        "category": "Mats",
        "price": 1990,
        "image": "catalogue-98_4.jpg",
        "specifications": {"size": "L"},
    },
    {
        "id": "mat-folding-xpe-size-xl",
        "name": "Folding Mat XPE - Size XL",
        "category": "Mats",
        "price": 2490,
        "image": "catalogue-98_5.jpg",
        "specifications": {"size": "XL"},
    },
    {
        "id": "mat-rolling-carpet",
        "name": "Rolling Carpet",
        "category": "Mats",
        "price": 1190,
        "image": "catalogue-98_2.jpg",
        "specifications": {
            "variants": [
                {"size": "S", "price": 1190},
                {"size": "M", "price": 1390},
                {"size": "L", "price": 1690},
                {"size": "XL", "price": 1990},
            ]
        },
    },
    {
        "id": "mat-eva-1mx1m-25mm",
        "name": "Eva Mat 1Mx1M - 25mm",
        "category": "Mats",
        "price": 1690,
        "image": "catalogue-99_2.jpg",
        "specifications": {"size": "1Mx1M", "thickness": "25mm"},
    },
    {
        "id": "mat-eva-1mx1m-20mm",
        "name": "Eva Mat 1Mx1M - 20mm",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_6.jpg",
        "specifications": {"size": "1Mx1M", "thickness": "20mm"},
    },
    {
        "id": "mat-eva-1mx1m-20mm-2",
        "name": "Eva Mat 1Mx1M - 20mm",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_8.jpg",
        "specifications": {"size": "1Mx1M", "thickness": "20mm"},
    },
    {
        "id": "mat-eva-2ft-2ft",
        "name": "Eva Mat 2ft x 2ft",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_7.jpg",
        "specifications": {
            "size": "2ft x 2ft",
            "variants": [
                {"thickness": "12mm", "set": "4 Pcs.", "price": 1290},
                {"thickness": "20mm", "set": "4 Pcs.", "price": 1990},
            ],
        },
    },
    {
        "id": "mat-eva-2ft-2ft-black",
        "name": "Eva Mat 2ft x 2ft Black",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_3.jpg",
        "specifications": {"size": "2ft x 2ft", "color": "Black", "thickness": "12mm", "set": "4 Pcs."},
    },
    {
        "id": "mat-eva-2ft-2ft-blue",
        "name": "Eva Mat 2ft x 2ft Blue",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_4.jpg",
        "specifications": {"size": "2ft x 2ft", "color": "Blue", "thickness": "12mm", "set": "4 Pcs."},
    },
    {
        "id": "mat-eva-2ft-2ft-grey",
        "name": "Eva Mat 2ft x 2ft Grey",
        "category": "Mats",
        "price": 1290,
        "image": "catalogue-99_5.jpg",
        "specifications": {"size": "2ft x 2ft", "color": "Grey", "thickness": "12mm", "set": "4 Pcs."},
    },
]


TOY_FIXES = [
    {"id": "lft-011", "name": "Shape Sorter", "price": 699, "crop": {"page": 93, "left": 30, "top": 115, "right": 230, "bottom": 330}},
    {"id": "lft-012", "name": "Baby's First Blocks", "price": 499, "crop": {"page": 93, "left": 235, "top": 115, "right": 380, "bottom": 330}},
    {"id": "lft-013", "name": "Roll Ball", "price": 599, "crop": {"page": 93, "left": 390, "top": 115, "right": 615, "bottom": 330}},
    {"id": "lft-014", "name": "Shape Sorting Baby Toy", "price": 899, "crop": {"page": 93, "left": 615, "top": 115, "right": 870, "bottom": 330}},
    {
        "id": "lft-015",
        "name": "Fun Inertia Animal Car",
        "price": 1196,
        "crop": {"page": 93, "left": 25, "top": 570, "right": 870, "bottom": 750},
        "specifications": {"set": "4 Pcs.", "models": ["Horse", "Zebra", "Sheep", "Lion"]},
    },
    {
        "id": "lft-016",
        "name": "My First Car",
        "price": 1196,
        "crop": {"page": 93, "left": 25, "top": 930, "right": 870, "bottom": 1115},
        "specifications": {"set": "4 Pcs.", "models": ["Police", "Ambulance", "Taxi", "Bus"]},
    },
    {"id": "lft-051", "name": "Stack-o-Barrel", "price": 179, "crop": {"page": 96, "left": 35, "top": 105, "right": 230, "bottom": 290}},
    {"id": "lft-052", "name": "Stack-o-Egg", "price": 239, "crop": {"page": 96, "left": 245, "top": 105, "right": 440, "bottom": 290}},
    {"id": "lft-053", "name": "Stack-o-Cups", "price": 199, "crop": {"page": 96, "left": 455, "top": 105, "right": 640, "bottom": 290}},
    {"id": "lft-054", "name": "Stack-o-Cubes", "price": 249, "crop": {"page": 96, "left": 665, "top": 105, "right": 855, "bottom": 290}},
    {"id": "lft-92", "name": "Sand Toys", "price": 299, "crop": {"page": 96, "left": 20, "top": 340, "right": 240, "bottom": 585}},
    {"id": "lft-97c", "name": "Toddler Ring", "price": 499, "crop": {"page": 96, "left": 250, "top": 345, "right": 430, "bottom": 585}},
    {"id": "lft-98", "name": "Bowling Set Jumbo", "price": 1395, "crop": {"page": 96, "left": 445, "top": 385, "right": 655, "bottom": 585}},
    {"id": "lft-99", "name": "Bowling Set", "price": 995, "crop": {"page": 96, "left": 445, "top": 385, "right": 655, "bottom": 585}},
    {"id": "lft-1203", "name": "FruitsCutting", "price": 699, "crop": {"page": 96, "left": 665, "top": 380, "right": 860, "bottom": 585}},
    {"id": "lft-1204", "name": "Vegetables Cutting", "price": 699, "crop": {"page": 96, "left": 20, "top": 640, "right": 240, "bottom": 840}},
    {
        "id": "pu6cm1",
        "name": "Fun PU Balls",
        "price": 249,
        "crop": {"page": 96, "left": 230, "top": 650, "right": 430, "bottom": 835},
        "specifications": {"unit": "Per Pcs"},
    },
    {"id": "fb3cm1", "name": "Football", "price": 799, "crop": {"page": 96, "left": 445, "top": 635, "right": 655, "bottom": 845}},
    {"id": "bb3cm1", "name": "Basketball", "price": 549, "crop": {"page": 96, "left": 660, "top": 635, "right": 855, "bottom": 845}},
    {
        "id": "lft-1201",
        "name": "Fruits Cutting",
        "price": 399,
        "crop": {"page": 96, "left": 35, "top": 920, "right": 215, "bottom": 1120},
    },
    {
        "id": "lft-1202",
        "name": "Vegetables Cutting",
        "price": 399,
        "crop": {"page": 96, "left": 235, "top": 920, "right": 420, "bottom": 1120},
    },
    {"id": "lft-1209", "name": "Fruits", "price": 499, "crop": {"page": 96, "left": 450, "top": 915, "right": 650, "bottom": 1120}},
    {"id": "lft-1210", "name": "Vegetables", "price": 499, "crop": {"page": 96, "left": 660, "top": 915, "right": 850, "bottom": 1120}},
    {"id": "lft-90d", "name": "Hopscotch", "price": 1199, "crop": {"page": 97, "left": 40, "top": 90, "right": 275, "bottom": 345}},
    {"id": "lft-1241", "name": "Digital Ice Lolly", "price": 1199, "crop": {"page": 97, "left": 485, "top": 95, "right": 700, "bottom": 345}},
    {"id": "lft-1151", "name": "Xylophone", "price": 599, "crop": {"page": 97, "left": 70, "top": 340, "right": 275, "bottom": 505}},
    {"id": "lft-1152", "name": "Xylophone Big", "price": 899, "crop": {"page": 97, "left": 330, "top": 335, "right": 560, "bottom": 505}},
    {"id": "lft-1243", "name": "Bin Buddy", "price": 499, "crop": {"page": 97, "left": 585, "top": 325, "right": 835, "bottom": 530}},
    {"id": "lft-1231", "name": "Doctor set", "price": 899, "crop": {"page": 97, "left": 25, "top": 575, "right": 240, "bottom": 795}},
    {"id": "lft-1232", "name": "Kitchen set", "price": 899, "crop": {"page": 97, "left": 255, "top": 575, "right": 455, "bottom": 795}},
    {"id": "lft-1233", "name": "Tool kit", "price": 899, "crop": {"page": 97, "left": 455, "top": 575, "right": 660, "bottom": 795}},
    {"id": "lft-1234", "name": "Beauty set", "price": 899, "crop": {"page": 97, "left": 665, "top": 575, "right": 860, "bottom": 795}},
    {"id": "lft-1221", "name": "Wild Animal Set", "price": 499, "crop": {"page": 97, "left": 25, "top": 900, "right": 210, "bottom": 1095}},
    {"id": "lft-1222", "name": "Farm Set", "price": 499, "crop": {"page": 97, "left": 230, "top": 900, "right": 415, "bottom": 1095}},
    {"id": "lft-1223", "name": "Ocean Animal Set", "price": 599, "crop": {"page": 97, "left": 440, "top": 900, "right": 635, "bottom": 1095}},
    {"id": "lft-1224", "name": "Insects Set", "price": 499, "crop": {"page": 97, "left": 655, "top": 900, "right": 845, "bottom": 1095}},
]


FLASH_CARD_FIXES = [
    {"id": "lft-1251", "name": "Alphabet", "crop": {"page": 94, "left": 35, "top": 120, "right": 250, "bottom": 380}},
    {"id": "lft-1252", "name": "Numbers", "crop": {"page": 94, "left": 255, "top": 120, "right": 465, "bottom": 380}},
    {"id": "lft-1253", "name": "Colours & Shapes", "crop": {"page": 94, "left": 470, "top": 120, "right": 680, "bottom": 380}},
    {"id": "lft-1254", "name": "Vegetables", "crop": {"page": 94, "left": 685, "top": 120, "right": 875, "bottom": 380}},
    {"id": "lft-1255", "name": "Fruits", "crop": {"page": 94, "left": 35, "top": 470, "right": 250, "bottom": 730}},
    {"id": "lft-1256", "name": "Birds", "crop": {"page": 94, "left": 255, "top": 470, "right": 465, "bottom": 730}},
    {"id": "lft-1257", "name": "Animals", "crop": {"page": 94, "left": 470, "top": 470, "right": 680, "bottom": 730}},
    {"id": "lft-1258", "name": "Parts Of The Body", "crop": {"page": 94, "left": 685, "top": 470, "right": 875, "bottom": 730}},
    {"id": "lft-1259", "name": "Vechicles", "crop": {"page": 94, "left": 70, "top": 815, "right": 315, "bottom": 1075}},
    {"id": "lft-1260", "name": "Community Helpers", "crop": {"page": 94, "left": 335, "top": 815, "right": 580, "bottom": 1075}},
    {"id": "lft-1261", "name": "Opposites", "crop": {"page": 94, "left": 605, "top": 815, "right": 845, "bottom": 1075}},
]


def slugify(value):
    return "".join(ch.lower() if ch.isalnum() else "-" for ch in value).strip("-").replace("--", "-")


def ensure_pdf_cache():
    xml = WORK / "catalogue.xml"
    image = WORK / "catalogue-95_5.jpg"
    if xml.exists() and image.exists():
        return
    WORK.mkdir(parents=True, exist_ok=True)
    subprocess.run(["pdftohtml", "-xml", str(PDF), str(WORK / "catalogue")], check=True)


def copy_image(item):
    category_slug = slugify(item["category"])
    dest_dir = PUBLIC_CATALOGUE / category_slug / item["id"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "cover.jpg"
    shutil.copyfile(WORK / item["image"], dest)
    return f"/catalogue/{category_slug}/{item['id']}/cover.jpg"


def render_page(page_number):
    out_prefix = WORK / f"repair-page-{page_number}"
    out_file = WORK / f"repair-page-{page_number}.jpg"
    if out_file.exists():
        return out_file
    subprocess.run(
        [
            "pdftoppm",
            "-f",
            str(page_number),
            "-l",
            str(page_number),
            "-jpeg",
            "-r",
            "160",
            str(PDF),
            str(out_prefix),
        ],
        check=True,
    )
    generated = WORK / f"repair-page-{page_number}-1.jpg"
    if not generated.exists():
        generated = sorted(WORK.glob(f"repair-page-{page_number}-*.jpg"))[0]
    generated.replace(out_file)
    return out_file


def copy_crop(item, category):
    from PIL import Image

    crop = item["crop"]
    page = render_page(crop["page"])
    img = Image.open(page).convert("RGB")
    sx = img.width / 892
    sy = img.height / 1262
    box = (
        int(crop["left"] * sx),
        int(crop["top"] * sy),
        int(crop["right"] * sx),
        int(crop["bottom"] * sy),
    )
    category_slug = slugify(category)
    dest_dir = PUBLIC_CATALOGUE / category_slug / item["id"]
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "cover.jpg"
    img.crop(box).save(dest, quality=92)
    return f"/catalogue/{category_slug}/{item['id']}/cover.jpg"


def copy_catalogue_asset(item, category):
    if "crop" in item:
        return copy_crop(item, category)
    return copy_image({**item, "category": category})


def main():
    ensure_pdf_cache()
    products = json.loads(PRODUCTS_JSON.read_text(encoding="utf-8"))
    by_id = {item["id"]: item for item in products}
    added = 0
    updated = 0
    fixed_toys = 0

    for item in MISSING_PRODUCTS:
        image = copy_catalogue_asset(item, item["category"])
        record = {
            "id": item["id"],
            "name": item["name"],
            "category": item["category"],
            "price": item["price"],
            "specifications": item.get("specifications", {}),
            "images": [image],
        }
        if item["id"] in by_id:
            by_id[item["id"]].update(record)
            updated += 1
        else:
            products.append(record)
            added += 1

    for item in TOY_FIXES:
        if item["id"] not in by_id:
            continue
        image = copy_catalogue_asset(item, "Toys")
        by_id[item["id"]].update({
            "name": item["name"],
            "category": "Toys",
            "price": item["price"],
            "specifications": item.get("specifications", by_id[item["id"]].get("specifications", {})),
            "images": [image],
        })
        fixed_toys += 1

    fixed_flash_cards = 0
    for item in FLASH_CARD_FIXES:
        if item["id"] not in by_id:
            continue
        image = copy_catalogue_asset(item, "Flash Cards")
        by_id[item["id"]].update({
            "name": item["name"],
            "category": "Flash Cards",
            "price": 299,
            "specifications": by_id[item["id"]].get("specifications", {}),
            "images": [image],
        })
        fixed_flash_cards += 1

    PRODUCTS_JSON.write_text(json.dumps(products, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({
        "added": added,
        "updated": updated,
        "fixed_toys": fixed_toys,
        "fixed_flash_cards": fixed_flash_cards,
        "total": len(products),
    }, indent=2))


if __name__ == "__main__":
    main()
