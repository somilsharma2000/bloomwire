import re

def process_line(line):
    # If line has no font weight class, return as is
    if not re.search(r'\bfont-(thin|light|normal|medium|semibold|bold|extrabold|black)\b', line):
        return line

    # Helper to replace font class in line
    def replace_font(old_class, new_class, current_line):
        return re.sub(r'\b' + old_class + r'\b', new_class, current_line)

    # Let us handle specific patterns on the line

    # 1. Headings: <h1..6>, font-serif main titles, etc.
    # If it's a main heading (h1, h2, h3 or .serif header), font weight should be font-bold
    # Check if line contains h1, h2, h3, h4, h5, h6 or font-serif
    is_heading_tag = bool(re.search(r'<(h1|h2|h3|h4|h5|h6)\b', line))
    is_serif = 'font-serif' in line

    # Exceptions for card titles / subheaders:
    # If h3/h4 is inside a card title or accordion question title, subheader -> font-medium
    is_card_or_subhead = bool(re.search(r'group-hover|faq\.q|p\.name|product\.name|v\.title|s\.title|item\.name|info\.title', line))

    # Buttons / CTAs:
    is_button = bool(re.search(r'<button\b|type="submit"|shimmer-btn|<Link\b.*(rounded-full|rounded-xl|rounded-2xl|py-|px-)|onClick=', line))

    # Badges, Meta, Captions, Prices:
    is_badge_or_meta = bool(re.search(r'rounded-full|text-\[10px\]|text-\[11px\]|text-xs|₹|Petals|pts|PTS|rating|viewing|reviewCount|followers', line)) and not is_heading_tag and not is_button

    # Body text / paragraph:
    is_body = bool(re.search(r'<p\b|<label\b|<span\b', line)) and not is_heading_tag and not is_button and not is_badge_or_meta

    new_line = line

    # Replace font-extrabold / font-black -> font-bold (700) on headings, font-normal/font-medium on meta
    if 'font-extrabold' in new_line or 'font-black' in new_line:
        if is_heading_tag:
            new_line = re.sub(r'\bfont-(extrabold|black)\b', 'font-bold', new_line)
        elif is_button:
            new_line = re.sub(r'\bfont-(extrabold|black)\b', 'font-medium', new_line)
        else:
            new_line = re.sub(r'\bfont-(extrabold|black)\b', 'font-normal', new_line)

    # Replace font-light / font-thin -> font-normal
    if 'font-light' in new_line or 'font-thin' in new_line:
        new_line = re.sub(r'\bfont-(light|thin)\b', 'font-normal', new_line)

    # Replace font-semibold
    if 'font-semibold' in new_line:
        if is_heading_tag and not is_card_or_subhead:
            new_line = re.sub(r'\bfont-semibold\b', 'font-bold', new_line)
        elif is_button or is_card_or_subhead:
            new_line = re.sub(r'\bfont-semibold\b', 'font-medium', new_line)
        else:
            new_line = re.sub(r'\bfont-semibold\b', 'font-normal', new_line)

    return new_line

print("Helper defined")
