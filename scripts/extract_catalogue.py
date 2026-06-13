#!/usr/bin/env python3
import html
import json
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET
from pathlib import Path

PDF = Path("/home/dsy/Documents/ankush playways/Indoor Catalogue March 2026-.pdf")
ROOT = Path(__file__).resolve().parents[1]
WORK = Path("/tmp/ankush-catalogue-xml")
OUT_JSON = ROOT / "products.json"
OUT_REPORT = ROOT / "catalogue-manual-review.md"
OUT_IMAGES = ROOT / "public" / "catalogue"

IGNORE_PAGES = {1, 2, 3, 100}
FOOTER_RE = re.compile(r"^(www\.|Page\s+\d+|INDOOR CATALOGUE|OUTDOOR|Little Fingers|IS 9873|CM/L|Ph-|E-mail|Follow us)", re.I)
CODE_RE = re.compile(
    r"\b(?:LFO|LFT|LFP|LF)[\s-]*[A-Z0-9]+(?:\s+[A-Z])?(?:[-/][A-Z0-9]+)*(?:[A-Z])?\b"
    r"|\b(?:PU|FB|BB)[A-Z0-9]+\b"
    r"|\bF-3\b"
)
MRP_RE = re.compile(r"MRP\s*:?\s*(?:\.{3,}|[0-9,]+(?:\.\d{1,2})?|\d+(?:,\d+)?/)(?:\s*(?:Per|per)\s*Pcs?\.?)?", re.I)
PRICE_VALUE_RE = re.compile(r"([0-9][0-9,]*(?:\.\d{1,2})?|\d+(?:,\d+)?/)")

CATEGORY_HINTS = [
    "Classroom Furnitures",
    "Premium",
    "Primary , Middle & High Classes",
    "Primary, Middle & High Classes",
    "Middle & High Classes",
    "Middle Classes",
    "Primary Classes",
    "Pre Classes",
    "For All Category Classes",
    "Soft Seating",
    "Soft Play Seating",
    "Bench",
    "Play Equipment",
    "Slides",
    "Slides & Swings",
    "Shelf & Pencil Dustbin",
    "Rockers",
    "Rockers & See-Saw",
    "Rideon",
    "Rideon & Balls",
    "Ball Pool",
    "Fence",
    "Sand pit",
    "Trampoline",
    "Gym Equipment",
    "Toy Shelf",
    "Tent House",
    "Sports",
    "Learning Toys",
    "Puppets",
    "Role Play Costumes",
    "Toys",
    "Flash Cards",
    "Puzzles",
    "Mats",
]

NAME_STOP = {
    "Dimensions",
    "Dimensions & Materials",
    "Desk:",
    "Chair:",
    "Size",
    "MRP",
    "CLASS",
    "AGE GROUP",
    "AVG SIZE",
    "PREMIUM",
}


def clean_text(value):
    value = html.unescape(value or "")
    value = re.sub(r"\s+", " ", value.replace("\u00a0", " ")).strip()
    return value


def slugify(value):
    value = clean_text(value).lower()
    value = value.replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "uncategorized"


def normalize_code(value):
    value = clean_text(value).upper().replace(" ", "")
    value = re.sub(r"^F-?3$", "F-3", value)
    value = re.sub(r"^(LF|LFT|LFP|LFO)(\d)", r"\1-\2", value)
    return value


def run_pdftohtml():
    WORK.mkdir(parents=True, exist_ok=True)
    prefix = WORK / "catalogue"
    xml_file = WORK / "catalogue.xml"
    if xml_file.exists():
        return xml_file
    subprocess.run(
        ["pdftohtml", "-xml", str(PDF), str(prefix)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return xml_file


def node_bbox(node):
    top = int(float(node.attrib.get("top", 0)))
    left = int(float(node.attrib.get("left", 0)))
    width = int(float(node.attrib.get("width", 0)))
    height = int(float(node.attrib.get("height", 0)))
    return {
        "top": top,
        "left": left,
        "width": width,
        "height": height,
        "right": left + width,
        "bottom": top + height,
        "cx": left + width / 2,
        "cy": top + height / 2,
    }


def read_pages(xml_file):
    tree = ET.parse(xml_file)
    pages = []
    for page in tree.getroot().findall("page"):
        number = int(page.attrib["number"])
        texts = []
        images = []
        for node in page:
            if node.tag == "text":
                text = clean_text("".join(node.itertext()))
                if not text:
                    continue
                item = node_bbox(node)
                item["text"] = text
                texts.append(item)
            elif node.tag == "image":
                item = node_bbox(node)
                item["src"] = node.attrib.get("src", "")
                images.append(item)
        texts.sort(key=lambda x: (x["top"], x["left"]))
        images.sort(key=lambda x: (x["top"], x["left"]))
        pages.append({
            "number": number,
            "width": int(page.attrib.get("width", 0)),
            "height": int(page.attrib.get("height", 0)),
            "texts": texts,
            "images": images,
        })
    return pages


def page_category(page, previous):
    candidates = []
    for t in page["texts"]:
        text = t["text"]
        if FOOTER_RE.search(text) or CODE_RE.search(text):
            continue
        if text in CATEGORY_HINTS:
            candidates.append((t["top"], t["left"], text))
    if candidates:
        top = min(x[0] for x in candidates)
        same_top = [x[2] for x in candidates if abs(x[0] - top) <= 20]
        return " / ".join(dict.fromkeys(same_top))
    top_lines = [
        t["text"] for t in page["texts"]
        if t["top"] < 90 and not FOOTER_RE.search(t["text"]) and not CODE_RE.search(t["text"])
    ]
    for text in top_lines:
        if len(text) >= 4 and not MRP_RE.search(text):
            return text
    return previous or "Uncategorized"


def split_codes(text):
    codes = []
    for match in CODE_RE.finditer(text):
        code = normalize_code(match.group(0))
        if code not in codes:
            codes.append(code)
    return codes


def is_product_code_text(text):
    if MRP_RE.search(text):
        return False
    if FOOTER_RE.search(text):
        return False
    return bool(split_codes(text))


def code_records_for_page(page, category):
    records = []
    seen = set()
    for text in page["texts"]:
        if not is_product_code_text(text["text"]):
            continue
        if re.search(r"\buse code\b", text["text"], re.I):
            continue
        codes = split_codes(text["text"])
        if not codes:
            continue
        for code in codes:
            key = (code, text["top"], text["left"])
            if key in seen:
                continue
            seen.add(key)
            after = text["text"]
            for raw in CODE_RE.findall(text["text"]):
                after = after.replace(raw, " ", 1)
            after = clean_text(after.strip(" ,-:"))
            item = {
                "code": code,
                "anchor": text,
                "category": category,
                "page": page["number"],
                "inline_name": after if after and after not in NAME_STOP else "",
            }
            records.append(item)
    records.sort(key=lambda r: (r["anchor"]["top"], r["anchor"]["left"], r["code"]))
    return records


def likely_name_line(text):
    if not text or text in NAME_STOP:
        return False
    if FOOTER_RE.search(text) or MRP_RE.search(text) or CODE_RE.fullmatch(text):
        return False
    if re.search(r"^(L|W|H|D|Dia|Size|Set of|Master CTN|Front Side|Back Side)\b", text, re.I):
        return False
    if len(text) <= 2:
        return False
    return True


def nearby_texts(product, page, products):
    anchor = product["anchor"]
    same_page = [p for p in products if p["page"] == page["number"]]
    next_down = [
        p["anchor"]["top"] for p in same_page
        if p is not product
        and p["anchor"]["top"] > anchor["top"] + 20
        and abs(p["anchor"]["left"] - anchor["left"]) < 190
    ]
    bottom = min(next_down) - 10 if next_down else page["height"] - 40
    if len(same_page) <= 2:
        left = 0
        right = page["width"]
    else:
        left = max(0, anchor["left"] - 170)
        right = min(page["width"], anchor["left"] + 310)
    lines = []
    for t in page["texts"]:
        if FOOTER_RE.search(t["text"]):
            continue
        if t["bottom"] < anchor["top"] - 20 or t["top"] > bottom:
            continue
        horizontal = (t["cx"] >= left and t["cx"] <= right) or abs(t["left"] - anchor["left"]) < 120
        if horizontal:
            lines.append(t)
    lines.sort(key=lambda x: (x["top"], x["left"]))
    return lines


def find_price(product, page):
    anchor = product["anchor"]
    candidates = []
    for t in page["texts"]:
        if not MRP_RE.search(t["text"]):
            continue
        dy = t["top"] - anchor["top"]
        if dy < -40:
            continue
        dx = abs(t["cx"] - anchor["cx"])
        score = dx * 0.65 + abs(dy) * 0.35
        candidates.append((score, t["text"], t))
    if not candidates:
        return None, "missing_price"
    candidates.sort(key=lambda x: x[0])
    text = candidates[0][1]
    if "." * 3 in text:
        return None, "price_on_demand"
    match = PRICE_VALUE_RE.search(text)
    if not match:
        return None, "unparsed_price"
    value = match.group(1).rstrip("/")
    try:
        return float(value.replace(",", "")), ""
    except ValueError:
        return value, "unparsed_price"


def extract_name(product, lines):
    if product["inline_name"]:
        return product["inline_name"]
    anchor = product["anchor"]
    candidates = [
        t["text"] for t in lines
        if t["top"] >= anchor["top"] - 5 and t["top"] <= anchor["top"] + 115 and likely_name_line(t["text"])
    ]
    for text in candidates:
        no_codes = CODE_RE.sub("", text)
        no_codes = clean_text(no_codes.strip(" ,-:"))
        if likely_name_line(no_codes):
            return no_codes
    return product["code"]


def extract_specs(lines, name):
    specs = {}
    details = []
    for t in lines:
        text = t["text"]
        if FOOTER_RE.search(text) or text == name:
            continue
        if MRP_RE.search(text):
            continue
        if CODE_RE.fullmatch(text):
            continue
        if re.search(r"\bSize\s*:", text, re.I):
            specs["size"] = clean_text(re.sub(r"^Size\s*:?", "", text, flags=re.I))
        elif re.match(r"^(L|W|H|D|Dia)\s*[\d.]", text, re.I) or re.search(r"\d+\s*[x×]\s*\d+", text, re.I):
            details.append(text)
        elif re.search(r"Dimensions|Materials|Desk:|Chair:|CLASS|AGE GROUP|AVG SIZE|Set of|Master CTN|pcs|piece|High-quality|Frame:", text, re.I):
            details.append(text)
        elif len(text) > 35:
            details.append(text)
    if details:
        specs["details"] = list(dict.fromkeys(details))
    return specs


def image_score(product, image):
    anchor = product["anchor"]
    dx = abs(image["cx"] - anchor["cx"])
    dy = abs(image["cy"] - anchor["cy"])
    if image["cy"] < anchor["top"] - 320:
        dy += 250
    return dx * 0.65 + dy * 0.35


def find_image(product, page):
    images = []
    for image in page["images"]:
        area = image["width"] * image["height"]
        if area < 12000:
            continue
        if image["width"] > page["width"] * 0.9 and image["height"] > page["height"] * 0.35:
            continue
        images.append(image)
    if not images:
        return None
    images.sort(key=lambda img: image_score(product, img))
    return images[0]


def copy_cover(image, category, code):
    category_slug = slugify(category)
    code_slug = slugify(code)
    dest_dir = OUT_IMAGES / category_slug / code_slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "cover.jpg"
    src = Path(image["src"])
    if not src.exists():
        src = WORK / Path(image["src"]).name
    if src.exists():
        shutil.copyfile(src, dest)
        return f"/catalogue/{category_slug}/{code_slug}/cover.jpg"
    return None


def render_page(page_number):
    out_prefix = WORK / f"render-page-{page_number}"
    out_file = WORK / f"render-page-{page_number}.jpg"
    if out_file.exists():
        return out_file
    generated = WORK / f"render-page-{page_number}-1.jpg"
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
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    if not generated.exists():
        matches = sorted(WORK.glob(f"render-page-{page_number}-*.jpg"))
        generated = matches[0] if matches else generated
    if generated.exists():
        generated.replace(out_file)
    return out_file


def copy_page_crop(product, page, products, category, code):
    from PIL import Image

    render = render_page(page["number"])
    if not render.exists():
        return None

    same_page = [p for p in products if p["page"] == page["number"]]
    anchor = product["anchor"]
    next_down = [
        p["anchor"]["top"] for p in same_page
        if p is not product
        and p["anchor"]["top"] > anchor["top"] + 20
        and abs(p["anchor"]["left"] - anchor["left"]) < 220
    ]
    if len(same_page) <= 2:
        left = 0
        right = page["width"]
    else:
        left = max(0, anchor["left"] - 110)
        right = min(page["width"], anchor["left"] + 420)
    top = max(0, anchor["top"] - 80)
    bottom = min(page["height"], (min(next_down) - 10 if next_down else anchor["top"] + 520))
    if bottom - top < 220:
        bottom = min(page["height"], top + 360)

    img = Image.open(render).convert("RGB")
    sx = img.width / page["width"]
    sy = img.height / page["height"]
    crop_box = (
        int(left * sx),
        int(top * sy),
        int(right * sx),
        int(bottom * sy),
    )
    crop = img.crop(crop_box)
    category_slug = slugify(category)
    code_slug = slugify(code)
    dest_dir = OUT_IMAGES / category_slug / code_slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "cover.jpg"
    crop.save(dest, quality=92)
    return f"/catalogue/{category_slug}/{code_slug}/cover.jpg"


def main():
    xml_file = run_pdftohtml()
    pages = read_pages(xml_file)
    if OUT_IMAGES.exists():
        shutil.rmtree(OUT_IMAGES)
    products = []
    review = []
    current_category = "Uncategorized"

    page_records = {}
    for page in pages:
        if page["number"] in IGNORE_PAGES:
            continue
        current_category = page_category(page, current_category)
        records = code_records_for_page(page, current_category)
        page_records[page["number"]] = records
        products.extend(records)

    output = []
    used_ids = {}
    for product in products:
        page = next(p for p in pages if p["number"] == product["page"])
        lines = nearby_texts(product, page, products)
        name = extract_name(product, lines)
        price, price_issue = find_price(product, page)
        specs = extract_specs(lines, name)
        image = find_image(product, page)
        images = []
        issues = []

        base_id = slugify(product["code"])
        used_ids[base_id] = used_ids.get(base_id, 0) + 1
        item_id = base_id if used_ids[base_id] == 1 else f"{base_id}-{used_ids[base_id]}"

        if image:
            copied = copy_cover(image, product["category"], product["code"])
            if copied:
                images.append(copied)
            else:
                issues.append("image source missing after pdftohtml extraction")
        if not images:
            fallback = copy_page_crop(product, page, products, product["category"], product["code"])
            if fallback:
                images.append(fallback)
                issues.append("used page crop fallback for cover image")
            else:
                issues.append("no product image confidently matched")

        if price_issue:
            issues.append(price_issue.replace("_", " "))
        if name == product["code"]:
            issues.append("name could not be inferred")
        if not specs:
            issues.append("specifications are sparse or missing")

        record = {
            "id": item_id,
            "name": name,
            "category": product["category"],
            "price": price,
            "specifications": specs,
            "images": images,
        }
        output.append(record)

        if issues:
            review.append({
                "id": item_id,
                "code": product["code"],
                "name": name,
                "category": product["category"],
                "page": product["page"],
                "issues": issues,
            })

    OUT_JSON.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    image_path_to_ids = {}
    for item in output:
        for image_path in item["images"]:
            image_path_to_ids.setdefault(image_path, []).append(item["id"])
    duplicate_image_paths = {
        path: ids for path, ids in image_path_to_ids.items() if len(ids) > 1
    }

    lines = [
        "# Catalogue Manual Review Report",
        "",
        f"Source PDF: `{PDF}`",
        f"Products extracted: {len(output)}",
        f"Products requiring manual review: {len(review)}",
        f"Shared product-code image folders: {len(duplicate_image_paths)}",
        "",
    ]
    if duplicate_image_paths:
        lines.extend(["## Shared Product-Code Folders", ""])
        for path, ids in duplicate_image_paths.items():
            formatted_ids = ", ".join(f"`{item_id}`" for item_id in ids)
            lines.append(f"- `{path}` is shared by: {formatted_ids}")
        lines.append("")

    lines.extend([
        "## Review Items",
        "",
    ])
    for item in review:
        lines.append(f"- `{item['id']}` ({item['category']}, PDF page {item['page']}): {item['name']}")
        lines.append(f"  - Issues: {', '.join(item['issues'])}")
    OUT_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(json.dumps({
        "products": len(output),
        "manual_review": len(review),
        "products_json": str(OUT_JSON),
        "manual_review_report": str(OUT_REPORT),
        "image_root": str(OUT_IMAGES),
    }, indent=2))


if __name__ == "__main__":
    main()
